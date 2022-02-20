import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';

import { EtapaRepository } from '../repository/etapa.repository';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { InscripcionRepository } from '../repository/inscripcion.repository';
import { EstudianteExamenDetalleRepository } from '../repository/estudianteExamenDetalle.repository';
import { EstudianteExamenDetalle } from '../entity/EstudianteExamenDetalle.entity';
import { EstudianteExamenRepository } from '../repository/estudianteExamen.repository';
import { ResultadosRepository } from '../repository/resultados.repository';
import { GetJsonData } from '../../../common/lib/json.module';

import { Status } from '../../../common/constants';

import {
  NivelDificultad,
  TipoPregunta,
  TipoRespuesta,
} from '../../../common/constants';
import { isSubArray } from '../../../common/lib/array.module';

@Injectable()
export class CalificacionService {
  constructor(
    @InjectRepository(EtapaAreaGradoRepository)
    private etapaAreaGradoRepository: EtapaAreaGradoRepository,
    @InjectRepository(EtapaRepository)
    private etapaRepository: EtapaRepository,
    @InjectRepository(InscripcionRepository)
    private inscripcionRepository: InscripcionRepository,
    @InjectRepository(EstudianteExamenDetalleRepository)
    private estudianteExamenDetalleRepository: EstudianteExamenDetalleRepository,
    @InjectRepository(EstudianteExamenRepository)
    private estudianteExamenRepository: EstudianteExamenRepository,
    @InjectRepository(ResultadosRepository)
    private resultadosRepository: ResultadosRepository,
  ) {}

  private sumarCantidad(datos, inscrito) {
    if (inscrito.tipoPrueba === 'ONLINE') {
      // datos.totalOnline += 1;
      if (['FINALIZADO', 'TIMEOUT'].indexOf(inscrito.examenEstado) >= 0) {
        datos.cantidadOnline += 1;
      }
    } else {
      // datos.totalOffline += 1;
      if (['FINALIZADO', 'TIMEOUT'].indexOf(inscrito.examenEstado) >= 0) {
        datos.cantidadOffline += 1;
      }
    }
    if (inscrito.examenEstado === 'FINALIZADO') {
      datos.examenesFinalizados += 1;
    }
    if (inscrito.examenEstado === 'TIMEOUT') {
      datos.examenesFinalizados += 1;
      datos.examenesTimeout += 1;
    }
    datos.porcentaje =
      parseInt(
        `${(datos.examenesFinalizados / datos.cantidadInscritos) * 1000}`,
      ) / 10;
    if (datos.porcentaje > 100) datos.porcentaje = 100;
  }
  /*
  async listarPaginacion(idEtapa, paginacion) {
    const etapa = await this.etapaRepository.buscarPorId(idEtapa);
    if (!etapa) {
      throw new EntityNotFoundException(
        `Etapa con id ${idEtapa} no encontrado`,
      );
    }
    const { limite, saltar, filtro, orden, pagina } = paginacion;
    console.log({ limite, saltar, filtro, orden, pagina });
    if (orden && orden.startsWith('-')) {
      paginacion.orden = 'DESC';
    } else {
      paginacion.orden = 'ASC';
    }
    const filtros = filtro ? GetJsonData(filtro) : null;
    console.log(filtros);
    const ins = await this.inscripcionRepository.listarParaCalificacionReporteV2(
      idEtapa,
      paginacion,
      filtros,
    );
    const resultados = [];
    const inscripciones = [];
    for (const u of ins) {
      let result = resultados.find((r) => {
        if (
          r.unidadEducativa === u.unidadEducativa &&
          r.codigoSie === u.codigoSie &&
          r.area === u.areaNombre &&
          r.gradoEscolar === u.gradoEscolarNombre
        )
          return true;
      });
      if (!result) {
        result = {
          departamento: u.departamentoNombre,
          distrito: u.distritoNombre,
          unidadEducativa: u.unidadEducativa,
          codigoSie: u.codigoSie,
          area: u.areaNombre,
          gradoEscolar: u.gradoEscolarNombre,
          cantidadInscritos: 0,
          cantidadOnline: 0,
          cantidadOffline: 0,
          // totalOnline: 0,
          // totalOffline: 0,
          examenesFinalizados: 0,
          examenesTimeout: 0,
          porcentaje: 0,
        };
        resultados.push(result);
      }
      if (!inscripciones.find((r) => r.idInscripcion === u.idInscripcion)) {
        result.cantidadInscritos += 1;
        inscripciones.push({ idInscripcion: u.idInscripcion });
      }
      this.sumarCantidad(result, u);
    }
    // console.log(ins);
    return {
      total: resultados.length,
      filas: resultados.slice(saltar, limite * pagina),
    };
  }
  */
  /*
  async listarPaginacion(idEtapa, paginacionQueryDto) {
    const { filtro } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;
    const etapa = await this.etapaRepository.buscarPorId(idEtapa);
    if (!etapa) {
      throw new EntityNotFoundException(
        `Etapa con id ${idEtapa} no encontrado`,
      );
    }
    let calificacion = [];
    let ins = [];
    if (parametros?.csv === 'true') {
      // Demoró bastante en el piloto
      // ins = await this.inscripcionRepository.listarParaCalificacionReporteV3(
      //   idEtapa,
      // );
    } else {
      calificacion = await this.inscripcionRepository.totalCalificacionReporteAgrupado(
        idEtapa,
        paginacionQueryDto,
      );
      ins = await this.inscripcionRepository.listarParaCalificacionReporteSP(
        idEtapa,
        paginacionQueryDto,
      );
    }

    const resultados = [];
    const inscripciones = [];
    for (const u of ins) {
      let result = resultados.find((r) => {
        if (
          r.unidadEducativa === u.unidadEducativa &&
          r.codigoSie === u.codigoSie &&
          r.area === u.areaNombre &&
          r.gradoEscolar === u.gradoEscolarNombre
        )
          return true;
      });
      if (!result) {
        result = {
          departamento: u.departamentoNombre,
          distrito: u.distritoNombre,
          unidadEducativa: u.unidadEducativa,
          codigoSie: u.codigoSie,
          area: u.areaNombre,
          gradoEscolar: u.gradoEscolarNombre,
          cantidadInscritos: 0,
          cantidadOnline: 0,
          cantidadOffline: 0,
          examenesFinalizados: 0,
          examenesTimeout: 0,
          porcentaje: 0,
        };
        resultados.push(result);
      }
      if (!inscripciones.find((r) => r.idInscripcion === u.idInscripcion)) {
        result.cantidadInscritos += 1;
        inscripciones.push({ idInscripcion: u.idInscripcion });
      }
      this.sumarCantidad(result, u);
    }
    const total = parametros?.csv ? resultados.length : calificacion[0]?.total;
    return {
      total: parseInt(total || 0),
      filas: resultados,
    };
  }
  */

  async listarPaginacion(idEtapa, paginacionQueryDto) {
    const { filtro } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;
    const etapa = await this.etapaRepository.buscarPorId(idEtapa);
    if (!etapa) {
      throw new EntityNotFoundException(
        `Etapa con id ${idEtapa} no encontrado`,
      );
    }
    let calificacion = [];
    let ins = [];
    if (parametros?.csv === 'true') {
      ins = await this.inscripcionRepository.listarParaCalificacionReporteV4(
        idEtapa,
        null,
      );
    } else {
      calificacion = await this.inscripcionRepository.totalCalificacionReporteAgrupado(
        idEtapa,
        paginacionQueryDto,
      );
      ins = await this.inscripcionRepository.listarParaCalificacionReporteV4(
        idEtapa,
        paginacionQueryDto,
      );
    }

    const total = parametros?.csv ? ins.length : calificacion[0]?.total;
    return {
      total: parseInt(total || 0),
      filas: ins,
    };
  }

  async listar(idEtapa) {
    const etapa = await this.etapaRepository.buscarPorId(idEtapa);
    if (!etapa) {
      throw new EntityNotFoundException(
        `Etapa con id ${idEtapa} no encontrado`,
      );
    }
    const eags = await this.etapaAreaGradoRepository.listarEtapaAreaGradoPorEtapa(
      idEtapa,
    );
    const resultados = [];
    const inscripciones = [];
    for (const i in eags[0]) {
      const eag = eags[0][i];
      const ins = await this.inscripcionRepository.listarParaCalificacionReporte(
        eag.id,
      );
      for (const u of ins) {
        let result = resultados.find((r) => {
          if (
            r.unidadEducativa === u.unidadEducativa &&
            r.codigoSie === u.codigoSie &&
            r.area === eag.area.nombre &&
            r.gradoEscolar === eag.gradoEscolar.nombre
          )
            return true;
        });
        if (!result) {
          result = {
            unidadEducativa: u.unidadEducativa,
            codigoSie: u.codigoSie,
            area: eag.area.nombre,
            gradoEscolar: eag.gradoEscolar.nombre,
            cantidadInscritos: 0,
            cantidadOnline: 0,
            cantidadOffline: 0,
            // totalOnline: 0,
            // totalOffline: 0,
            examenesFinalizados: 0,
            examenesTimeout: 0,
            porcentaje: 0,
          };
          resultados.push(result);
        }
        if (!inscripciones.find((r) => r.idInscripcion === u.idInscripcion)) {
          result.cantidadInscritos += 1;
          inscripciones.push({ idInscripcion: u.idInscripcion });
        }
        this.sumarCantidad(result, u);
      }
    }

    return resultados;
  }

  optenerPuntajeSegunTipo(eed) {
    let puntaje = '0';
    if (eed.pregunta.tipoPregunta === TipoPregunta.CURRICULA) {
      if (eed.pregunta.nivelDificultad === NivelDificultad.BAJA) {
        puntaje = `${eed.pregunta.etapaAreaGrado.puntajeCurriculaBaja}`;
      } else if (eed.pregunta.nivelDificultad === NivelDificultad.MEDIA) {
        puntaje = `${eed.pregunta.etapaAreaGrado.puntajeCurriculaMedia}`;
      } else if (eed.pregunta.nivelDificultad === NivelDificultad.ALTA) {
        puntaje = `${eed.pregunta.etapaAreaGrado.puntajeCurriculaAlta}`;
      }
    } else if (eed.pregunta.tipoPregunta === TipoPregunta.OLIMPIADA) {
      if (eed.pregunta.nivelDificultad === NivelDificultad.BAJA) {
        puntaje = `${eed.pregunta.etapaAreaGrado.puntajeOlimpiadaBaja}`;
      } else if (eed.pregunta.nivelDificultad === NivelDificultad.MEDIA) {
        puntaje = `${eed.pregunta.etapaAreaGrado.puntajeOlimpiadaMedia}`;
      } else if (eed.pregunta.nivelDificultad === NivelDificultad.ALTA) {
        puntaje = `${eed.pregunta.etapaAreaGrado.puntajeOlimpiadaAlta}`;
      }
    }
    return puntaje;
  }

  async calificarInscripciones(inscripciones, usuarioAuditoria) {
    const procesado = [];
    for (const u of inscripciones) {
      const preguntas = await this.estudianteExamenDetalleRepository.listarPreguntasPorIdExamenParaCalificar(
        u.idEstudianteExamen,
      );
      let puntajeAnulado = 0;
      const calificaciones = [];
      if (!preguntas || !preguntas.length) {
        throw new PreconditionFailedException(
          `El examen ${u.idEstudianteExamen}, no tiene preguntas para calificar.`,
        );
      }
      for (const eed of preguntas) {
        const calificacion = new EstudianteExamenDetalle();
        calificacion.id = eed.id;
        calificacion.estado = 'FINALIZADO';
        calificacion.puntaje = '0';
        calificacion.usuarioCreacion = usuarioAuditoria;
        calificacion.fechaActualizacion = eed.fechaActualizacion;

        const puntaje = this.optenerPuntajeSegunTipo(eed);
        const respuestasEstudiante =
          (eed.respuestas && Object.values(eed.respuestas)) || [];
        if (
          respuestasEstudiante.length === eed.pregunta.respuestas.length &&
          isSubArray(eed.pregunta.respuestas, respuestasEstudiante)
        ) {
          calificacion.puntaje = puntaje;
        }

        // Si no hay puntaje y es multiple, ponderar si la cantidad de respuestas es menor o igual
        if (
          !parseFloat(calificacion.puntaje) &&
          eed.pregunta.tipoRespuesta === TipoRespuesta.SELECCION_MULTIPLE &&
          respuestasEstudiante.length <= eed.pregunta.respuestas.length
        ) {
          let ponderado = 0;
          for (const r of respuestasEstudiante) {
            if (eed.pregunta.respuestas.indexOf(r) >= 0) ponderado++;
          }
          ponderado = ponderado / eed.pregunta.respuestas.length;

          calificacion.puntaje = `${parseFloat(puntaje) * ponderado}`;
        }

        // Para ponderar puntaje preguntas anuladas
        if (eed.pregunta && eed.pregunta.estado === 'ANULADO') {
          puntajeAnulado += parseFloat(puntaje);
          calificacion.puntaje = `0`;
        }

        calificaciones.push(calificacion);
        await this.estudianteExamenDetalleRepository.update(
          {
            id: calificacion.id,
          },
          calificacion,
        );
      }
      procesado.push(calificaciones);
      // await this.estudianteExamenDetalleRepository.save(calificaciones);
      let notaPorExamenAnulado = null;
      if (parseInt(`${100 - puntajeAnulado}`) <= 0) {
        // Caso todas las preguntas anuladas
        if (u.etapaAreaGrado && u.etapaAreaGrado.puntajeMinimoClasificacion) {
          notaPorExamenAnulado =
            u.etapaAreaGrado.puntajeMinimoClasificacion || 0;
        }
      }
      await this.estudianteExamenRepository.calcularPuntajeTotal(
        u.idEstudianteExamen,
        puntajeAnulado,
        notaPorExamenAnulado,
      );
    }
    return procesado;
  }

  async calificar(idEtapa, usuarioAuditoria) {
    // TODO Manejar transacciones
    const etapa = await this.etapaRepository.buscarPorId(idEtapa);
    if (!etapa) {
      throw new EntityNotFoundException(
        `Etapa con id ${idEtapa} no encontrado`,
      );
    }
    // if (etapa.estado === Status.PUBLICACION_RESPUESTAS) {
    //   throw new PreconditionFailedException(
    //     `Esta etapa ya tiene los exámenes calificados`,
    //   );
    // }
    if (
      etapa.estado !== Status.EXAMEN_SEGUN_CRONOGRAMA &&
      etapa.estado !== Status.PUBLICACION_RESPUESTAS
    ) {
      throw new PreconditionFailedException(
        `La etapa se encuentra en estado ${etapa.estado}`,
      );
    }
    const eags = await this.etapaAreaGradoRepository.listarEtapaAreaGradoPorEtapa(
      idEtapa,
    );
    if (!eags || !eags[0] || !eags[0].length) {
      throw new PreconditionFailedException(
        `La etapa no tiene Areas/Grados para calificar.`,
      );
    }
    const resultados = [];
    const areas = [];
    for (const i in eags[0]) {
      const eag = eags[0][i];
      console.info(
        'Area/Grado',
        eag.area.nombre,
        eag.gradoEscolar.nombre,
        eag.estado,
      );
      if (eag.estado !== 'ACTIVO') continue;
      const ins = await this.inscripcionRepository.listarParaCalificacion(
        eag.id,
      );
      console.info(`Calificando ${ins.length} examenes`);
      if (ins.length) {
        await this.etapaRepository.update(
          { id: idEtapa },
          { estadoPosicionamiento: 'CALIFICACION_PROCESO' },
        );
        const calificando = new Promise((resolve, reject) => {
          this.calificarInscripciones(ins, usuarioAuditoria)
            .then((resp) => {
              resolve(resp);
            })
            .catch((err) => {
              reject(err);
            });
        });
        areas.push(calificando);
        resultados.push({
          idEtapaAreaGrado: eag.id,
          cantidad: ins.length,
        });
      } else {
        console.info(
          `El Area/Grado ${eag.area.nombre}/${eag.gradoEscolar.nombre} no tiene examenes finalizados para calificar.`,
        );
        resultados.push({
          idEtapaAreaGrado: eag.id,
          cantidad: 0,
        });
        // throw new PreconditionFailedException(
        //   `El Area/Grado ${eag.area.nombre}/${eag.gradoEscolar.nombre} no tiene examenes finalizados para calificar.`,
        // );
      }
    }
    Promise.all(areas)
      .then(() => {
        this.etapaRepository.update(
          { id: idEtapa },
          { estadoPosicionamiento: 'CALIFICACION' },
        );
      })
      .catch((error) => {
        console.error('[Calificacion]', error);
        this.etapaRepository.update(
          { id: idEtapa },
          { estadoPosicionamiento: 'CALIFICACION_ERROR' },
        );
      });
    if (!resultados.length) {
      throw new PreconditionFailedException(
        `No existen Areas/Grados en estado ACTIVO.`,
      );
    }
    // await this.etapaRepository.actualizarEstado(
    //   idEtapa,
    //   Status.PUBLICACION_RESPUESTAS,
    //   usuarioAuditoria,
    // );
    await this.resultadosRepository.refrescarResultados();

    return resultados;
  }
}
