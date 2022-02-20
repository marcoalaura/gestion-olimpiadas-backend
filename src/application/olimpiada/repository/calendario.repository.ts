import { EntityRepository, getRepository, Repository } from 'typeorm';

import { Calendario } from '../entity/Calendario.entity';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { Status, TipoPrueba } from '../../../common/constants';
@EntityRepository(Calendario)
export class CalendarioRepository extends Repository<Calendario> {
  buscarPorId(id: string) {
    return getRepository(Calendario)
      .createQueryBuilder('calendario')
      .where('calendario.id = :id', { id })
      .getOne();
  }

  /**
   * Metodo para obtener el calendario de un examen
   * La etapa debe encontrarse en [examen online o rezagados]
   * examenes ONLINE
   * @param idEtapaAreaGrado identificador de la etapa-area-grado
   * @param tipoPlanificacion tipo de planificacion del calendario
   * @returns Object
   */
  obtenerCalendarioOnlinePorIdEtapaAreaGrado(
    idEtapaAreaGrado: string,
    tipoPlanificacion: string,
    hito: string,
  ) {
    return getRepository(Calendario)
      .createQueryBuilder('calendario')
      .innerJoinAndSelect('calendario.etapaAreaGrado', 'eag')
      .innerJoinAndSelect('eag.etapa', 'etapa')
      .select([
        'calendario.id',
        'calendario.tipoPrueba',
        'calendario.tipoPlanificacion',
        'calendario.fechaHoraInicio',
        'calendario.fechaHoraFin',
      ])
      .where('calendario.idEtapaAreaGrado = :idEtapaAreaGrado', {
        idEtapaAreaGrado,
      })
      .andWhere('calendario.estado != :estado', { estado: Status.ELIMINADO })
      .andWhere('calendario.tipoPlanificacion = :tipoPlanificacion', {
        tipoPlanificacion,
      })
      .andWhere('calendario.tipoPrueba = :tipoPrueba', {
        tipoPrueba: TipoPrueba.ONLINE,
      })
      .andWhere('etapa.estado = :hito', {
        hito,
      })
      .getOne();
  }

  async contarPorIdEtapaAreaGrado(idEtapaAreaGrado: string) {
    return getRepository(Calendario)
      .createQueryBuilder('calendario')
      .where('calendario.idEtapaAreaGrado = :id', { id: idEtapaAreaGrado })
      .getCount();
  }
  listarCalendariosPorEtapa(
    idEtapa: string,
    paginacionQueryDto: PaginacionQueryDto,
  ) {
    const { limite, saltar } = paginacionQueryDto;
    return getRepository(Calendario)
      .createQueryBuilder('calendario')
      .innerJoinAndSelect('calendario.etapaAreaGrado', 'eag')
      .select([
        'calendario.id',
        'calendario.tipoPrueba',
        'calendario.tipoPlanificacion',
        'calendario.fechaHoraInicio',
        'calendario.fechaHoraFin',
        'eag.id',
        'eag.color',
      ])
      .where('eag.idEtapa = :idEtapa', { idEtapa })
      .andWhere('calendario.estado != :estado', { estado: Status.ELIMINADO })
      .skip(saltar)
      .take(limite)
      .getManyAndCount();
  }
  crear(params: any) {
    return getRepository(Calendario)
      .createQueryBuilder()
      .insert()
      .into(Calendario)
      .values({
        id: params.id,
        tipoPrueba: params.tipoPrueba,
        tipoPlanificacion: params.tipoPlanificacion,
        fechaHoraInicio: params.fechaHoraInicio,
        fechaHoraFin: params.fechaHoraFin,
        etapaAreaGrado: params.etapaAreaGrado,
        usuarioCreacion: params.usuarioAuditoria,
        idEtapaAreaGrado: params.idEtapaAreaGrado,
      })
      .execute();
  }
  actualizarCalendario(idCalendario: string, params: any) {
    return getRepository(Calendario)
      .createQueryBuilder()
      .update(Calendario)
      .set(params)
      .where('id = :id', { id: idCalendario })
      .execute();
  }
  actualizarEstado(params: any) {
    return getRepository(Calendario)
      .createQueryBuilder()
      .update(Calendario)
      .set({
        estado: params.estado,
        usuarioActualizacion: params.usuarioActualizacion,
      })
      .where('id = :id', { id: params.id })
      .execute();
  }

  /**
   * Metodo para buscar calendario en una estapa-area-grado por tipo y tipo planificacion
   * @param idEtapaAreaGrado identificador de la etapa-area-grado
   * @returns Object
   */
  BuscarCalendarioPorEAGTipoPruebaTipoPlanificacion(
    idEtapaAreaGrado: string,
    tipoPrueba: string,
    tipoPlanificacion: string,
  ) {
    return getRepository(Calendario)
      .createQueryBuilder('calendario')
      .where('calendario.idEtapaAreaGrado = :idEtapaAreaGrado', {
        idEtapaAreaGrado,
      })
      .andWhere('calendario.tipoPrueba = :tipoPrueba', { tipoPrueba })
      .andWhere('calendario.tipoPlanificacion = :tipoPlanificacion', {
        tipoPlanificacion,
      })
      .andWhere('calendario.estado != :estado', { estado: Status.ELIMINADO })
      .getOne();
  }
  listarCalendariosOnlineActivosPorEAG(idEtapaAreaGrado: string) {
    return getRepository(Calendario)
      .createQueryBuilder('calendario')
      .select([
        'calendario.id',
        'calendario.tipoPrueba',
        'calendario.tipoPlanificacion',
        'calendario.fechaHoraInicio',
        'calendario.fechaHoraFin',
        'calendario.estado',
      ])
      .where('calendario.idEtapaAreaGrado = :idEtapaAreaGrado', {
        idEtapaAreaGrado,
      })
      .andWhere('calendario.tipoPrueba = :tipoPruebaOnline', {
        tipoPruebaOnline: TipoPrueba.ONLINE,
      })
      .andWhere(
        'now() between calendario.fechaHoraInicio and calendario.fechaHoraFin',
      )
      .andWhere('calendario.estado != :estado', { estado: Status.ELIMINADO })
      .orderBy('calendario.fechaHoraInicio', 'ASC')
      .getMany();
  }
  contarConfiguracionMinimaPorEtapa(idEtapa: string) {
    return getRepository(Calendario)
      .createQueryBuilder('calendario')
      .innerJoinAndSelect('calendario.etapaAreaGrado', 'etapaAreaGrado')
      .innerJoinAndSelect('etapaAreaGrado.etapa', 'etapa')
      .where('etapa.id = :id', { id: idEtapa })
      .getCount();
  }
}
