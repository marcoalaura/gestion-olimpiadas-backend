import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';

import { EtapaRepository } from '../repository/etapa.repository';
import { ResultadosRepository } from '../repository/resultados.repository';
import { Status, tiposEtapa, TransitionEtapa } from '../../../common/constants';
import { maquinaEstadosEtapa } from '../../../common/lib/maquinaEstados.module';
import { EtapaService } from './etapa.service';
import { SorteoPreguntaService } from './sorteoPregunta.service';
import { ObtencionMedalleroService } from './obtencion-medallero.service';
import { ObtenerClasificadosService } from './obtencion-clasificados.service';
import { PublicacionResultadoService } from './publicacionResultado.service';
import { ExamenService } from './examen.service';
import { OlimpiadaRepository } from '../olimpiada.repository';
import { PinoLogger } from 'nestjs-pino';

dayjs.extend(isBetween);
@Injectable()
export class GestionEtapaService {
  constructor(
    @InjectRepository(EtapaRepository)
    private etapaRepositorio: EtapaRepository,
    private resultadosRepository: ResultadosRepository,
    private etapaService: EtapaService,
    private sorteoPreguntaService: SorteoPreguntaService,
    private obtencionMedalleroService: ObtencionMedalleroService,
    private obtencionClasificadosService: ObtenerClasificadosService,
    private publicacionResultadoService: PublicacionResultadoService,
    private examenService: ExamenService,
    private readonly logger: PinoLogger,
  ) {}

  async actualizarEstado(params: any) {
    const etapa = await this.etapaRepositorio.buscarPorId(params.idEtapa);
    if (!etapa) throw new NotFoundException(`Etapa no encontrada`);

    let nuevoEstado = null;
    const op = async (transaction) => {
      nuevoEstado = await this.validarActualizarEstado(
        params.idEtapa,
        params?.operacion?.toLowerCase(),
        params.usuarioAuditoria,
        transaction,
      );

      const etapaRep = transaction.getCustomRepository(EtapaRepository);
      await etapaRep.actualizarEstado(
        params.idEtapa,
        nuevoEstado,
        params.usuarioAuditoria,
      );

      const olimpiadaRep = transaction.getCustomRepository(OlimpiadaRepository);
      if (nuevoEstado === Status.CLOSED && etapa.tipo === tiposEtapa.NACIONAL) {
        await olimpiadaRep.actualizarEstado(
          params.idOlimpiada,
          nuevoEstado,
          params.usuarioAuditoria,
        );
      }
    };
    await this.etapaRepositorio.runTransaction(op);

    // Actualiza vista para reportes al momento de actualizar a estos estados
    if (
      // nuevoEstado === Status.SORTEO_PREGUNTAS ||
      // nuevoEstado === Status.SORTEO_PREGUNTAS_REZAGADOS ||
      // nuevoEstado === Status.CIERRE_PRUEBA_REZAGADOS ||
      // nuevoEstado === Status.PUBLICACION_RESPUESTAS ||
      nuevoEstado === Status.IMPUGNACION_PREGUNTAS_RESPUESTAS ||
      nuevoEstado === Status.OBTENCION_MEDALLERO ||
      nuevoEstado === Status.DESEMPATE ||
      nuevoEstado === Status.GENERAR_CLASIFICADOS ||
      nuevoEstado === Status.PUBLICACION_RESULTADOS ||
      nuevoEstado === Status.CLOSED
    )
      await this.resultadosRepository.refrescarResultados();
    return { id: params.idEtapa };
  }

  // Definimos los metodos que deben llamarse segun el cambio de hito que se haya realizado
  async listarOperaciones(estado: string) {
    return {
      operacion: maquinaEstadosEtapa(estado).getTransitions(),
      operaciones: maquinaEstadosEtapa(estado).getAllTransitions(),
    };
  }

  async validarFechasLimiteEtapaOlimpiada(etapa: any) {
    etapa.idOlimpiada = etapa.olimpiada.id;
    await this.etapaService.validar(etapa);
  }
  // Definimos los metodos que deben llamarse segun el cambio de hito que se haya realizado
  async validarActualizarEstado(
    idEtapa: string,
    operacion: string,
    usuarioAuditoria: string,
    transaction: any,
  ) {
    const etapa = await this.etapaRepositorio.buscarPorId(idEtapa);
    const nuevoEstado = maquinaEstadosEtapa(etapa.estado).executeTransition(
      operacion,
    );
    // Valida que se cambio de estado si se encuentra dentro de la fecha vigencia
    if (
      !dayjs().isBetween(
        dayjs(etapa.fechaInicio),
        // dayjs(etapa.fechaFinImpugnacion).add(1, 'd'),
        dayjs(etapa.fechaFin).add(1, 'd'),
      ) &&
      etapa.estado !== Status.ACTIVE
    ) {
      throw new PreconditionFailedException(
        `No se puede realizar el cambio de estado de la etapa ${etapa.nombre}, debido a que no se encuentra dentro de las fechas de vigencia`,
      );
    }
    // Si existe una etapa anterior, esta debe estar cerrada para continuar con el cambio de estado en la nueva etapa
    if (etapa.jerarquia > 1 && etapa.estado !== Status.ACTIVE) {
      const etapasAnteriores = await this.etapaRepositorio.contarEtapasJerarquiaAnterior(
        etapa.olimpiada.id,
        etapa.jerarquia,
        etapa.id,
      );
      if (etapasAnteriores > 0) {
        throw new PreconditionFailedException(
          `No se puede realizar el cambio de estado de la etapa ${etapa.nombre}, se encontraron otras etapas que aún no fueron cerradas`,
        );
      }
    }

    // PRECONDICIONES para el cambio de estado
    switch (operacion) {
      case TransitionEtapa.ACTIVAR:
        break;
      case TransitionEtapa.CONFIGURAR_GRADOS:
        await this.validarFechasLimiteEtapaOlimpiada(etapa);
        break;
      case TransitionEtapa.CONFIGURAR_COMPETENCIA:
        await this.etapaService.validarConfiguracionGrados(etapa.id);
        break;
      case TransitionEtapa.SORTEAR_PREGUNTAS:
        await this.etapaService.validarRegistroInscritos(etapa.id);
        await this.etapaService.validarConfiguracionCalendario(etapa.id);
        await this.sorteoPreguntaService.cerrarBancoDePreguntas(
          idEtapa,
          usuarioAuditoria,
        );
        break;
      case TransitionEtapa.DESCARGAR_EMPAQUETADOS:
        await this.sorteoPreguntaService.validarEstadoDelSorteoCambiarEstado(
          idEtapa,
        );
        break;
      case TransitionEtapa.DESARROLLAR_EXAMEN:
        break;
      case TransitionEtapa.HABILITAR_REZAGADOS:
        break;
      case TransitionEtapa.SORTEAR_PREGUNTAS_REZAGADOS:
        break;
      case TransitionEtapa.DESARROLLAR_EXAMEN_REZAGADOS:
        break;
      case TransitionEtapa.CERRAR_PRUEBA_REZAGADOS:
        break;
      case TransitionEtapa.PUBLICAR_RESPUESTAS:
        break;
      case TransitionEtapa.IMPUGNAR_PREGUNTAS_RESPUESTAS:
        await this.examenService.validarExisteExamenesCalificados(idEtapa);
        break;
      case TransitionEtapa.OBTENER_MEDALLERO:
        await this.examenService.validarExisteExamenesCalificados(idEtapa);
        break;
      case TransitionEtapa.DESEMPATAR:
        await this.obtencionMedalleroService.validarObtencionMedallero(idEtapa);
        break;
      case TransitionEtapa.CLASIFICAR:
        await this.obtencionMedalleroService.validarDesempates(idEtapa);
        break;
      case TransitionEtapa.PUBLICAR_RESULTADOS:
        // validar que se hayan corrido la clasificacion para esta etapa
        await this.obtencionClasificadosService.verificaEstadoClasificadoGenerado(
          idEtapa,
        );
        break;
      case TransitionEtapa.CERRAR:
        await this.publicacionResultadoService.validarEstudiantesClasificados(
          idEtapa,
        );
        await this.etapaService.cargarClasificadosSiguienteEtapa(
          idEtapa,
          usuarioAuditoria,
          transaction,
        );
        break;
    }
    this.logger.info(
      `Etapa ${etapa.id} - ${etapa.nombre} ejecuto la siguiente operación de cambio de estado: ${operacion}`,
    );
    return nuevoEstado;
  }
}
