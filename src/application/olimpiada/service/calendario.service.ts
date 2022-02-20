import {
  Injectable,
  PreconditionFailedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as uuid from 'uuid';

import { CalendarioRepository } from '../repository/calendario.repository';

import { totalRowsResponse } from '../../../common/lib/http.module';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { TotalRowsResponseDto } from '../../../common/dto/total-rows-response.dto';
import { EtapaService } from '../service/etapa.service';
import {
  Status,
  TipoPrueba,
  TipoPlanificacion,
} from '../../../common/constants';

import * as dayjs from 'dayjs';
import { EtapaRepository } from '../repository/etapa.repository';

@Injectable()
export class CalendarioService {
  hitos = [Status.CONFIGURACION_COMPETENCIA];

  constructor(
    @InjectRepository(CalendarioRepository)
    private readonly calendarioRepository: CalendarioRepository,
    @InjectRepository(EtapaRepository)
    private etapaRepositorio: EtapaRepository,
    private readonly etapaService: EtapaService,
  ) {}

  async listarCalendariosPorEtapa(
    idEtapa: string,
    paginacionQueryDto: PaginacionQueryDto,
  ): Promise<TotalRowsResponseDto> {
    const calendarios = await this.calendarioRepository.listarCalendariosPorEtapa(
      idEtapa,
      paginacionQueryDto,
    );
    const result: any = totalRowsResponse(calendarios);
    for (const cal of result.filas) {
      cal.fechaHoraInicio = new Date(cal.fechaHoraInicio).getTime();
      cal.fechaHoraFin = new Date(cal.fechaHoraFin).getTime();
    }
    return result;
  }

  async crearCalendario(params: any) {
    this.validarFechasCalendario(params);
    await this.etapaService.validarVigenciaDeLaEtapa(
      params.idEtapaAreaGrado,
      this.hitos,
    );
    // validar que no existe un calendario ya creado
    await this.existeCalendarioCreadoParaEAGTipoPruebaTipoPLanificacion(
      params.idEtapaAreaGrado,
      params.tipoPrueba,
      params.tipoPlanificacion,
    );
    // No se permite calendario offline de tipo rezagado
    if (
      params.tipoPrueba === TipoPrueba.OFFLINE &&
      params.tipoPlanificacion === TipoPlanificacion.REZAGADO
    ) {
      throw new PreconditionFailedException(
        'No se permite el registro de un calendario OFFLINE de tipo REZAGADO.',
      );
    }
    // crear calendario
    const data: any = {};
    data.id = uuid.v4();
    data.tipoPrueba = params.tipoPrueba;
    data.tipoPlanificacion = params.tipoPlanificacion;
    data.fechaHoraInicio = params.fechaHoraInicio;
    data.fechaHoraFin = params.fechaHoraFin;
    data.estado = Status.CREATE;
    data.idEtapaAreaGrado = params.idEtapaAreaGrado;
    data.usuarioAuditoria = params.usuarioAuditoria;
    await this.calendarioRepository.crear(data);
    return { id: data.id };
  }

  async actualizarCalendario(params: any) {
    this.validarFechasCalendario(params);
    this.hitos.push(Status.HABILITACION_REZAGADOS);
    await this.validarActualizarDatos(params.idCalendario, params, this.hitos);

    const data: any = {};
    if (params.fechaHoraInicio) data.fechaHoraInicio = params.fechaHoraInicio;
    if (params.fechaHoraFin) data.fechaHoraFin = params.fechaHoraFin;
    if (Object.keys(data).length === 0) {
      throw new PreconditionFailedException(
        'No se tienen datos para actualizar',
      );
    }
    data.usuarioActualizacion = params.usuarioAuditoria;
    await this.calendarioRepository.actualizarCalendario(
      params.idCalendario,
      data,
    );
    return { id: params.idCalendario };
  }

  async eliminarCalendario(idCalendario: string, params: any) {
    console.log(params);
    await this.validarActualizarDatos(idCalendario, {}, this.hitos);
    const data: any = {};
    data.id = idCalendario;
    data.estado = Status.ELIMINADO;
    data.usuarioActualizacion = params.usuarioAuditoria;
    await this.calendarioRepository.actualizarEstado(data);
    return null;
  }

  async validarActualizarDatos(idCalendario: string, params: any, hitos: any) {
    const calendario = await this.obtenerCalendarioPorId(idCalendario);
    if (calendario.estado !== Status.CREATE) {
      throw new PreconditionFailedException(
        `No se puede ejecutar la solicitud, el calendario se encuentra en estado: ${calendario.estado}`,
      );
    }
    if (params?.tipoPrueba && params.tipoPrueba !== calendario.tipoPrueba) {
      throw new PreconditionFailedException(
        'No se puede actualizar el campo tipo prueba',
      );
    }
    if (
      params?.tipoPlanificacion &&
      params.tipoPlanificacion !== calendario.tipoPlanificacion
    ) {
      throw new PreconditionFailedException(
        'No se puede actualizar el campo tipo prueba',
      );
    }
    await this.etapaService.validarVigenciaDeLaEtapa(
      calendario.idEtapaAreaGrado,
      hitos,
    );
    const etapa = await this.etapaRepositorio.obtenerEtapaPorEtapaAreaGrado(
      calendario.idEtapaAreaGrado,
    );
    if (
      etapa?.etapa.estado === Status.HABILITACION_REZAGADOS &&
      !(
        params?.tipoPrueba === TipoPrueba.ONLINE &&
        params?.tipoPlanificacion === TipoPlanificacion.REZAGADO
      )
    ) {
      throw new PreconditionFailedException(
        `No se puede realizar la acción, la etapa ${etapa?.etapa.nombre} se encuentra en estado: ${etapa?.etapa.estado}`,
      );
    }
  }

  async obtenerCalendarioPorId(idCalendario: string) {
    const calendario = await this.calendarioRepository.buscarPorId(
      idCalendario,
    );
    if (!calendario || calendario?.estado === Status.ELIMINADO) {
      throw new NotFoundException();
    }
    return calendario;
  }

  /**
   * Metodo para validar las fechas de inicio y fin de un calendario al crear
   * @param params objeto con las fechas
   */
  validarFechasCalendario(params) {
    if (
      params.fechaHoraInicio &&
      params.fechaHoraFin &&
      !dayjs(params?.fechaHoraFin).isAfter(params?.fechaHoraInicio)
    ) {
      throw new PreconditionFailedException(
        'La fecha fin debe ser posterior a la fecha inicio',
      );
    }
    const fechaActual = dayjs();
    if (fechaActual.isAfter(params?.fechaHoraInicio)) {
      throw new PreconditionFailedException(
        'La fecha incio del calendario no puede ser en el pasado',
      );
    }
    if (fechaActual.isAfter(params?.fechaHoraFin)) {
      throw new PreconditionFailedException(
        'La fecha fin del calendario no puede ser en el pasado',
      );
    }
  }

  async existeCalendarioCreadoParaEAGTipoPruebaTipoPLanificacion(
    idEAG,
    tipoPrueba,
    tipoPlanificacion,
  ) {
    const cal = await this.calendarioRepository.BuscarCalendarioPorEAGTipoPruebaTipoPlanificacion(
      idEAG,
      tipoPrueba,
      tipoPlanificacion,
    );
    if (cal) {
      throw new PreconditionFailedException(
        `Ya se encuentra registrado un calendario para tipo prueba: ${tipoPrueba}, tipo planificación: ${tipoPlanificacion}`,
      );
    }
  }

  async listarCalendariosOnlineActivosPorEAG(idEtapaAreaGrado: string) {
    const calendarios: any = await this.calendarioRepository.listarCalendariosOnlineActivosPorEAG(
      idEtapaAreaGrado,
    );
    for (const cal of calendarios) {
      cal.fechaHoraInicio = cal.fechaHoraInicio.getTime();
      cal.fechaHoraFin = cal.fechaHoraFin.getTime();
    }
    return calendarios;
  }

  async validarConfiguracionCalendario(idEtapa: string) {
    const calendarios = await this.calendarioRepository.contarConfiguracionMinimaPorEtapa(
      idEtapa,
    );
    if (calendarios === 0) {
      throw new PreconditionFailedException(
        `No se puede realizar el cambio de estado a la Etapa, No existe registro de calendario para una etapa-area-grado`,
      );
    }
  }
}
