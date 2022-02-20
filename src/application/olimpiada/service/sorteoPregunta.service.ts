import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  NivelDificultad,
  Status,
  TipoPregunta,
  TipoPrueba,
  TipoPlanificacion,
} from '../../../common/constants';
import * as uuid from 'uuid';

import { removeItem } from '../../../common/lib/array.module';

import { EtapaRepository } from '../repository/etapa.repository';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { PreguntaRepository } from '../repository/pregunta.repository';
import { InscripcionRepository } from '../repository/inscripcion.repository';
import { EstudianteExamenRepository } from '../repository/estudianteExamen.repository';
import { EstudianteExamenDetalleRepository } from '../repository/estudianteExamenDetalle.repository';
import { CalendarioRepository } from '../repository/calendario.repository';

import { EtapaService } from '../service/etapa.service';
import { EtapaAreaGradoService } from '../service/etapaAreaGrado.service';
import { Messages } from '../../../common/constants/response-messages';

@Injectable()
export class SorteoPreguntaService {
  constructor(
    @InjectRepository(EtapaRepository)
    private readonly etapaRepository: EtapaRepository,
    @InjectRepository(EtapaAreaGradoRepository)
    private readonly etapaAreaGradoRepository: EtapaAreaGradoRepository,
    @InjectRepository(PreguntaRepository)
    private readonly preguntaRepository: PreguntaRepository,
    @InjectRepository(InscripcionRepository)
    private readonly inscripcionRepository: InscripcionRepository,
    @InjectRepository(EstudianteExamenRepository)
    private readonly estudianteExamenRepository: EstudianteExamenRepository,
    // @InjectRepository(EstudianteExamenDetalleRepository)
    // private readonly estudianteExamenDetalleRepository: EstudianteExamenDetalleRepository,
    @InjectRepository(CalendarioRepository)
    private readonly calendarioRepository: CalendarioRepository,
    private readonly etapaService: EtapaService,
    private readonly etapaAreaGradoService: EtapaAreaGradoService,
  ) {}

  async sortearPreguntas(idEtapa: string, usuarioAuditoria: string) {
    // obtener etapa vigente
    const etapa = await this.etapaService.obtenerEtapaVigente(idEtapa, [
      Status.SORTEO_PREGUNTAS,
    ]);
    this.validarEstadoDelSorteo(etapa);
    // obtener etapa-area-grados
    const etapasAreaGrado = await this.etapaAreaGradoService.listarParametrosEtapaAreaGradoPorEtapa(
      etapa.id,
    );
    console.log('1: ', etapasAreaGrado);
    // validar minimos contra banco de preguntas
    await this.validarConfiguracionesContraBancoDePreguntas(
      idEtapa,
      etapasAreaGrado,
    );
    // actualizar estado del sorte a en proceso
    this.etapaRepository.actualizar(etapa.id, {
      estadoSorteoPreguntas: Status.EN_PROCESO,
      usuarioActualizacion: usuarioAuditoria,
    });
    // inicia el proceso de sorteo de preguntas
    this.iniciarSorteoPreguntas(etapa, etapasAreaGrado, usuarioAuditoria);
    return {
      idEtapa,
      estado: Status.EN_PROCESO,
      mensaje: Messages.SUCCESS_TEST_GENERATION_START,
    };
  }

  async sortearPreguntasRezagados(idEtapa: string, usuarioAuditoria: string) {
    // obtener etapa vigente, rezagados
    const etapa = await this.etapaService.obtenerEtapaVigente(idEtapa, [
      Status.SORTEO_PREGUNTAS_REZAGADOS,
    ]);
    this.validarEstadoDelSorteoRezagados(etapa);
    // obtener etapa-area-grados
    const etapasAreaGrado = await this.etapaAreaGradoService.listarParametrosEtapaAreaGradoPorEtapa(
      etapa.id,
    );
    // validar minimos contra banco de preguntas
    await this.validarConfiguracionesContraBancoDePreguntas(
      idEtapa,
      etapasAreaGrado,
    );
    // actualizar estado del sorte a en proceso
    this.etapaRepository.actualizar(etapa.id, {
      estadoSorteoPreguntasRezagados: Status.EN_PROCESO,
      usuarioActualizacion: usuarioAuditoria,
    });
    // inicia el proceso de sorteo de preguntas
    this.iniciarSorteoPreguntasRezagados(
      etapa,
      etapasAreaGrado,
      usuarioAuditoria,
    );
    return {
      idEtapa,
      estado: Status.EN_PROCESO,
      mensaje: Messages.SUCCESS_TEST_GENERATION_START,
    };
  }

  async iniciarSorteoPreguntas(
    etapa: any,
    etapasAreaGrado: any,
    usuarioAuditoria: string,
  ) {
    try {
      // obtener estudiantes inscritos a una etapa-area-grado
      for (const eag of etapasAreaGrado) {
        // obtener listado de preguntas por etapa-area-grado
        const preguntasEag = await this.preguntaRepository.listarPreguntasAprobadasPorEtapaAreaGrado(
          eag.id,
        );
        console.log('1.1: preguntasEag: ', preguntasEag?.length);
        // obtener lista de inscritos por etapa-area-grado
        const inscripciones = await this.inscripcionRepository.listarPorEtapaAreaGrado(
          eag.id,
        );
        console.log('1.2: inscripciones: ', inscripciones?.length);
        for (const inscripcion of inscripciones) {
          console.log('1.3: ', inscripcion);
          // generar examen por tipo - registrar datos para el pdf (verificar que no esta generado)
          const examenOnline = async (transaction) => {
            await this.generarExamen(
              inscripcion,
              eag,
              preguntasEag,
              TipoPrueba.ONLINE,
              TipoPlanificacion.CRONOGRAMA,
              usuarioAuditoria,
              transaction,
            );
          };
          await this.estudianteExamenRepository.runTransaction(examenOnline);

          const examenOffline = async (transaction) => {
            await this.generarExamen(
              inscripcion,
              eag,
              preguntasEag,
              TipoPrueba.OFFLINE,
              TipoPlanificacion.CRONOGRAMA,
              usuarioAuditoria,
              transaction,
            );
          };
          await this.estudianteExamenRepository.runTransaction(examenOffline);
        }
      }
      // actualizar estado del sorte a finalizado
      this.etapaRepository.actualizar(etapa.id, {
        estadoSorteoPreguntas: Status.FINALIZADO,
        // estado: Status.GENERACION_EXAMENES,
        usuarioActualizacion: usuarioAuditoria,
      });
    } catch (error) {
      this.etapaRepository.actualizar(etapa.id, {
        estadoSorteoPreguntas: Status.FINALIZADO_ERROR,
        usuarioActualizacion: usuarioAuditoria,
      });
    }
  }

  async iniciarSorteoPreguntasRezagados(
    etapa: any,
    etapasAreaGrado: any,
    usuarioAuditoria: string,
  ) {
    try {
      // obtener estudiantes inscritos a una etapa-area-grado
      for (const eag of etapasAreaGrado) {
        // obtener listado de preguntas por etapa-area-grado
        const preguntasEag = await this.preguntaRepository.listarPreguntasAprobadasPorEtapaAreaGrado(
          eag.id,
        );
        console.log(
          '[iniciarSorteoPreguntasRezagados] 1.1: preguntasEag: ',
          preguntasEag?.length,
        );
        // obtener rezagados por etapaAreaGrado
        const inscripciones = await this.inscripcionRepository.listarRezagadosPorEtapaAreaGrado(
          eag.id,
        );
        console.log(
          '[iniciarSorteoPreguntasRezagados] 1.2: inscripciones: ',
          inscripciones?.length,
        );
        for (const inscripcion of inscripciones) {
          console.log('[iniciarSorteoPreguntasRezagados] 1.3: ', inscripcion);
          // generar examen por tipo - registrar datos para el pdf (verificar que no esta generado)
          const examenOnline = async (transaction) => {
            // marcar como reprogramado el examen de la inscripcion actual
            const estudianteExamenRepositoryTransaction = transaction.getCustomRepository(
              EstudianteExamenRepository,
            );
            const ee = await estudianteExamenRepositoryTransaction.buscarExamenesPorInscripcionRezagados(
              inscripcion.idInscripcion,
            );
            console.log('[iniciarSorteoPreguntasRezagados] ee: ', ee?.length);
            if (ee?.length == 1) {
              await estudianteExamenRepositoryTransaction.reprogramarRezagadoExamen(
                ee[0].id,
                'Reprogramado para rezagados',
                usuarioAuditoria,
              );
              await this.generarExamen(
                inscripcion,
                eag,
                preguntasEag,
                TipoPrueba.ONLINE,
                TipoPlanificacion.REZAGADO,
                usuarioAuditoria,
                transaction,
              );
            } else {
              console.log(
                '[iniciarSorteoPreguntasRezagados] no se genera otro examen, no se encontro examen para rezagados',
              );
            }
          };
          await this.estudianteExamenRepository.runTransaction(examenOnline);
        }
        // actualizar estado del sorteo de rezagados a finalizado
        this.etapaRepository.actualizar(etapa.id, {
          estadoSorteoPreguntasRezagados: Status.FINALIZADO,
          usuarioActualizacion: usuarioAuditoria,
        });
      }
    } catch (error) {
      this.etapaRepository.actualizar(etapa.id, {
        estadoSorteoPreguntasRezagados: Status.FINALIZADO_ERROR,
        usuarioActualizacion: usuarioAuditoria,
      });
    }
  }

  async generarExamen(
    inscripcion: any,
    eag: any,
    bancoPreguntasEag: any,
    tipoPrueba: string,
    tipoPlanificacion: string,
    usuarioAuditoria: string,
    transaction: any,
  ) {
    console.log('[generarExamen] tipoPrueba: ', tipoPrueba);
    console.log('[generarExamen] tipoPlanificacion: ', tipoPlanificacion);
    console.log(
      '[generarExamen] bancoPreguntasEag: ',
      bancoPreguntasEag?.length,
    );
    const estudianteExamenRepositoryTransaction = transaction.getCustomRepository(
      EstudianteExamenRepository,
    );
    const estudianteExamenDetalleRepositoryTransaction = transaction.getCustomRepository(
      EstudianteExamenDetalleRepository,
    );
    // verificar si la inscripcion tiene un examen creado
    const ee = await estudianteExamenRepositoryTransaction.buscarExamenPorInscripcionTipoPrueba(
      { idInscripcion: inscripcion.idInscripcion, tipoPrueba },
    );
    console.log(
      `[generarExamen] tiene examen generado? - inscripcion: ${inscripcion.idInscripcion}, tipoPrueba: ${tipoPrueba} : `,
      ee,
    );
    if (!ee) {
      const preguntasEag: any = bancoPreguntasEag.slice();
      // crear cabecera
      const estudianteExamen = {
        id: uuid.v4(),
        tipoPrueba,
        tipoPlanificacion,
        data: {
          olimpiada: inscripcion.olimpiada,
          rude: inscripcion.rude,
          departamento: inscripcion.departamento,
          area: inscripcion.area,
          distritoEducativo: inscripcion.distritoEducativo,
          gradoEscolar: inscripcion.gradoEscolar,
          estudiante: inscripcion.estudiante,
          etapa: inscripcion.etapa,
        },
        idInscripcion: inscripcion.idInscripcion,
        usuarioAuditoria,
      };
      console.log('[generarExamen] estudianteExamen: ', estudianteExamen);
      await estudianteExamenRepositoryTransaction.crear(estudianteExamen);
      console.log('[generarExamen] estudianteExamen ok ');
      // crear examen detalle
      const eagParametricas = this.construirListaCantidadPreguntas(eag);
      console.log('2: eagParametricas: ', eagParametricas.length);
      for (const eagParametrica of eagParametricas) {
        console.log('2.1: ', eagParametrica);
        if (eagParametricas) {
          for (let i = 0; i < parseInt(eag[eagParametrica.cantidad], 10); i++) {
            let estaCreada: boolean;
            let pregunta: any = null;
            do {
              estaCreada = true;
              pregunta = this.obtenerPreguntaRandom(
                preguntasEag,
                eagParametrica,
              );
              console.log('3: ', pregunta);
              // buscar si la pregunta ya se creo
              const preguntaRegistrada = await estudianteExamenDetalleRepositoryTransaction.buscarPorExamenYPregunta(
                estudianteExamen.id,
                pregunta.id,
              );
              if (!preguntaRegistrada) {
                // crear pregunta en el examen
                const estudianteExamenDetalle = {
                  id: uuid.v4(),
                  idEstudianteExamen: estudianteExamen.id,
                  idPregunta: pregunta.id,
                  usuarioAuditoria,
                };
                await estudianteExamenDetalleRepositoryTransaction.crear(
                  estudianteExamenDetalle,
                );
              } else {
                estaCreada = false;
              }
            } while (!estaCreada);
            removeItem(preguntasEag, pregunta);
          }
        }
      }
    }
  }

  obtenerPreguntaRandom(preguntasEag: any, eagParametrica: any) {
    if (!(preguntasEag && eagParametrica)) {
      throw new Error(
        'Error generar pregunta aleatoria, los parametros son nulos',
      );
    }
    console.log('[obtenerPreguntaRandom] preguntasEag: ', preguntasEag.length);
    console.log('[obtenerPreguntaRandom] eagParametrica: ', eagParametrica);
    const parametroElementos = preguntasEag.filter(
      (e) =>
        e.idEtapaAreaGrado === eagParametrica.idEtapaAreaGrado &&
        e.tipoPregunta === eagParametrica.tipoPregunta &&
        e.nivelDificultad === eagParametrica.nivelDificultad,
    );
    const result =
      parametroElementos[
        Math.floor(Math.random() * (parametroElementos.length - 1))
      ];
    return result;
  }

  async validarConfiguracionesContraBancoDePreguntas(
    idEtapa,
    etapasAreaGrado: any,
  ) {
    if (etapasAreaGrado.length < 1) {
      throw new PreconditionFailedException(
        'No se encuentran etapa-area-grado registradas para la etapa',
      );
    }
    for (const eag of etapasAreaGrado) {
      await this.etapaAreaGradoService.validarConfiguraciones(eag);
    }
    // obtenemos la cantidad de preguntas agrupadas
    const preguntaEtapa = await this.preguntaRepository.contarPorEtapa(idEtapa);
    // validar agrupados
    for (const eag of etapasAreaGrado) {
      const eagParametricas = this.construirListaCantidadPreguntas(eag);
      for (const eagParametrica of eagParametricas) {
        this.validarEtapaAreaGradoTipoPreguntaNivelDificultad(
          eagParametrica,
          eag,
          preguntaEtapa,
        );
      }
    }
  }

  validarEtapaAreaGradoTipoPreguntaNivelDificultad(
    eagParametrica: any,
    eag: any,
    eagAgrupado: any,
  ) {
    if (eag[eagParametrica.cantidad] > 0) {
      const result = eagAgrupado.find(
        (e: any) =>
          e.idEtapaAreaGrado === eagParametrica.idEtapaAreaGrado &&
          e.tipoPregunta === eagParametrica.tipoPregunta &&
          e.nivelDificultad === eagParametrica.nivelDificultad,
      );
      if (!result) {
        throw new PreconditionFailedException(
          `No se tiene preguntas para etapa: ${eag.etapa.nombre}, area: ${eag.area.nombre}, grado: ${eag.gradoEscolar.nombre}, tipo pregunta: ${eagParametrica.tipoPregunta}, nivel de dificultad: ${eagParametrica.nivelDificultad}, no se puede generar el sorteo`,
        );
      }
      if (eag[eagParametrica.cantidad] > result.cantidad) {
        throw new PreconditionFailedException(
          `El banco de preguntas para ${eag.etapa.nombre}, area: ${eag.area.nombre}, grado: ${eag.gradoEscolar.nombre}, tipo pregunta: ${eagParametrica.tipoPregunta}, nivel de dificultad: ${eagParametrica.nivelDificultad}, es insuficiente para generar el sorteo`,
        );
      }
    }
  }

  construirListaCantidadPreguntas(eag: any) {
    console.log('[construirListaCantidadPreguntas] eag: ', eag);
    const parametros = [];
    if (eag.preguntasOlimpiadaAlta > 0) {
      parametros.push({
        idEtapaAreaGrado: eag.id,
        tipoPregunta: TipoPregunta.OLIMPIADA,
        nivelDificultad: NivelDificultad.ALTA,
        cantidad: 'preguntasOlimpiadaAlta',
      });
    }
    if (eag.preguntasOlimpiadaMedia > 0) {
      parametros.push({
        idEtapaAreaGrado: eag.id,
        tipoPregunta: TipoPregunta.OLIMPIADA,
        nivelDificultad: NivelDificultad.MEDIA,
        cantidad: 'preguntasOlimpiadaMedia',
      });
    }
    if (eag.preguntasOlimpiadaBaja > 0) {
      parametros.push({
        idEtapaAreaGrado: eag.id,
        tipoPregunta: TipoPregunta.OLIMPIADA,
        nivelDificultad: NivelDificultad.BAJA,
        cantidad: 'preguntasOlimpiadaBaja',
      });
    }
    if (eag.preguntasCurriculaAlta > 0) {
      parametros.push({
        idEtapaAreaGrado: eag.id,
        tipoPregunta: TipoPregunta.CURRICULA,
        nivelDificultad: NivelDificultad.ALTA,
        cantidad: 'preguntasCurriculaAlta',
      });
    }
    if (eag.preguntasCurriculaMedia > 0) {
      parametros.push({
        idEtapaAreaGrado: eag.id,
        tipoPregunta: TipoPregunta.CURRICULA,
        nivelDificultad: NivelDificultad.MEDIA,
        cantidad: 'preguntasCurriculaMedia',
      });
    }
    if (eag.preguntasCurriculaBaja > 0) {
      parametros.push({
        idEtapaAreaGrado: eag.id,
        tipoPregunta: TipoPregunta.CURRICULA,
        nivelDificultad: NivelDificultad.BAJA,
        cantidad: 'preguntasCurriculaBaja',
      });
    }
    return parametros;
  }

  validarEstadoDelSorteo(etapa: any) {
    if (etapa.estadoSorteoPreguntas === Status.EN_PROCESO) {
      throw new PreconditionFailedException(
        'El sorteo de preguntas se encuentra en proceso',
      );
    }
    if (etapa.estadoSorteoPreguntas === Status.FINALIZADO) {
      throw new PreconditionFailedException(
        `El sorteo para la etapa ${etapa.nombre} ya finalzo`,
      );
    }
  }

  validarEstadoDelSorteoRezagados(etapa: any) {
    if (etapa.estadoSorteoPreguntasRezagados === Status.EN_PROCESO) {
      throw new PreconditionFailedException(
        'El sorteo de preguntas se encuentra en proceso',
      );
    }
    if (etapa.estadoSorteoPreguntasRezagados === Status.FINALIZADO) {
      throw new PreconditionFailedException(
        `El sorteo para la etapa ${etapa.nombre} ya finalzo`,
      );
    }
  }

  async validarEstadoDelSorteoCambiarEstado(idEtapa: any) {
    const etapa = await this.etapaService.obtenerEtapaVigente(idEtapa, [
      Status.SORTEO_PREGUNTAS,
    ]);
    if (etapa.estadoSorteoPreguntas !== Status.FINALIZADO) {
      throw new PreconditionFailedException(
        `El sorteo de examenes para la etapa ${etapa.nombre} no finalizo`,
      );
    }
  }

  /**
   * Metodo para cambiar de hito de la etapa (CIERRE DE BANCO DE PREGUNTAS)
   * @param idEtapa identificador de la etapa
   * @param usuarioAuditoria usuario que realiza la operacion
   */
  async cerrarBancoDePreguntas(idEtapa: string, usuarioAuditoria: string) {
    // obtener etapa vigente
    const etapa = await this.etapaService.obtenerEtapaVigente(idEtapa, [
      Status.CONFIGURACION_COMPETENCIA,
    ]);
    // obtener etapa-area-grados
    // TODO: validar estado?
    const etapasAreaGrado = await this.etapaAreaGradoService.listarParametrosEtapaAreaGradoPorEtapa(
      etapa.id,
    );
    // validar minimos contra banco de preguntas
    await this.validarConfiguracionesContraBancoDePreguntas(
      idEtapa,
      etapasAreaGrado,
    );
    // TODO: actualizar codigo de cada pregunta por etapa area grado
    // actualizar estado de la etapa
    // await this.etapaRepository.actualizar(idEtapa, {
    //   estado: Status.CIERRE_PREGUNTAS,
    //   usuarioActualizacion: usuarioAuditoria,
    // });
  }

  async reiniciarPruebaOnline(
    idEtapaAreaGrado: string,
    idEstudianteExamen: string,
    observacion: string,
    usuarioAuditoria: string,
  ) {
    const eag = await this.etapaAreaGradoRepository.buscarPorIdSimple(
      idEtapaAreaGrado,
    );
    if (!eag) {
      throw new PreconditionFailedException(
        'No se encontro la etapa-area-grado',
      );
    }
    const estudianteExamen = await this.estudianteExamenRepository.findById(
      idEstudianteExamen,
    );
    if (
      !(
        estudianteExamen &&
        estudianteExamen.tipoPrueba === TipoPrueba.ONLINE &&
        (estudianteExamen.estado === Status.ACTIVE ||
          estudianteExamen.estado === Status.EN_PROCESO ||
          estudianteExamen.estado === Status.FINALIZADO ||
          estudianteExamen.estado === Status.TIMEOUT)
      )
    ) {
      throw new PreconditionFailedException(
        'El examen no existe o ya fue reiniciado',
      );
    }
    await this.etapaService.obtenerEtapaVigente(eag.idEtapa, [
      Status.EXAMEN_SEGUN_CRONOGRAMA,
      Status.DESARROLLO_PRUEBAS_REZAGADOS,
    ]);
    // obtener calendarios vigentes de una etapa-area-grado
    const calendarios = await this.calendarioRepository.listarCalendariosOnlineActivosPorEAG(
      idEtapaAreaGrado,
    );
    console.log(' ******************** calendarios: ', calendarios);
    if (!calendarios || calendarios?.length === 0) {
      throw new PreconditionFailedException(
        'No se encontro calendarios vigentes para reiniciar el examen',
      );
    }
    const calendario = calendarios[0];
    // anular examen actual, generar nuevo examen
    const op = async (transaction) => {
      const preguntasEag = await this.preguntaRepository.listarPreguntasAprobadasPorEtapaAreaGrado(
        eag.id,
      );
      console.log(' ******************** preguntasEag: ', preguntasEag);
      const inscripcion = await this.inscripcionRepository.buscarInscripcion(
        estudianteExamen.idInscripcion,
      );
      console.log(' ******************** inscripcion: ', inscripcion);
      // anular
      const repository = transaction.getCustomRepository(
        EstudianteExamenRepository,
      );
      await repository.reprogramarExamen(
        idEstudianteExamen,
        observacion,
        usuarioAuditoria,
      );
      // generar examen por tipo - registrar datos para el pdf (verificar que no esta generado)
      await this.generarExamen(
        inscripcion,
        eag,
        preguntasEag,
        TipoPrueba.ONLINE,
        calendario.tipoPlanificacion,
        usuarioAuditoria,
        transaction,
      );
    };
    await this.estudianteExamenRepository.runTransaction(op);
  }
}
