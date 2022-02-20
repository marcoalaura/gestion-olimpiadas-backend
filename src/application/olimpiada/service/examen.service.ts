import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
import { totalRowsResponse } from '../../../common/lib/http.module';

import { EstudianteExamenRepository } from '../repository/estudianteExamen.repository';
import { EstudianteExamenDetalleRepository } from '../repository/estudianteExamenDetalle.repository';
import { CalendarioRepository } from '../repository/calendario.repository';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import {
  Status,
  TipoPlanificacion,
  TipoPrueba,
} from '../../../common/constants';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class ExamenService {
  constructor(
    @InjectRepository(EstudianteExamenRepository)
    private estudianteExamenRepository: EstudianteExamenRepository,
    @InjectRepository(EstudianteExamenDetalleRepository)
    private estudianteExamenDetalleRepository: EstudianteExamenDetalleRepository,
    @InjectRepository(CalendarioRepository)
    private calendarioRepository: CalendarioRepository,
    @InjectRepository(EtapaAreaGradoRepository)
    private etapaAreaGradoRepository: EtapaAreaGradoRepository,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  /**
   * Metodo para iniciar un examen
   * @param params objeto con los parametros
   * @returns examen
   */
  async iniciarExamen(idExamen: string, params: any) {
    console.log('[iniciarExamen] idExamen: ', idExamen);
    console.log('[iniciarExamen] params: ', params);
    const cabeceraExamen = await this.validarInciarExamen(idExamen);
    const fechaInicio = new Date();
    const fechaFin = new Date(
      fechaInicio.getTime() + cabeceraExamen.duracionMinutos * 60 * 1000,
    );
    await this.estudianteExamenRepository.iniciarExamen(idExamen, {
      fechaInicio,
      fechaFin,
      usuarioAuditoria: params.usuarioAuditoria,
      metadata: params.metadata,
    });
    cabeceraExamen.fechaHoraInicio = fechaInicio;
    cabeceraExamen.fechaHoraFin = fechaFin;
    const examen: any = await this.construirObjetoExamen(cabeceraExamen);
    console.log(' examen: ', examen);
    // programar timeout
    const timeout = examen.duracionMinutos * 60 * 1000; // tiempo en milisegundos
    this.programarTimeoutExamen(examen.idExamen, timeout, {
      idExamen: examen.idExamen,
      usuarioAuditoria: params.usuarioAuditoria,
    });
    return examen;
  }

  /**
   * Metodo que permite recuperar el objeto examen
   * casos de nuevo inicio de sesion o actualizacion de la pagina
   * @param idExamen identificador del examen
   * @param params objeto con parametros de la sesion
   * @returns Object objeto con los datos del examen
   */
  async recuperarExamen(idExamen: string, params: any) {
    console.log(params);
    const cabeceraExamen = await this.validarExamenEnCurso(idExamen);
    const examen = await this.construirObjetoExamen(cabeceraExamen);
    return examen;
  }

  /**
   * Metodo que permite recuperar examenes offline de una determinada UE
   * @param paginacionQueryDto objeto con parametros de consulta
   * @returns Object objeto con los datos del examen
   */
  async recuperarExamenesOffline(paginacionQueryDto: PaginacionQueryDto) {
    const examenesOffline = await this.estudianteExamenRepository.obtenerExamenesOffline(
      paginacionQueryDto,
    );
    return totalRowsResponse(examenesOffline);
  }

  /**
   * Metodo que permite finalizar un examen
   * se puede finalizar si se encuentra dentro del tiempo del examen
   * @param idExamen identificador del examen
   * @param params datos de la session del usuario
   * @returns Object retorna un objeto nulo
   */
  async finalizarExamen(idExamen: string, params: any) {
    console.log(params);
    let fechaActual: any;
    const valid = await this.validarFinalizarExamen(idExamen);
    if (valid?.estado === Status.FINALIZADO) {
      fechaActual = new Date();
      await this.estudianteExamenRepository.finalizarExamen(idExamen, {
        fechaConclusion: fechaActual,
        usuarioAuditoria: params.usuarioAuditoria,
        metadata: params.metadata,
      });
      // remover programacion de timeout
      this.eliminarTimeoutExamen(valid.examen.id);
    } else if (valid?.estado === Status.TIMEOUT) {
      await this.estudianteExamenRepository.timeoutExamen(idExamen, {
        fechaFin: valid.examen?.fechaFin,
        usuarioAuditoria: params.usuarioAuditoria,
        metadata: params.metadata,
      });
    }
    const result: any = valid.examen.data;
    result.fechaInicio = valid.examen?.fechaInicio?.getTime();
    result.fechaFinalizacion = valid.examen.fechaConclusion
      ? valid.examen.fechaConclusion
      : valid?.estado === Status.FINALIZADO
      ? fechaActual.getTime()
      : valid?.estado === Status.TIMEOUT
      ? valid.examen?.fechaFin.getTime()
      : null;
    return result;
  }

  /**
   * Metodo para validar el estado de un examen en curso
   * @param idExamen identificador del examen
   */
  async validarFinalizarExamen(idExamen: string) {
    let estado = null;
    const examen = await this.estudianteExamenRepository.findById(idExamen);
    if (!examen) {
      throw new NotFoundException();
    }
    if (
      examen.estado !== Status.FINALIZADO &&
      examen.estado !== Status.TIMEOUT &&
      examen.estado !== Status.EN_PROCESO
    ) {
      throw new PreconditionFailedException(
        `No se puede finalizar la prueba este se encuentra en estado: ${examen.estado}`,
      );
    }

    if (
      examen.estado === Status.FINALIZADO ||
      examen.estado === Status.TIMEOUT
    ) {
      estado = null;
    }

    if (
      dayjs().isBetween(dayjs(examen.fechaInicio), dayjs(examen.fechaFin)) &&
      examen.estado === Status.EN_PROCESO
    ) {
      estado = Status.FINALIZADO;
    }

    if (
      !dayjs().isBetween(dayjs(examen.fechaInicio), dayjs(examen.fechaFin)) &&
      examen.estado === Status.EN_PROCESO
    ) {
      estado = Status.TIMEOUT;
    }

    return {
      examen,
      estado,
    };
  }

  /**
   * Metodo para validar el estado de un examen en curso
   * @param idExamen identificador del examen
   */
  async validarExamenEnCurso(idExamen: string) {
    const examen = await this.estudianteExamenRepository.obtenerExamenPorId(
      idExamen,
    );
    if (!examen) {
      throw new NotFoundException();
    }
    //
    // validamos que el examen esta en estado EN_PROCESO
    if (examen.estado !== Status.EN_PROCESO) {
      throw new NotFoundException(
        'No se encontró la prueba o este no está en curso',
      );
    }
    // validamos que la fecha actual esta en el periodo del examen
    if (
      !dayjs().isBetween(
        dayjs(examen.fechaHoraInicio),
        dayjs(examen.fechaHoraFin),
      )
    ) {
      throw new PreconditionFailedException(
        'El tiempo de la prueba a concluido',
      );
    }
    return examen;
  }

  /**
   * Metodo para validar el estado de un examen antes de iniciar
   * @param idExamen identificador del examen de un estudiante
   * @Return Object objeto estudianteExamen
   */
  async validarInciarExamen(idExamen: string) {
    const examen: any = await this.estudianteExamenRepository.obtenerExamenPorId(
      idExamen,
    );
    if (!examen) {
      throw new NotFoundException();
    }
    let hitoEtapa = null;
    if (examen.tipoPlanificacion === TipoPlanificacion.CRONOGRAMA)
      hitoEtapa = Status.EXAMEN_SEGUN_CRONOGRAMA;
    if (examen.tipoPlanificacion === TipoPlanificacion.REZAGADO)
      hitoEtapa = Status.DESARROLLO_PRUEBAS_REZAGADOS;

    // TODO: validar que el examen es del estudiante
    // validar que la solicitud es de un examen online
    if (examen.tipoPrueba !== TipoPrueba.ONLINE) {
      throw new NotFoundException('No se encontro la prueba para modo ONLINE');
    }
    // validamos que el examen esta en estado ACTIVO
    if (examen.estado !== Status.ACTIVE) {
      throw new PreconditionFailedException(
        `No se puede iniciar la prueba, este se encuentra en estado ${examen.estado}`,
      );
    }
    // validamos que el examen esta habilitado
    const calendario: any = await this.calendarioRepository.obtenerCalendarioOnlinePorIdEtapaAreaGrado(
      examen.idEtapaAreaGrado,
      examen.tipoPlanificacion,
      hitoEtapa,
    );
    if (!calendario) {
      throw new PreconditionFailedException(
        'No se encontro ningun calendario vigente o no se encuentra en una instancia permitida para dar la prueba, comuniquese con soporte',
      );
    }
    console.log('[validarInciarExamen] calendario: ', calendario);
    if (
      !dayjs().isBetween(
        dayjs(calendario.fechaHoraInicio),
        dayjs(calendario.fechaHoraFin),
      )
    ) {
      throw new PreconditionFailedException(
        'No se puede iniciar la prueba, debe esperar a el horario habilidato',
      );
    }
    return examen;
  }

  /**
   * Metodo que permite construir el objeto examen para renderizar en el cliente
   * @param cabeceraExamen Objeto estudianteExamen
   * @returns Object objeto examen
   */
  async construirObjetoExamen(cabeceraExamen: any) {
    let examen: any = {};
    examen = { ...cabeceraExamen };
    examen.fechaHoraInicio = new Date(examen.fechaHoraInicio).getTime();
    examen.fechaHoraFin = new Date(examen.fechaHoraFin).getTime();
    delete examen.idEtapaAreaGrado;
    const preguntas = await this.estudianteExamenDetalleRepository.listarPreguntasPorIdExamen(
      examen.idExamen,
    );
    examen.fechaHoraServidor = new Date().getTime();
    examen.preguntas = preguntas;
    return examen;
  }

  async guardarRespuestaPorIdExamenIdPregunta(
    idExamen: string,
    idPregunta: string,
    respuestas: Array<any>,
  ) {
    const respuesta = await this.estudianteExamenDetalleRepository.findOne({
      where: {
        pregunta: idPregunta,
        estudianteExamen: idExamen,
      },
    });
    if (!respuesta)
      throw new HttpException(
        { message: 'Prueba y/o pregunta no encontrada' },
        404,
      );
    respuesta.respuestas = respuestas;
    return this.estudianteExamenDetalleRepository.save(respuesta);
  }

  async guardarRespuestaPorId(
    idEstudianteExamenDetalle: string,
    respuestas: Array<any>,
    params: any,
  ) {
    // console.log('[guardarRespuestaPorId] init');
    const fila = await this.estudianteExamenDetalleRepository.encontrarRespuesta(
      idEstudianteExamenDetalle,
    );
    // console.log('[guardarRespuestaPorId] fila: ', fila);
    if (!fila)
      throw new NotFoundException(
        'Pregunta no encontrada y/o no se puede modificar',
      );
    if (
      !(
        fila.estudianteExamen.estado === Status.EN_PROCESO &&
        dayjs().isBetween(
          fila.estudianteExamen.fechaInicio,
          fila.estudianteExamen.fechaFin,
        ) &&
        !fila.estudianteExamen.fechaConclusion
      )
    ) {
      throw new PreconditionFailedException(
        'Respuesta enviada fuera de tiempo',
      );
    }
    console.log('[guardarRespuestaPorId] befor result: ');
    // TODO guardar si fila.respuestas !== respuestas
    if (['verdadero', 'falso'].indexOf(respuestas[0]) >= 0) {
      respuestas[0] = respuestas[0].toUpperCase();
    }
    fila.respuestas = respuestas;
    const result = await this.estudianteExamenDetalleRepository.actualizarRespuesta(
      idEstudianteExamenDetalle,
      fila,
      params,
    );
    console.log('[guardarRespuestaPorId] result: ', result);
    if (!result.affected) {
      throw new PreconditionFailedException({
        message: 'No se guardo la respuesta',
      });
    }
    const respuesta = {
      respuestas: fila.respuestas,
      estudianteExamen: {
        fechaInicio: fila.estudianteExamen.fechaInicio
          ? fila.estudianteExamen.fechaInicio.getTime()
          : null,
        fechaFin: fila.estudianteExamen.fechaFin
          ? fila.estudianteExamen.fechaFin.getTime()
          : null,
        fechaConclusion: fila.estudianteExamen.fechaConclusion
          ? fila.estudianteExamen.fechaConclusion.getTime()
          : null,
        estado: fila.estudianteExamen.estado,
      },
    };
    return respuesta;
  }

  async recuperarExamenCalificacion(idExamen: string) {
    const cabeceraExamen = await this.validarExamenCalificado(idExamen);
    // validamos que el examen esta habilitado
    const eag = await this.etapaAreaGradoRepository.buscarPorId(
      cabeceraExamen.idEtapaAreaGrado,
    );
    if (eag?.etapa?.estado !== Status.PUBLICACION_RESPUESTAS) {
      throw new PreconditionFailedException(
        `No esta permitido ver las respuestas de la prueba, en esta instancia de la olimpiada.`,
      );
    }
    const examen = await this.construirObjetoExamenCalificado(cabeceraExamen);
    return examen;
  }

  async validarExamenCalificado(idExamen: string) {
    const examen = await this.estudianteExamenRepository.obtenerExamenPorId(
      idExamen,
    );
    if (!examen) {
      throw new NotFoundException();
    }
    //
    // validamos que el examen esta en estado EN_PROCESO
    if ([Status.FINALIZADO, Status.TIMEOUT].indexOf(examen.estado) < 0) {
      throw new PreconditionFailedException(
        'No se encontró la prueba o este no está calificado y publicado',
      );
    }
    // validamos que la fecha actual esta en el periodo del examen
    return examen;
  }

  async construirObjetoExamenCalificado(cabeceraExamen: any) {
    let examen: any = {};
    examen = { ...cabeceraExamen };
    examen.fechaHoraInicio = new Date(examen.fechaHoraInicio).getTime();
    examen.fechaHoraFin = new Date(examen.fechaHoraFin).getTime();
    delete examen.idEtapaAreaGrado;
    const preguntas = await this.estudianteExamenDetalleRepository.listarPreguntasPorIdExamenParaCalificar(
      examen.idExamen,
    );
    examen.respuestas = {};
    examen.fechaHoraServidor = new Date().getTime();
    examen.preguntas = preguntas.map((p) => {
      const pre = {
        id: p.id,
        tipoPregunta: p.pregunta.tipoPregunta,
        tipoRespuesta: p.pregunta.tipoRespuesta,
        textoPregunta: p.pregunta.textoPregunta,
        imagenPregunta: p.pregunta.imagenPregunta,
        opciones: p.pregunta.opciones,
        respuestas: {},
        estado: p.pregunta.estado,
        // respuestasSolucion: p.pregunta.respuestas ? p.pregunta.respuestas : [],
      };
      /*
      console.log('p.id :>> ', p.id);
      console.log('p.pregunta.respuestas :>> ', p.pregunta.respuestas);
      console.log('p.respuestas :>> ', p.respuestas);
      console.log('p.pregunta.tipoRespuesta :>> ', p.pregunta.tipoRespuesta);
      console.log('null :>>------------- ');
      */
      if (p.respuestas) {
        for (const r of Object.values(p.respuestas)) {
          if (p.pregunta.respuestas.includes(r)) {
            pre.respuestas[r] = 'correcto';
          } else {
            pre.respuestas[r] = 'incorrecto';
          }
        }
      }
      return pre;
    });
    return examen;
  }

  async obtenerDatosExamenFinalizado(idExamen: string) {
    const examen = await this.estudianteExamenRepository.findById(idExamen);
    console.log(' ************************* examen: ', examen);
    if (
      !(
        examen?.estado === Status.FINALIZADO ||
        examen?.estado === Status.TIMEOUT
      )
    ) {
      throw new NotFoundException(
        'Prueba no encontrada o la prueba no se encuentra finalizado',
      );
    }
    const result: any = examen.data;
    result.fechaInicio = examen?.fechaInicio?.getTime();
    result.fechaFinalizacion = examen?.fechaConclusion?.getTime();
    return result;
  }

  /**
   * Metodo para programar la finalizacion como timeout de un examen
   * @param name identificador del proceso
   * @param milliseconds tiempo de vigencia del examen
   * @param params parametros del examen
   */
  programarTimeoutExamen(name: string, milliseconds: number, params: any) {
    const callback = async () => {
      console.log(
        `[programarTimeoutExamen] Timeout ${name} executing after (${milliseconds})!`,
      );
      const examen = await this.estudianteExamenRepository.findById(
        params.idExamen,
      );
      if (!examen) {
        throw new NotFoundException();
      }
      if (
        examen.estado === Status.EN_PROCESO &&
        dayjs().isAfter(examen.fechaFin)
      ) {
        await this.estudianteExamenRepository.timeoutExamen(params.idExamen, {
          fechaFin: examen.fechaFin,
          usuarioAuditoria: params.usuarioAuditoria,
        });
        console.log(
          `[programarTimeoutExamen] Examen ${params.idExamen} actualizado como timeout`,
        );
      } else {
        console.log(
          `[programarTimeoutExamen] El examen ${params.idExamen} se encuentra en estado: ${examen.estado}, no se realiza cambios`,
        );
      }
    };

    const timeout = setTimeout(callback, milliseconds);
    console.log(`[programarTimeoutExamen] ${name} add!`);
    this.schedulerRegistry.addTimeout(name, timeout);
  }

  eliminarTimeoutExamen(name: string) {
    try {
      const cronJob: CronJob = this.schedulerRegistry.getCronJob(name);
      console.log(`[eliminarTimeoutExamen] find cronJob: ${cronJob}`);
      if (cronJob) {
        this.schedulerRegistry.deleteTimeout(name);
        console.log(`[eliminarTimeoutExamen] Timeout ${name} deleted!`);
      }
    } catch (error) {
      console.error('[eliminarTimeoutExamen] error: ', error);
    }
  }

  async validarExisteExamenesCalificados(idEtapa) {
    const existeCalificado = await this.estudianteExamenRepository.buscarExamenesCalificados(
      idEtapa,
    );
    if (!existeCalificado || !existeCalificado.length) {
      throw new PreconditionFailedException(
        'La etapa no tiene pruebas calificadas.',
      );
    }
    const result = await this.estudianteExamenRepository.buscarExamenesNoCalificados(
      idEtapa,
    );
    if (result && result.length) {
      throw new PreconditionFailedException(
        'Existen pruebas sin calificación.',
      );
    }
    return result;
  }
}
