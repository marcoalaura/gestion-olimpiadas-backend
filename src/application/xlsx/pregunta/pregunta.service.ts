import { PreconditionFailedException, Injectable } from '@nestjs/common';

import * as XLSX from 'xlsx';
import * as uuid from 'uuid';
import * as dayjs from 'dayjs';

import { EtapaAreaGradoRepository } from '../../olimpiada/repository/etapaAreaGrado.repository';
import { PreguntaRepository } from '../../olimpiada/repository/pregunta.repository';

import {
  MIN_CANTIDAD_OPCIONES,
  MIN_CANTIDAD_RESPUESTAS_MULTIPLE,
  MIN_CANTIDAD_RESPUESTAS_SIMPLE,
  NivelDificultad,
  TipoPregunta,
  TipoRespuesta,
  Opciones,
  OpcionesFalsoVerdadero,
  MAX_CARACTERES_TEXTO_PREGUNTA,
  MAX_CARACTERES_OPCIONES,
  Status,
} from '../../../common/constants';
import { isSubArray } from '../../../common/lib/array.module';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';

import * as crypto from 'crypto';
import * as Fs from 'fs';
import * as path from 'path';

const fs = Fs.promises;
const directorioTemporal = process.env.UPLOAD_FILES_PATH || './logs';
fs.mkdir(directorioTemporal).catch(() => {
  // no hace nada
});
const directorioTemporalImages =
  process.env.SERVER_IMAGES_UPLOAD || './imageUploads';

@Injectable()
export class PreguntaService {
  constructor(
    private etapaAreaGradoRepository: EtapaAreaGradoRepository,
    private preguntaRepository: PreguntaRepository,
  ) {}

  async generar() {
    return true;
  }

  async descargarBase64() {
    return true;
  }

  async validarDatosFragmento(body: any, files: any) {
    // Verificar datos del body
    const requeridos = [
      'tamanioArchivo',
      'esUltimo',
      'nombreArchivo',
      'fragmentoActual',
      'totalFragmentos',
      'idEtapaAreaGrado',
    ];
    for (const k of requeridos) {
      if (!body[k]) {
        throw new PreconditionFailedException(`El campo '${k}' es requerido.`);
      }
      body[k] = encodeURI(
        Buffer.from(`ZGF0Y${body[k]}`, 'base64').toString().substr(5),
      );
    }

    // Verificar fragmentos
    let archivo = null;
    // info para unir partes del archivo
    let fileInfo = {
      md5: '',
      totalFragmentos: '0',
      fragmentoActual: '0',
      tamanioArchivo: '0',
    };
    let md5Actual = '';
    const hash = crypto.createHash('md5');

    // fragmento inicial o intermedio
    if (body.fragmentoActual === '1') {
      if (
        body.esUltimo === 'true' &&
        parseInt(body.tamanioArchivo) !== files[0].size
      ) {
        throw new PreconditionFailedException(
          'Tamaño del fragmento no coincide',
        );
      }
      try {
        await fs.unlink(`${directorioTemporal}/${body.nombreArchivo}`);
      } catch (e) {
        /* Archivo no existe */
      }
      try {
        await fs.unlink(`${directorioTemporal}/${body.nombreArchivo}.json`);
      } catch (e) {
        /* Archivo no existe */
      }
    } else {
      if (
        body.esUltimo === 'true' &&
        body.fragmentoActual !== body.totalFragmentos
      ) {
        throw new PreconditionFailedException('El fragmento no es el último');
      }
      try {
        fileInfo = JSON.parse(
          (
            await fs.readFile(
              `${directorioTemporal}/${body.nombreArchivo}.json`,
            )
          ).toString(),
        );
        archivo = await fs.readFile(
          `${directorioTemporal}/${body.nombreArchivo}`,
        );
      } catch (error) {
        console.error('error.', error);
        throw new PreconditionFailedException(
          'Archivo corrupto, envie desde el fragmento inicial',
        );
      }
      hash.update(archivo);
      if (
        parseInt(body.fragmentoActual) !==
        parseInt(fileInfo.fragmentoActual) + 1
      )
        throw new PreconditionFailedException(
          `Fragmento esperado: ${parseInt(fileInfo.fragmentoActual) + 1}`,
        );
      if (parseInt(fileInfo.tamanioArchivo) < archivo.size + files[0].size)
        throw new PreconditionFailedException('Fragmento sobrecargado.');
      if (parseInt(fileInfo.tamanioArchivo) !== parseInt(body.tamanioArchivo))
        throw new PreconditionFailedException('Tamaño de archivo incorrecto.');
      if (parseInt(body.fragmentoActual) > parseInt(fileInfo.totalFragmentos))
        throw new PreconditionFailedException('Fragmento fuera de rango.');
      // if (md5Actual != body.md5Actual) throw new HttpException('Archivo corrupto, con el fragmento enviado.', 412);
    }

    // guardar fragmento
    try {
      md5Actual = hash.update(files[0].buffer).digest('hex');
      await fs.appendFile(
        `${directorioTemporal}/${body.nombreArchivo}`,
        files[0].buffer,
        'binary',
      );
      fs.writeFile(
        `${directorioTemporal}/${body.nombreArchivo}.json`,
        JSON.stringify({
          md5: md5Actual,
          totalFragmentos:
            fileInfo.totalFragmentos === '0'
              ? body.totalFragmentos
              : fileInfo.totalFragmentos,
          fragmentoActual: body.fragmentoActual,
          tamanioArchivo: body.tamanioArchivo,
        }),
      );
    } catch (error) {
      console.error('error..', error);
      throw new PreconditionFailedException(
        'Error al guardar fragmento del archivo.',
      );
    }
    return {
      esUltimo: body.esUltimo,
      nombreArchivo: body.nombreArchivo,
      md5Actual: md5Actual,
      directorioTemporal,
    };
  }

  validarColumnasPregunta(linea, columna, cabeceras) {
    let valido = true;
    const requerido = cabeceras.filter(
      (r) => !Object.keys(columna).includes(r),
    );
    if (requerido.length > 0) {
      columna.errores.requerido = {
        linea,
        error: `Columnas requeridas: ${requerido.join(', ')}`,
      };
      valido = false;
    }
    if (!columna['texto-pregunta'] && !columna['imagen-pregunta']) {
      columna.errores.pregunta = {
        linea,
        error: 'El texto ó imágen de la pregunta es requerido',
      };
      valido = false;
    }
    if (columna['texto-pregunta'] && columna['imagen-pregunta']) {
      columna.errores.pregunta = {
        linea,
        error: 'Las preguntas con imagen no deben contener texto de pregunta',
      };
      valido = false;
    }
    if (
      columna['texto-pregunta'] &&
      columna['texto-pregunta'].length > MAX_CARACTERES_TEXTO_PREGUNTA
    ) {
      columna.errores.preguntaLabel = {
        linea,
        error: `El texto de la pregunta excede los ${MAX_CARACTERES_TEXTO_PREGUNTA} carácteres permitidos`,
      };
      valido = false;
    }
    if (columna['imagen-pregunta']) {
      try {
        const dataFile = Fs.lstatSync(
          path.join(directorioTemporalImages, columna['imagen-pregunta']),
        );
        if (!dataFile.isFile()) {
          throw new Error(
            `${columna['imagen-pregunta']}, no es un archivo válido`,
          );
        }
      } catch (error) {
        console.error('[preguntas-lote]', error.message);
        columna.errores.preguntaImagen = {
          linea,
          error: `No existe la imagen [${columna['imagen-pregunta']}]`,
        };
        valido = false;
      }
    }
    if (
      columna['tipo'] &&
      Object.values(TipoPregunta).indexOf(columna['tipo']) < 0
    ) {
      columna.errores.tipo = {
        linea,
        error: `${columna['tipo']}: no es igual los tipos de pregunta permitido`,
      };
      valido = false;
    }
    if (
      columna['tipo-respuesta'] &&
      Object.values(TipoRespuesta).indexOf(columna['tipo-respuesta']) < 0
    ) {
      columna.errores.tipoRespuesta = {
        linea,
        error: `${columna['tipo-respuesta']}: No es igual a los tipos de respuesta permitido`,
      };
      valido = false;
    }
    if (
      columna['nivel-dificultad'] &&
      Object.values(NivelDificultad).indexOf(columna['nivel-dificultad']) < 0
    ) {
      columna.errores.nivelDificultad = {
        linea,
        error: `${columna['nivel-dificultad']}: No es igual a los niveles de dificultad permitido`,
      };
      valido = false;
    }

    try {
      const opciones = {};
      const respuestas = columna.respuestas
        ? JSON.parse(columna.respuestas)
        : null;
      // parsear opciones
      for (const op of Opciones) {
        if (!!columna[`opcion_${op}`]) opciones[op] = columna[`opcion_${op}`];
        if (opciones[op] && opciones[op].length > MAX_CARACTERES_OPCIONES) {
          columna.errores.opcionLabel = {
            linea,
            error: `El texto de la opcion "${op}" excede los ${MAX_CARACTERES_OPCIONES} carácteres permitidos`,
          };
          valido = false;
        }
      }
      columna.opciones = Object.keys(opciones);

      // TODO Validar formato de falso Verdadero
      if (columna['tipo-respuesta'] == TipoRespuesta.FALSO_VERDADERO) {
        if (Object.keys(opciones).length != 0) {
          columna.errores.opciones = {
            linea,
            error: `Tipo ${columna['tipo-respuesta']} no debe tener ninguna opción`,
          };
          valido = false;
        }
        if (Object.keys(respuestas).length != 1) {
          columna.errores.respuestas = {
            linea,
            error: 'Debe tener solo una respuesta correcta',
          };
          valido = false;
        }
        if (OpcionesFalsoVerdadero.indexOf(respuestas[0]) < 0) {
          columna.errores.respuestasfv = {
            linea,
            error: `Respuesta debe ser ${OpcionesFalsoVerdadero.join(' ó ')}`,
          };
          valido = false;
        }
      }
      // TODO Validar formato seleccion simple
      if (columna['tipo-respuesta'] == TipoRespuesta.SELECCION_SIMPLE) {
        if (Object.keys(opciones).length < MIN_CANTIDAD_OPCIONES) {
          columna.errores.opciones = {
            linea,
            error: `Debe tener por lo menos ${MIN_CANTIDAD_OPCIONES} opciones`,
          };
          valido = false;
        }
        if (Object.keys(respuestas).length !== MIN_CANTIDAD_RESPUESTAS_SIMPLE) {
          columna.errores.respuestas = {
            linea,
            error: `Debe tener ${MIN_CANTIDAD_RESPUESTAS_SIMPLE} respuesta correcta`,
          };
          valido = false;
        }
        if (Object.keys(opciones).indexOf(respuestas[0]) < 0) {
          columna.errores.respuesta = {
            linea,
            error: 'El valor de la respuesta no es parte de las opciones',
          };
          valido = false;
        }
      }
      // TODO Validar formato seleccion multiple
      if (columna['tipo-respuesta'] == TipoRespuesta.SELECCION_MULTIPLE) {
        if (Object.keys(opciones).length < MIN_CANTIDAD_OPCIONES) {
          columna.errores.opciones = {
            linea,
            error: `Debe tener por lo menos ${MIN_CANTIDAD_OPCIONES} opciones`,
          };
          valido = false;
        }
        if (
          Object.keys(respuestas).length < MIN_CANTIDAD_RESPUESTAS_MULTIPLE ||
          Object.keys(respuestas).length > Object.keys(opciones).length
        ) {
          columna.errores.respuestas = {
            linea,
            error: `Debe tener entre ${MIN_CANTIDAD_RESPUESTAS_MULTIPLE} y ${
              Object.keys(opciones).length
            } respuestas correctas`,
          };
          valido = false;
        }
        if (!isSubArray(Object.keys(opciones), respuestas)) {
          columna.errores.respuestas = {
            linea,
            error: `Los valores de las respuestas no son parte de las opciones`,
          };
          valido = false;
        }
      }
    } catch (error) {
      // console.error(error);
      columna.errores.general = {
        linea,
        error: 'Error en formato de opciones y/o respuestas',
      };
    }
    return valido;
  }

  async validarJsonODS(
    datosJson,
    cabeceras,
    idEtapaAreaGrado,
    actualizarEstado,
    user,
  ) {
    const eag = await this.etapaAreaGradoRepository.buscarPorId(
      idEtapaAreaGrado,
    );
    if (!eag) {
      throw new PreconditionFailedException('Etapa area grado no encontrado');
    }
    if (
      !dayjs().isBetween(
        dayjs(eag.etapa?.fechaInicio).startOf('date'),
        dayjs(eag.etapa?.fechaFin).endOf('date'),
      )
    ) {
      throw new PreconditionFailedException(
        `No se puede realizar la acción, la etapa ${eag.etapa?.nombre} no esta en un periodo vigente`,
      );
    }
    if (!(eag.etapa.estado === Status.CONFIGURACION_COMPETENCIA)) {
      throw new PreconditionFailedException(`
        La etapa se encuentra en estado: ${eag.etapa.estado}`);
    }

    let hasError = false;
    const preguntas = [];
    const errores = [];
    for (const i in datosJson) {
      datosJson[i].errores = {};
      let valid = true;

      if (datosJson[i].respuestas) {
        // Reemplazando caracteres similares agregados por el corrector excel, ods
        datosJson[i].respuestas = datosJson[i].respuestas.replace(/“|”/g, '"');
      }
      valid = this.validarColumnasPregunta(
        parseInt(i) + 2,
        datosJson[i],
        cabeceras,
      );

      if (valid) {
        // Crear datos para insert
        const pregunta = {
          id: uuid.v4(),
          // codigo: `${datosJson[i].codigo}`,
          tipoPregunta: datosJson[i].tipo,
          nivelDificultad: datosJson[i]['nivel-dificultad'],
          textoPregunta: datosJson[i]['texto-pregunta'] || null,
          imagenPregunta: datosJson[i]['imagen-pregunta'] || null,
          opciones: {},
          respuestas: JSON.parse(datosJson[i].respuestas),
          etapaAreaGrado: eag,
          tipoRespuesta: datosJson[i]['tipo-respuesta'],
          usuarioCreacion: user.id,
        };
        // parsear opciones
        for (const op of Opciones) {
          if (!!datosJson[i][`opcion_${op}`])
            if (!!pregunta.imagenPregunta) {
              pregunta.opciones[op] = null;
            } else {
              pregunta.opciones[op] = datosJson[i][`opcion_${op}`];
            }
        }
        if (!Object.keys(pregunta.opciones).length) {
          pregunta.opciones = null;
        }

        const buscar = preguntas.find(
          (p) =>
            // p.codigo == datosJson[i].codigo ||
            p.textoPregunta &&
            p.textoPregunta == datosJson[i]['texto-pregunta'] &&
            p.imagenPregunta &&
            p.imagenPregunta == datosJson[i]['imagen-pregunta'],
        );
        if (buscar) {
          Object.assign(buscar, pregunta);
          datosJson[i].errores.crear = {
            linea: parseInt(i) + 2,
            error: `El texto de la pregunta ó la imágen esta repetida`,
          };
          hasError = true;
        } else {
          const p = null;
          // const p = await this.preguntaRepository.buscarPorPregunta(
          //   pregunta.codigo,
          //   idEtapaAreaGrado,
          // );
          // if (p) {
          //   pregunta.id = p.id;
          //   //this.preguntaRepository.save(pregunta);
          //   if (p.estado != 'CREADO') {
          //     datosJson[i].errores.crear = {
          //       linea: parseInt(i) + 2,
          //       error: `La pregunta se encuentra en estado ${p.estado}`,
          //     };
          //     hasError = true;
          //   }
          // }
          if (!p || p.estado === 'CREADO') {
            preguntas.push(pregunta);
          }
        }

        // insertar en fragmentos
        // if (preguntas.length > 2500) {
        //   await this.preguntaRepository.save(preguntas);
        //   preguntas.splice(0, preguntas.length);
        //   if (typeof actualizarEstado === 'function')
        //     actualizarEstado(parseInt(i) + 1);
        // }
      } else {
        hasError = true;
      }
      if (Object.keys(datosJson[i].errores).length) {
        errores.push(datosJson[i]);
      }
      if (parseInt(i) % 2000 === 0) {
        if (typeof actualizarEstado === 'function')
          actualizarEstado(parseInt(i) + 1);
      }
    }
    if (!hasError && preguntas.length > 0) {
      while (preguntas.length > 0) {
        try {
          await this.preguntaRepository.save(preguntas.splice(0, 2000));
        } catch (error) {
          if (error.message.indexOf('pregunta_codigo_idx') > 0) {
            throw new Error(`Verifique la columna codigo: ${error.detail}`);
          }
          throw error;
        }
      }
    }

    return errores;
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
    const tipos = Object.values(TipoPregunta);
    const niveles = Object.values(NivelDificultad);
    const tipoRespuestas = Object.values(TipoRespuesta);
    const respuestas1 = ['["a"]', '["b"]'];
    const respuestas2 = ['["a","b"]', '["b","c"]'];
    const filas = [];
    const opciones = {
      a: 'Descripción de opción "a"',
      b: 'Descripción de opción "b"',
      c: 'Descripción de opción "c"',
      d: `La altura máxima y el alcance.`,
      e: `Un bloque de madera flota primeramente en agua y luego en un líquido.`,
    };

    for (let i = 0; i < (parseInt(query.cantidad) || 20); i++) {
      const fila = {
        // col1: '', // etapas[parseInt(`${Math.random() * etapas.length}`)],
        // col2: '', // areas[parseInt(`${Math.random() * areas.length}`)],
        // col3: '', // codigo: `${2021}${query.codigo || 'E1MAT1S_123456'}_${i + 1}`,
        tipo: tipos[parseInt(`${Math.random() * tipos.length}`)],
        'nivel-dificultad':
          niveles[parseInt(`${Math.random() * niveles.length}`)],
        'texto-pregunta': `Descripción de la pregunta ${i}?`,
        'imagen-pregunta':
          Math.random() < 0.25
            ? `/pregunta${parseInt('' + Math.random() * 10)}.jpg`
            : '',
        'tipo-respuesta':
          tipoRespuestas[parseInt(`${Math.random() * tipoRespuestas.length}`)],
        respuestas:
          respuestas2[parseInt(`${Math.random() * respuestas2.length}`)],
      };
      for (const op of Object.keys(opciones)) {
        if (fila['imagen-pregunta']) {
          fila[`opcion_${op}`] = '[ver_imagen]';
        } else {
          fila[`opcion_${op}`] = opciones[op];
        }
      }
      if (fila['imagen-pregunta']) {
        fila['texto-pregunta'] = null;
      }
      if (fila['tipo-respuesta'] === 'FALSO_VERDADERO') {
        fila.respuestas = Math.random() < 0.5 ? '["FALSO"]' : '["VERDADERO"]';
        for (const op of Object.keys(opciones)) {
          delete fila[`opcion_${op}`];
        }
      }
      if (fila['tipo-respuesta'] === 'SELECCION_SIMPLE') {
        fila.respuestas =
          respuestas1[parseInt(`${Math.random() * respuestas1.length}`)];
      }
      filas.push(fila);
    }
    const workbook = XLSX.utils.book_new();
    const wsName = 'PreguntasMatematicas';
    const ws = XLSX.utils.json_to_sheet(filas);
    XLSX.utils.book_append_sheet(workbook, ws, wsName);

    const archivo = {
      mime: 'application/vnd.oasis.opendocument.spreadsheet',
      name: 'ejemploPreguntas.ods',
      buffer: null,
    };
    if (query.tipo === 'xlsx') {
      archivo.mime =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      archivo.name = 'ejemploPreguntas.xlsx';
    }
    archivo.buffer = await XLSX.write(workbook, {
      type: 'buffer', // 'binary'
      bookType: query.tipo === 'xlsx' ? 'xlsx' : 'ods',
    });

    return archivo;
  }
}
