import { PreconditionFailedException, Injectable } from '@nestjs/common';

import * as XLSX from 'xlsx';
import * as dayjs from 'dayjs';

import { EtapaAreaGradoRepository } from '../../olimpiada/repository/etapaAreaGrado.repository';
import { UnidadEducativaRepository } from '../../olimpiada/repository/unidadEducativa.repository';
import { InscripcionRepository } from '../../../application/olimpiada/repository/inscripcion.repository';

import * as Fs from 'fs';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { PreguntaService } from '../pregunta/pregunta.service';
import { isDateString, isEmpty, isNumber } from 'class-validator';
import { Status, tiposEtapa } from '../../../common/constants';

const fs = Fs.promises;
const directorioTemporal = process.env.UPLOAD_FILES_PATH;

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(UnidadEducativaRepository)
    private unidadEducativaRepositorio: UnidadEducativaRepository,
    @InjectRepository(EtapaAreaGradoRepository)
    private etapaAreaGradoRepositorio: EtapaAreaGradoRepository,
    @InjectRepository(InscripcionRepository)
    private inscripcionRepositorio: InscripcionRepository,
    private readonly preguntaService: PreguntaService,
  ) {}

  async importar(body: any, files: any, usuarioAuditoria: string) {
    const archivo = await this.preguntaService.validarDatosFragmento(
      body,
      files,
    );

    // validar archivo unido-final
    if (archivo.esUltimo === 'true') {
      const headers = [
        'idInscripcion',
        'codigoSie',
        'rude',
        'nroDocumento',
        'tipoDocumento',
        'fechaNacimiento',
        'nombres',
        'primerApellido',
        'segundoApellido',
        'genero',
      ];
      const workbook = XLSX.readFile(
        `${archivo.directorioTemporal}/${archivo.nombreArchivo}`,
      );
      // const workbook = XLSX.read(archivo, {type:'buffer'});
      if (!workbook || !workbook.SheetNames) {
        throw new PreconditionFailedException(
          'Formato de archivo desconocido.',
        );
      }
      if (workbook.SheetNames.length !== 1) {
        throw new PreconditionFailedException(
          'El archivo debe contener solamente una hoja.',
        );
      }
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonSheet = XLSX.utils.sheet_to_json(sheet, { defval: null });
      fs.unlink(`${archivo.directorioTemporal}/${archivo.nombreArchivo}`).catch(
        () => {
          /**/
        },
      );
      fs.unlink(
        `${archivo.directorioTemporal}/${archivo.nombreArchivo}.json`,
      ).catch(() => {
        /**/
      });
      const f = new Date();
      fs.writeFile(
        `${archivo.directorioTemporal}/${archivo.md5Actual}.result.json`,
        JSON.stringify({
          estado: `Procesando archivo ${archivo.nombreArchivo}`,
          fecha: f.getTime(),
          cantidad: 0,
        }),
      );
      if (jsonSheet.length < 1) {
        throw new PreconditionFailedException(
          `Error en el formato del archivo, ver archivo de ejemplo`,
        );
      }
      const validar = headers.filter(
        (r) => !Object.keys(jsonSheet[0]).includes(r),
      );
      if (validar.length > 0) {
        throw new PreconditionFailedException(
          `Columnas requeridas '${validar.join(', ')}', ver archivo de ejemplo`,
        );
      }

      // validar etapa area grado
      const etapaAreaGrado = await this.etapaAreaGradoRepositorio.buscarPorId(
        body.idEtapaAreaGrado,
      );

      if (!etapaAreaGrado) {
        throw new PreconditionFailedException(
          'Etapa, área y grado no encontrado.',
        );
      }

      if (etapaAreaGrado.etapa.tipo !== tiposEtapa.DISTRITAL) {
        throw new PreconditionFailedException(
          `Solo se puede realizar la importación en etapas de tipo ${tiposEtapa.DISTRITAL}.`,
        );
      }
      if (etapaAreaGrado.etapa.estado !== Status.CONFIGURACION_COMPETENCIA) {
        throw new PreconditionFailedException(
          `La etapa debe estar en estado ${Status.CONFIGURACION_COMPETENCIA} para crear y modificar inscripciones.`,
        );
      }

      // validar columnas del archivo asincronamente
      this.validarItems(jsonSheet)
        .then((resultado) => {
          if (resultado.errores.length > 0) {
            this.escribirArchivo(archivo, resultado.errores);
          } else if (resultado.error) {
            this.escribirArchivo(archivo, { error: resultado.error });
          } else {
            this.inscripcionRepositorio
              .guardarImportacion(
                etapaAreaGrado.id,
                jsonSheet,
                usuarioAuditoria,
              )
              .then((registrado) => {
                if (registrado[0].sp_cargar_estudiantes !== 'Ok') {
                  const respuesta = registrado[0]?.sp_cargar_estudiantes;
                  this.escribirArchivo(archivo, JSON.parse(respuesta));
                } else {
                  this.escribirArchivo(archivo, []);
                }
              })
              .catch((error) => {
                this.escribirArchivo(archivo, { error: error.message });
              });
          }
        })
        .catch((error) => {
          this.escribirArchivo(archivo, { error: error.message });
        });

      // Enviar respuesta
      return {
        mensaje: 'Archivo recibido con exito!',
        nombreArchivo: archivo.nombreArchivo,
        codigoArchivo: archivo.md5Actual,
        fecha: f.getTime(),
        json: {
          filas: jsonSheet.length,
          hoja: workbook.SheetNames[0],
        },
      };
    }

    return {
      nombreArchivo: body.nombreArchivo,
      recibido: files[0].size,
      mensaje: 'Fragmento guardado con exito!',
    };
  }

  escribirArchivo(archivo, datos) {
    fs.writeFile(
      `${archivo.directorioTemporal}/${archivo.md5Actual}.result.json`,
      JSON.stringify(datos),
    );
  }

  async validarItems(items: any) {
    const tipoDocumentos = ['CI', 'PASAPORTE', 'OTRO'];
    const generos = ['M', 'F'];

    const errores = [];
    for (const i in items) {
      const linea = parseInt(i) + 2;
      const regexConNumeros = /[0-9]+/g;
      const regexCorreo = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const error: any = {};
      // idInscripcion
      // if (!isNumber(items[i].idInscripcion)) {
      //   error.idInscripcion = {
      //     linea,
      //     error: 'ID de inscripción debe ser un número',
      //   };
      // }
      // codigo sie
      if (!isNumber(items[i].codigoSie)) {
        error.codigoSie = { linea, error: 'El Código SIE debe ser un número' };
      }
      // rude
      if (isEmpty(items[i].rude)) {
        error.rude = { linea, error: 'El Código RUDE no debe estar vacio' };
      }
      // nro documento
      if (isEmpty(items[i].nroDocumento)) {
        error.nroDocumento = {
          linea,
          error: 'El número de documento no puede estar vacio',
        };
      }
      // tipo documento
      if (!tipoDocumentos.includes(items[i].tipoDocumento)) {
        error.tipoDocumento = {
          linea,
          error: 'El tipo de documento no corresponde',
        };
      }
      // fecha nacimiento
      if (!isDateString(items[i].fechaNacimiento)) {
        error.fechaNacimiento = {
          linea,
          error: 'La fecha de nacimiento debe estar en formato YYYY-MM-DD',
        };
      }
      // nombres
      if (isEmpty(items[i].nombres)) {
        error.nombres = { linea, error: 'El nombre no puede estar vacio' };
      }
      if (regexConNumeros.test(items[i]?.nombres)) {
        error.nombres = { linea, error: 'El nombre no puede contener números' };
      }
      // primer apellido, segundo apellido
      if (isEmpty(items[i].primerApellido || items[i].segundoApellido)) {
        error.primerApellido = {
          linea,
          error: 'Al menos debe tener un apellido',
        };
      }
      if (regexConNumeros.test(items[i]?.primerApellido)) {
        error.primerApellido = {
          linea,
          error: 'El primer apellido no puede contener números',
        };
      }
      if (regexConNumeros.test(items[i]?.segundoApellido)) {
        error.segundoApellido = {
          linea,
          error: 'El segundo apellido no puede contener números',
        };
      }
      // genero
      if (!generos.includes(items[i].genero)) {
        error.genero = { linea, error: 'El género no corresponde' };
      }
      // telefono
      if (items[i].telefono) {
        if (
          !(
            items[i].telefono.toString()[0] >= '6' &&
            items[i].telefono.toString()[0] <= '8'
          ) ||
          !(
            items[i].telefono.toString().length >= '6' &&
            items[i].telefono.toString().length <= '8'
          )
        )
          error.telefono = {
            linea,
            error: 'El teléfono no cuenta con el formato solicitado',
          };
      }
      // correo
      if (items[i].correo) {
        if (!regexCorreo.test(items[i].correo)) {
          error.correo = {
            linea,
            error: 'El correo no cuenta con un formato válido',
          };
        }
      }

      if (Object.keys(error).length) {
        errores.push({
          ...items[i],
          errores: error,
        });
      }
    }

    return { errores, error: null };
  }

  randomDate(start: Date, end) {
    return dayjs(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    ).format('YYYY-MM-DD');
  }

  async obtenerArchivoEstado(params: any) {
    try {
      const resultado = JSON.parse(
        (
          await fs.readFile(
            `${directorioTemporal}/${encodeURI(
              params.codigoArchivo,
            )}.result.json`,
          )
        ).toString(),
      );
      return resultado;
    } catch (error) {
      throw new EntityNotFoundException('Archivo subido no encontrado.');
    }
  }

  /**
   * Generar archivo de ejemplo para descargar, solo para pruebas en tiempo de desarrollo
   * @param query cantidad de filas
   */
  async generarEjemplo(query: any) {
    const tipoDocumentos = ['CI'];
    const generos = ['M', 'F'];
    const sies = await this.unidadEducativaRepositorio.listarCodigoSie(100);
    const filas = [];
    for (let i = 0; i < (parseInt(query?.cantidad) || 10); i++) {
      const fila = {
        idInscripcion: i + 1,
        codigoSie: sies[parseInt(`${Math.random() * sies.length}`)].codigoSie,
        rude: `${Math.floor(Math.random() * 10000000000)}`,
        nroDocumento: Math.floor(Math.random() * 10000000),
        tipoDocumento:
          tipoDocumentos[parseInt(`${Math.random() * tipoDocumentos.length}`)],
        fechaNacimiento: this.randomDate(
          new Date(2005, 0, 1),
          new Date(2005, 12.31),
        ),
        nombres: `Nombre`,
        primerApellido: `Primer Apellido`,
        segundoApellido: `Segundo Apellido`,
        genero: generos[parseInt(`${Math.random() * generos.length}`)],
        telefono: Math.floor(Math.random() * 20000000 + 60000000),
        correo: '',
      };
      filas.push(fila);
    }
    const workbook = XLSX.utils.book_new();
    const wsName = 'Estudiantes';
    const ws = XLSX.utils.json_to_sheet(filas);
    XLSX.utils.book_append_sheet(workbook, ws, wsName);

    const archivo = {
      mime: 'application/vnd.oasis.opendocument.spreadsheet',
      name: 'ejemploEstudiantes.ods',
      buffer: null,
    };
    if (query.tipo === 'xlsx') {
      archivo.mime =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      archivo.name = 'ejemploEstudiantes.xlsx';
    }
    archivo.buffer = await XLSX.write(workbook, {
      type: 'buffer', // 'binary'
      bookType: query.tipo === 'xlsx' ? 'xlsx' : 'ods',
    });

    return archivo;
  }
}
