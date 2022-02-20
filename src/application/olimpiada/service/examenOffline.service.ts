/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';

import { EmpaquetadoService } from '../../../core/external-services/empaquetado/empaquetado.service';
import { ExamenOfflineRepository } from '../repository/examenOffline.repository';

import * as Fs from 'fs';
import * as CsvParser from 'csv-parser';
import { Readable } from 'stream';
import * as Readline from 'readline';
import { InjectRepository } from '@nestjs/typeorm';
import { TextService } from 'src/common/lib/text.service';

import { OlimpiadaRepository } from '../olimpiada.repository';
import { UnidadEducativaRepository } from '../repository/unidadEducativa.repository';
import { EtapaRepository } from '../repository/etapa.repository';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { UsuarioRepository } from '../../usuario/usuario.repository';
import { UsuarioRolRepository } from '../../usuario/usuario-rol.repository';
import { GetJsonData } from '../../../common/lib/json.module';
import { EstudianteExamenRepository } from '../repository/estudianteExamen.repository';
import { InscripcionRepository } from '../repository/inscripcion.repository';
import { EstudianteExamenDetalleRepository } from '../repository/estudianteExamenDetalle.repository';
import { decrypt } from '../../../common/lib/encriptador.module';
import * as dayjs from 'dayjs';
import {
  CABECERAS_OFFLINE,
  TipoPrueba,
  Status,
  OfflineMimeType,
} from '../../../common/constants';

const fs = Fs.promises;
@Injectable()
export class ExamenOfflineService {
  constructor(
    private readonly empaquetadoService: EmpaquetadoService,
    @InjectRepository(ExamenOfflineRepository)
    private examenOfflineRepository: ExamenOfflineRepository,
    @InjectRepository(OlimpiadaRepository)
    private olimpiadaRepository: OlimpiadaRepository,
    @InjectRepository(UnidadEducativaRepository)
    private unidadEducativaRepository: UnidadEducativaRepository,
    @InjectRepository(EtapaRepository)
    private etapaRepository: EtapaRepository,
    @InjectRepository(EtapaAreaGradoRepository)
    private etapaAreaGradoRepository: EtapaRepository,
    @InjectRepository(UsuarioRepository)
    private usuarioRepository: UsuarioRepository,
    @InjectRepository(UsuarioRolRepository)
    private usuarioRolRepository: UsuarioRolRepository,
    @InjectRepository(EstudianteExamenRepository)
    private estudianteExamenRepository: EstudianteExamenRepository,
    @InjectRepository(InscripcionRepository)
    private inscripcionRepository: InscripcionRepository,
    @InjectRepository(EstudianteExamenDetalleRepository)
    private estudianteExamenDetalleRepository,
  ) {}

  async obtenerUnidadEducativa(user: any, idUnidadEducativa: any) {
    if (!user) {
      throw new PreconditionFailedException('Usuario no autorizado.');
    }
    if (!user?.rol) {
      throw new PreconditionFailedException('Rol no encontrado.');
    }
    if (!user?.nivel || !user?.nivel.length) {
      throw new PreconditionFailedException('Nivel de usuario no encontrado.');
    }
    const nivel = user.nivel[0];
    // si hay y coincide todo bien
    if (
      nivel.idUnidadEducativa &&
      nivel.idUnidadEducativa === idUnidadEducativa
    ) {
      return idUnidadEducativa;
    }
    // si hay y no coincide no se le deja avanzar
    if (
      nivel.idUnidadEducativa &&
      nivel.idUnidadEducativa !== idUnidadEducativa
    ) {
      throw new PreconditionFailedException(
        'No tiene permiso a la Unidad Educativa',
      );
    }
    const params = Object.assign({}, nivel);
    const ue = await this.unidadEducativaRepository.buscar(
      idUnidadEducativa,
      params,
    );
    if (!ue) {
      throw new PreconditionFailedException(
        'No tiene permiso a la Unidad Educativa',
      );
    }
    return idUnidadEducativa;
  }

  async listarPorOlimpiadaUnidadEducativa(
    idOlimpiada,
    idEtapa,
    idUnidadEducativa,
    paginacionQueryDto,
    user,
  ) {
    const examenOfflineDetalle = null;
    // await this.empaquetadoService.estadoExamenPorUnidadEducativa(
    //   idUE,
    // );

    const descargas = await this.examenOfflineRepository.listarPorOlimpiadaUnidadEducativa(
      idOlimpiada,
      idEtapa,
      idUnidadEducativa,
      paginacionQueryDto,
    );

    return { examenOfflineDetalle, descargas };
  }

  async obtenerPorOlimpiadaUnidadEducativaId(
    idOlimpiada,
    idUnidadEducativa,
    idEtapa,
    id,
    user,
  ) {
    // VERIFICA que el estado de la etapa sea DESCARGA_EMPAQUETADOS
    const etapa = await this.etapaRepository.buscarPorId(idEtapa);
    if (!etapa) {
      throw new PreconditionFailedException('La Etapa no existe.');
    }
    if (!(etapa.estado === Status.DESCARGA_EMPAQUETADOS)) {
      throw new PreconditionFailedException(
        'Para generar el ejecutable debe encontrarse en la etapa DESCARGA_EMPAQUETADOS',
      );
    }
    // const idUE = await this.obtenerUnidadEducativa(user, idUnidadEducativa);
    const descarga = {
      id,
      ruta: null,
      estado: null,
      datos: undefined,
      cantidad: 0,
    };
    const result = await this.examenOfflineRepository.obtenerPorId(
      idOlimpiada,
      idUnidadEducativa,
      id,
    );
    if (result) {
      descarga.ruta = result.ruta;
      descarga.estado = result.estado;
      descarga.datos = result.datos || undefined;
      descarga.cantidad = result.cantidad;
    } else {
      throw new PreconditionFailedException('Registro no encontrado.');
    }

    if (['CREADO', 'PROCESANDO'].indexOf(result.estado) >= 0) {
      try {
        const estado = await this.empaquetadoService.estadoExamenPorUnidadEducativa(
          idUnidadEducativa,
          idEtapa,
        );
        if (estado.completado && estado.url) {
          const result2 = await this.examenOfflineRepository.save({
            id,
            ruta: estado.url,
            estado: 'FINALIZADO',
          });
          descarga.ruta = result2.ruta;
          descarga.estado = result2.estado;
        }
      } catch (error) {
        await this.examenOfflineRepository.save({
          id,
          estado: 'ERROR',
          datos: error.response,
        });
        throw error;
      }
    }
    return descarga;
  }

  async generarEmpaquetado(idOlimpiada, idUnidadEducativa, idEtapa, user) {
    // VERIFICA que el estado de la etapa sea DESCARGA_EMPAQUETADOS
    const etapa = await this.etapaRepository.buscarPorId(idEtapa);
    if (!etapa) {
      throw new PreconditionFailedException('La Etapa no existe.');
    }
    if (!(etapa.estado === Status.DESCARGA_EMPAQUETADOS)) {
      throw new PreconditionFailedException(
        'Para generar el ejecutable debe encontrarse en la etapa DESCARGA_EMPAQUETADOS',
      );
    }

    if (user?.nivel && user?.nivel.length) {
      const nivel = user.nivel.filter(
        (nivel) => nivel.idOlimpiada === idOlimpiada,
      );
      if (!nivel) {
        throw new PreconditionFailedException(
          'No tiene asociado la olimpiada solicitada.',
        );
      }
      user.nivel = nivel;
    }
    const idUE = await this.obtenerUnidadEducativa(user, idUnidadEducativa);
    let descarga = null;
    descarga = await this.examenOfflineRepository.buscarOlimpiadaUnidadEducativaEtapa(
      idOlimpiada,
      idUE,
      idEtapa,
    );
    if (!descarga) {
      const fecha = new Date();
      const id = TextService.generateUuid();
      const datos = await this.armarDatosParaEmpaquetado(
        idOlimpiada,
        idUE,
        idEtapa,
      );
      descarga = await this.examenOfflineRepository.save({
        id,
        estado: 'CREADO',
        usuarioCreacion: user.id,
        idOlimpiada,
        idUnidadEducativa: idUE,
        idEtapa,
        datos: {
          fecha: fecha.getTime(),
        },
      });

      datos.idUsuarioCreacion = user.id;
      datos.idExamenOffline = descarga.id;

      // enviar datos para el empaquetado
      const respuesta = this.empaquetadoService.enviarExamenesOffline(datos);
      // respuesta asincrona del empaquetador TODO podria ser un cron
      respuesta
        .then(async () => {
          descarga = await this.examenOfflineRepository.save({
            id,
            ruta: null,
            estado: 'PROCESANDO',
          });
        })
        .catch(async (error) => {
          console.error('[generarEmpaquetado]', error.message);
          descarga = await this.examenOfflineRepository.save({
            id,
            ruta: null,
            estado: 'ERROR',
            datos: {
              fecha: fecha.getTime(),
              mensaje: error.message,
            },
          });
        });
    } else {
      if (descarga.estado === 'PROCESANDO') {
        // obtener estado en el empaquetador
        const estado = await this.empaquetadoService.estadoExamenPorUnidadEducativa(
          idUE,
          idEtapa,
        );
        if (estado.completado) {
          if (estado.url && descarga) {
            const result2 = await this.examenOfflineRepository.save({
              id: descarga.id,
              ruta: estado.url,
              estado: 'FINALIZADO',
            });
            descarga.ruta = result2.ruta;
            descarga.estado = result2.estado;
          }
        }
      }
    }

    return {
      datos: descarga?.datos,
      estado: descarga?.estado,
      id: descarga.id,
    };
  }

  async armarDatosParaEmpaquetado(idOlimpiada, idUnidadEducativa, idEtapa) {
    const olimpiada = await this.olimpiadaRepository.buscarPorId(idOlimpiada);
    if (!olimpiada) {
      throw new PreconditionFailedException('Olimpiada no encontrada.');
    }
    const unidadEducativa = await this.unidadEducativaRepository.buscarPorId(
      idUnidadEducativa,
    );
    if (!unidadEducativa) {
      throw new PreconditionFailedException('Unidad Educativa no encontrada.');
    }
    const etapa = await this.etapaRepository.buscarPorId(idEtapa);
    if (!etapa) {
      throw new PreconditionFailedException('La Etapa no existe.');
    }

    const etapas = await this.etapaRepository.obtenerDatosParaEmpaquetado(
      idOlimpiada,
      idUnidadEducativa,
      idEtapa,
    );
    // console.log('etapasssssss', JSON.stringify(etapas));
    const datos = {
      idOlimpiada,
      idEtapa,
      olimpiada: olimpiada.nombre,
      idUnidadEducativa,
      codigoSie: unidadEducativa.codigoSie,
      unidadEducativa: unidadEducativa.nombre,
      etapas,
      idUsuarioCreacion: null,
      idExamenOffline: null,
    };

    // this.fs.writeFile('archivoJSON.json', JSON.stringify(datos));

    return datos;
  }

  async descargarEmpaquetadoBinario(descarga: any) {
    const respuesta = await this.empaquetadoService.obtenerEjecutablePorUnidadEducativa(
      descarga.ruta,
    );

    if (
      respuesta.status === 200 &&
      respuesta.headers &&
      respuesta.headers['content-length']
    ) {
      await this.examenOfflineRepository.save({
        id: descarga.id,
        cantidad: (descarga.cantidad || 0) + 1,
      });
    }

    const archivo = {
      headers: respuesta.headers,
      data: respuesta.data,
    };
    return archivo;
    // const archivo = await this.fs.readFile(
    //   descarga.ruta || 'SetupOlimpiadasDemo.zip',
    // );
    // return archivo;
  }

  /**
   * @function importar validar y procesar un archivo de resultados de la app offline
   * @param query req.query
   * @param archivos archivos subidos
   * @param usuario req.user (datos del usuario autenticado)
   */
  async importar(query, archivos: Array<any>, usuario: any) {
    try {
      const ID_UNIDAD_EDUCATIVA = query.idUnidadEducativa;
      const archivo = archivos[0];
      let ESTADO = Status.ACTIVE;

      // VERIFICA LA EXISTENCIA DE ARCHIVO ADJUNTO
      if (!archivos || !archivos[0]) {
        throw new PreconditionFailedException(
          'No existe ningun archivo adjunto',
        );
      }

      // VERIFICA EL TIPO DE ARCHIVO
      if (!this.validaExtension(archivos[0])) {
        throw new PreconditionFailedException('La extensión no es válida');
      }

      // VERIFICA LAS CABECERAS DEL ARCHIVO CSV
      const cabeceraValida = await this.validaCabecera(archivos[0]);
      if (!cabeceraValida) {
        throw new PreconditionFailedException(
          'Los nombres de columna del archivo no son válidos',
        );
      }

      // COPIA DE RESPALDO
      const rutaGuardadoCsv = `${process.env.EXAMENES_OFFLINE}${archivos[0].originalname}`;
      fs.writeFile(`${rutaGuardadoCsv}`, archivos[0].buffer);

      // RECUPERA EL CONTENIDO DEL ARCHIVO EN JSON
      const JSONExamenOfuscado = await this.recuperarJSONExamen(archivos[0]);
      const JSONExamen = this.desofuscarHeaders(JSONExamenOfuscado);

      if (!JSONExamen.length) {
        throw new PreconditionFailedException('El archivo se encuentra vacío.');
      }

      // VERIFICA LA EXISTENCIA DE LA PRUEBA
      // importante! la inscripcion
      const primeraFila = JSONExamen[0];
      const estudianteExamen = await this.estudianteExamenRepository.findOne(
        primeraFila.id_estudiante_examen,
      );
      if (!estudianteExamen) {
        throw new NotFoundException('No se encontró el examen offline.');
      }

      // VERIFICA EL TIPO DE PRUEBA
      if (estudianteExamen.tipoPrueba !== TipoPrueba.OFFLINE) {
        throw new NotFoundException(
          'El tipo de prueba habilitado no corresponde a un examen offline.',
        );
      }

      const inscripcion = await this.inscripcionRepository.buscarPorId(
        estudianteExamen.idInscripcion,
      );
      if (!inscripcion) {
        throw new NotFoundException('No se encontró la inscripción.');
      }
      if (inscripcion.unidadEducativa.id !== ID_UNIDAD_EDUCATIVA) {
        throw new NotFoundException(
          'El archivo no corresponde a la Unidad Educativa Seleccionada.',
        );
      }

      // VALIDANDO QUE EL USUARIO AUTENTICADO PERTENEZCA A LA UNIDAD EDUCATIVA
      if (usuario.nivel) {
        const unidadesEducativasIdSesion = usuario.nivel
          .filter((item) => !!item.idUnidadEducativa)
          .map((item) => item.idUnidadEducativa);

        if (unidadesEducativasIdSesion.length > 0) {
          const usuarioPerteneceUE = unidadesEducativasIdSesion.includes(
            inscripcion.unidadEducativa.id,
          );
          if (!usuarioPerteneceUE) {
            throw new PreconditionFailedException(
              'Solo puede cargar los resultados de la unidad educativa que le fue designada.',
            );
          }
        }
      }

      // VERIFICA estado CIERRE_PRUEBA y CIERRE_PRUEBA_REZAGADOS
      const etapaAreaGrado: any = await this.etapaAreaGradoRepository.buscarPorId(
        inscripcion.etapaAreaGrado.id,
      );

      const idEtapa = etapaAreaGrado.etapa.id;
      const etapa = await this.etapaRepository.buscarPorId(idEtapa);
      if (!etapa) {
        throw new PreconditionFailedException('La Etapa no existe.');
      }
      if (
        !(
          etapa.estado === Status.EXAMEN_SEGUN_CRONOGRAMA ||
          etapa.estado === Status.HABILITACION_REZAGADOS ||
          etapa.estado === Status.SORTEO_PREGUNTAS_REZAGADOS ||
          etapa.estado === Status.DESARROLLO_PRUEBAS_REZAGADOS ||
          etapa.estado === Status.CIERRE_PRUEBA_REZAGADOS
        )
      ) {
        throw new PreconditionFailedException(
          'Para cargar los resultados debe encontrarse una de las siguientes etapas: ' +
            'EXAMEN_SEGUN_CRONOGRAMA, HABILITACION_REZAGADOS, SORTEO_PREGUNTAS_REZAGADOS, ' +
            'DESARROLLO_PRUEBAS_REZAGADOS, CIERRE_PRUEBA_REZAGADOS',
        );
      }

      // VALIDANDO LAS PREGUNTAS DEL EXAMEN
      const todasPreguntas = await this.estudianteExamenDetalleRepository.listarPreguntasPorIdExamen(
        estudianteExamen.id,
      );
      if (todasPreguntas.length !== JSONExamen.length) {
        throw new PreconditionFailedException(
          'La cantidad de preguntas a importar no corresponde con la cantidad de preguntas de la prueba.',
        );
      }
      const eedId = todasPreguntas.map((pregunta) => pregunta.id);
      const tieneAlgunaPreguntaInvalida = JSONExamen.some(
        (pregunta) => !eedId.includes(pregunta.id_estudiante_examen_detalle),
      );
      if (tieneAlgunaPreguntaInvalida) {
        throw new PreconditionFailedException(
          'Algunas preguntas no corresponden con prueba a la que pertenece el estudiante.',
        );
      }

      // VERIFICA QUE EL ESTUDIANTE REALMENTE HAYA INICIADO LA PRUEBA
      if (!primeraFila.fecha_inicio || !primeraFila.fecha_fin) {
        throw new PreconditionFailedException(
          'El estudiante no dió la prueba.',
        );
      }

      if (estudianteExamen.estadoCargadoOffline === Status.FINALIZADO) {
        const archivo = archivos[0];
        throw new PreconditionFailedException(
          'Ya existe un archivo cargado para el estudiante.',
        );
      }

      if (estudianteExamen.estado !== Status.ACTIVE) {
        throw new PreconditionFailedException(
          `La prueba no se encuentra disponible. Estado actual: ${estudianteExamen.estado}.`,
        );
      }

      // si hay fecha conclusion es FINALIZADO caso contrario timeout
      ESTADO = primeraFila.fecha_conclusion
        ? Status.FINALIZADO
        : Status.TIMEOUT;

      const fechaInicio = dayjs(decrypt(primeraFila.fecha_inicio)).toDate();
      const fechaFinal = dayjs(decrypt(primeraFila.fecha_fin)).toDate();

      // empezar el examen
      const op = async (transaction) => {
        const estudianteExamenRepositoryTransaction = transaction.getCustomRepository(
          EstudianteExamenRepository,
        );
        const estudianteExamenDetalleRepositoryTransaction = transaction.getCustomRepository(
          EstudianteExamenDetalleRepository,
        );
        const respuestaIniciar = await estudianteExamenRepositoryTransaction.iniciarExamenOffline(
          estudianteExamen.id,
          fechaInicio,
          fechaFinal,
        );
        // esperamos todas las promesas
        const respuestasDetalle = await Promise.all(
          JSONExamen.map(async (pregunta) => {
            return new Promise(async (resolve, reject) => {
              const fila = await this.estudianteExamenDetalleRepository.encontrarRespuestaOffline(
                pregunta.id_estudiante_examen_detalle,
              );
              if (!fila) {
                reject('Pregunta de examen no encontrada.');
                return;
              }
              if (fila.estudianteExamen.id !== estudianteExamen.id) {
                reject('Archivo inconsistente.');
                return;
              }
              // tratamos respuestas
              let respuestas = '[]';
              if (pregunta.respuestas) {
                respuestas = decrypt(pregunta.respuestas).replace(/'/g, '"');
              }
              fila.respuestas = JSON.parse(respuestas);
              fila.fechaActualizacion = pregunta.fecha_respuesta
                ? dayjs(decrypt(pregunta.fecha_respuesta)).toDate()
                : new Date();
              const respuestaDetalle = await estudianteExamenDetalleRepositoryTransaction.actualizarRespuestaOffline(
                fila.id,
                fila,
                usuario.id,
              );
              resolve(respuestaDetalle);
              return;
            });
          }),
        ).catch((error) => {
          throw new PreconditionFailedException(error);
        });

        // finalizar examen
        let fechaConclusion = null;
        if (ESTADO === Status.FINALIZADO) {
          fechaConclusion = dayjs(
            decrypt(primeraFila.fecha_conclusion),
          ).toDate();
          await estudianteExamenRepositoryTransaction.finalizarExamenOffline(
            estudianteExamen.id,
            fechaConclusion,
            usuario.id,
          );
        } else if (ESTADO === Status.TIMEOUT) {
          await estudianteExamenRepositoryTransaction.timeoutExamenOffline(
            estudianteExamen.id,
            fechaFinal,
            usuario.id,
          );
        }
        // actualizar estados, es importante hacerlo desde la base porque guardamos milisegundos
        // encadenado a la transaccion
        await this.actualizarEstadosExamenes(
          estudianteExamen.idInscripcion,
          usuario,
          transaction,
        );
      };
      await this.estudianteExamenRepository.runTransaction(op);

      return {
        mensaje: 'Archivo recibido con exito!',
        nombreArchivo: archivo.originalname,
        tipo: archivo.mimetype,
      };
    } catch (error) {
      throw new PreconditionFailedException(error.message);
    }
  }

  /**
   * actualzar estados de los examenes de una misma inscripcion
   * @param idInscripcion id inscripcion
   * @param user usuario
   * @return boolean
   * */
  async actualizarEstadosExamenes(
    idInscripcion: string,
    user: any,
    transaction: any,
  ) {
    console.log('actualizando estados');
    const estudianteExamenRepositoryTransaction = transaction.getCustomRepository(
      EstudianteExamenRepository,
    );
    // anular todos los activos.
    await estudianteExamenRepositoryTransaction.anularActivos(
      idInscripcion,
      user.id,
    );
    // importante tiene que estar en la transacion
    const estudianteExamenes = await estudianteExamenRepositoryTransaction.buscarExamenesPorInscripcion(
      idInscripcion,
    );
    // solo debe reevaluar estados si hay mas de un finalizado o timeout
    if (estudianteExamenes.length > 1) {
      const [
        id,
      ] = await estudianteExamenRepositoryTransaction.buscarFechaMinimaConclusion(
        idInscripcion,
      );
      // console.log('iddddd', id);
      if (!id.id) {
        throw new PreconditionFailedException(
          'No existe un examen con fecha de conclusion para esta inscripcion',
        );
      }
      estudianteExamenes.forEach(async (ee) => {
        if (ee.id !== id.id) {
          if (ee.estado === Status.FINALIZADO) {
            await estudianteExamenRepositoryTransaction.invalidarFinalizado(
              ee.id,
              'Anulado por que existe un examen offline anterior',
              user.id,
            );
          }
          if (ee.estado === Status.TIMEOUT) {
            await estudianteExamenRepositoryTransaction.invalidarTimeout(
              ee.id,
              'Anulado por que existe un examen offline anterior',
              user.id,
            );
          }
        }
      });
    }
    // si hay anulados
    return true;
  }

  /**
   * @function valida las cabeceras del archivo subido
   * debe coincidir con el declarado en constants
   * @param archivo archivo fisico
   * @return resultado boolean
   */
  validaCabecera(archivo): Promise<boolean> {
    let contador = 0;
    let headers = [];
    const CABECERAS_OFUSCADAS = Object.keys(CABECERAS_OFFLINE).map(
      (key) => CABECERAS_OFFLINE[key],
    );
    return new Promise((resolve) => {
      const readInterface = Readline.createInterface(
        new BufferStream(archivo.buffer),
      );
      readInterface.on('line', (line) => {
        if (contador === 0) {
          headers = line.split(',');
          if (
            headers.length === CABECERAS_OFUSCADAS.length &&
            headers.every(
              (valor, index) => valor === CABECERAS_OFUSCADAS[index],
            )
          ) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
        contador++;
      });
    });
  }

  /**
   * @function valida la extension del archivo
   * @param archivo archivo fisico
   * @return resultado booleano
   */
  validaExtension(archivo) {
    return OfflineMimeType.includes(archivo.mimetype);
  }

  /**
   * @function recupera el archivo subido en formato CSV
   * @param archivo archivo fisico subido desde el frontend
   * @returns dataJSON archivo parseado a JSON
   */
  async recuperarJSONExamen(archivo): Promise<Array<any>> {
    const results = [];
    return new Promise((resolve, reject) => {
      new BufferStream(archivo.buffer)
        .pipe(CsvParser())
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  desofuscarHeaders(jsonExamenOfuscado: any): any {
    console.log('jsonExamenOfuscado = ', jsonExamenOfuscado);
    const result = jsonExamenOfuscado.map((row) => {
      const newItem: any = {};
      Object.keys(CABECERAS_OFFLINE).forEach((key) => {
        newItem[key] = row[CABECERAS_OFFLINE[key]];
      });
      return newItem;
    });

    console.log('return = ', result);
    return result;
  }

  async obtenerResultadoPruebaSegunCronograma(
    idOlimpiada: string,
    idEtapa: string,
  ) {
    const result = await this.examenOfflineRepository.obtenerResultadoPruebaSegunCronograma(
      idOlimpiada,
      idEtapa,
    );
    return result;
  }
}

/**
 * @class BufferStream implementa Readable para creacion de un stream a partir de un buffer
 */
class BufferStream extends Readable {
  private buffer: any;
  /**
   * @function crea una instancia de BufferStream
   * @param buffer para convertir en stream
   */
  constructor(buffer) {
    super();
    this.buffer = buffer;
  }
  _read() {
    this.push(this.buffer);
    this.push(null);
  }
}
