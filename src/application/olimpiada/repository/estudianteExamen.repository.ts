import { EntityRepository, getRepository, Repository } from 'typeorm';
import { GetJsonData } from '../../../common/lib/json.module';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { EstudianteExamen } from '../entity/EstudianteExamen.entity';
import { Status, TipoPrueba } from '../../../common/constants';

@EntityRepository(EstudianteExamen)
export class EstudianteExamenRepository extends Repository<EstudianteExamen> {
  findById(id: string) {
    return getRepository(EstudianteExamen)
      .createQueryBuilder('estudianteExamen')
      .where('estudianteExamen.id = :id', { id })
      .getOne();
  }
  /**
   * Metodo para obtener un examen por id
   * @param id identificador del examen
   * @returns Object objeto con los datos del examen
   */
  obtenerExamenPorId(id: string) {
    return getRepository(EstudianteExamen)
      .createQueryBuilder('ee')
      .innerJoinAndSelect('ee.inscripcion', 'i')
      .innerJoinAndSelect('i.etapaAreaGrado', 'eag')
      .select([
        'ee.id AS "idExamen"',
        'ee.fechaInicio AS "fechaHoraInicio"',
        'ee.fechaFin AS "fechaHoraFin"',
        'eag.duracionMinutos AS "duracionMinutos"',
        'ee.tipoPrueba AS "tipoPrueba"',
        'ee.tipoPlanificacion AS "tipoPlanificacion"',
        'ee.estado AS estado',
        'eag.id as "idEtapaAreaGrado"',
        'i.idEstudiante AS "idEstudiante"',
      ])
      .where('ee.id = :id', { id })
      .getRawOne();
  }

  /**
   * Metodo para obtener examenes offline por unidadEducativa
   * @param paginacionQueryDto PaginacionQueryDto
   * @returns Object objeto con los datos del examen
   */
  obtenerExamenesOffline(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;
    const query = getRepository(EstudianteExamen)
      .createQueryBuilder('estudianteExamen')
      .leftJoinAndSelect('estudianteExamen.inscripcion', 'inscripcion')
      .leftJoinAndSelect('inscripcion.estudiante', 'estudiante')
      .leftJoinAndSelect('inscripcion.unidadEducativa', 'unidadEducativa')
      .leftJoinAndSelect('unidadEducativa.distrito', 'distrito')
      .leftJoinAndSelect('distrito.departamento', 'departamento')
      .leftJoinAndSelect('estudiante.persona', 'persona')
      .leftJoinAndSelect('inscripcion.etapaAreaGrado', 'etapaAreaGrado')
      .leftJoinAndSelect('etapaAreaGrado.etapa', 'et')
      .leftJoinAndSelect('et.olimpiada', 'olimpiada')
      .leftJoinAndSelect('etapaAreaGrado.area', 'a')
      .leftJoinAndSelect('etapaAreaGrado.gradoEscolar', 'g')
      .select([
        'estudianteExamen.id',
        'estudianteExamen.fechaInicio',
        'estudianteExamen.fechaFin',
        'estudianteExamen.tipoPrueba',
        'estudianteExamen.tipoPrueba',
        'estudianteExamen.estado',
        'estudianteExamen.estadoCargadoOffline',
        'estudianteExamen.fechaCargadoOffline',
        'inscripcion.id',
        'estudiante.id',
        'estudiante.rude',
        'etapaAreaGrado.id',
        'a.nombre',
        'g.nombre',
        'persona.id',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
        'persona.tipoDocumento',
        'persona.nroDocumento',
        'persona.fechaNacimiento',
        'persona.genero',
        'persona.telefono',
        'persona.correoElectronico',
        'unidadEducativa.nombre',
        'unidadEducativa.codigoSie',
      ])
      .skip(saltar)
      .take(limite);
    query.andWhere('estudianteExamen.tipoPrueba = :tipoPrueba', {
      tipoPrueba: 'OFFLINE',
    });
    // query.andWhere('ee. = :tipoPrueba', { tipoPrueba: 'OFFLINE' });
    if (parametros?.estado) {
      query.andWhere('estudianteExamen.estado = :estado', {
        estado: parametros.estado,
      });
    }
    if (parametros?.idUnidadEducativa) {
      query.andWhere('unidadEducativa.id = :idUnidadEducativa', {
        idUnidadEducativa: parametros.idUnidadEducativa,
      });
    }
    if (parametros?.idDistrito) {
      query.andWhere('distrito.id = :idDistrito', {
        idDistrito: parametros.idDistrito,
      });
    }

    if (parametros?.idDepartamento) {
      query.andWhere('departamento.id = :idDepartamento', {
        idDepartamento: parametros.idDepartamento,
      });
    }
    if (parametros?.idEtapa) {
      query.andWhere('et.id = :idEtapa', {
        idEtapa: parametros.idEtapa,
      });
    }
    if (parametros?.idOlimpiada) {
      query.andWhere('olimpiada.id = :idOlimpiada', {
        idOlimpiada: parametros.idOlimpiada,
      });
    }
    return query.getManyAndCount();
  }
  crear(params: any) {
    return this.createQueryBuilder('estudianteExamen')
      .insert()
      .into(EstudianteExamen)
      .values({
        id: params.id,
        fechaInicio: null,
        fechaFin: null,
        fechaConclusion: null,
        estado: Status.ACTIVE,
        tipoPrueba: params.tipoPrueba,
        tipoPlanificacion: params.tipoPlanificacion,
        data: params.data,
        hashExamen: null,
        idInscripcion: params.idInscripcion,
        fechaCreacion: new Date(),
        usuarioCreacion: params.usuarioAuditoria,
      })
      .execute();
  }

  iniciarExamen(id: string, params: any) {
    return getRepository(EstudianteExamen)
      .createQueryBuilder()
      .update(EstudianteExamen)
      .set({
        estado: Status.EN_PROCESO,
        fechaInicio: params.fechaInicio,
        fechaFin: params.fechaFin,
        metadata: params.metadata,
        usuarioActualizacion: params.usuarioAuditoria,
        fechaActualizacion: new Date(),
      })
      .where('id = :id', { id })
      .execute();
  }
  iniciarExamenOffline(
    id: string,
    fechaInicio: Date,
    fechaFin: Date,
    usuarioActualizacion: string,
  ) {
    return this.createQueryBuilder('estudianteExamen')
      .update(EstudianteExamen)
      .set({
        estado: Status.EN_PROCESO,
        fechaInicio,
        fechaFin,
        usuarioActualizacion,
        fechaActualizacion: new Date(),
      })
      .where('id = :id', { id })
      .execute();
  }

  finalizarExamen(id: string, params: any) {
    return getRepository(EstudianteExamen)
      .createQueryBuilder()
      .update(EstudianteExamen)
      .set({
        estado: Status.FINALIZADO,
        fechaConclusion: params.fechaConclusion,
        metadata: params.metadata,
        usuarioActualizacion: params.usuarioAuditoria,
        fechaActualizacion: new Date(),
      })
      .where('id = :id', { id })
      .execute();
  }

  finalizarExamenOffline(
    id: string,
    fechaConclusion: Date,
    usuarioActualizacion: string,
  ) {
    return this.createQueryBuilder('estudianteExamen')
      .update(EstudianteExamen)
      .set({
        estado: Status.FINALIZADO,
        fechaConclusion,
        estadoCargadoOffline: Status.FINALIZADO,
        fechaCargadoOffline: new Date(),
        fechaActualizacion: new Date(),
        usuarioActualizacion,
      })
      .where('id = :id', { id })
      .execute();
  }

  timeoutExamen(id: string, params: any) {
    return getRepository(EstudianteExamen)
      .createQueryBuilder()
      .update(EstudianteExamen)
      .set({
        estado: Status.TIMEOUT,
        fechaConclusion: params.fechaFin,
        metadata: params.metadata,
        usuarioActualizacion: params.usuarioAuditoria,
        fechaActualizacion: new Date(),
      })
      .where('id = :id', { id })
      .execute();
  }

  timeoutExamenOffline(
    id: string,
    fechaFin: Date,
    usuarioActualizacion: string,
  ) {
    return this.createQueryBuilder('estudianteExamen')
      .update(EstudianteExamen)
      .set({
        estado: Status.TIMEOUT,
        fechaConclusion: fechaFin,
        estadoCargadoOffline: Status.FINALIZADO,
        fechaCargadoOffline: new Date(),
        usuarioActualizacion,
        fechaActualizacion: new Date(),
      })
      .where('id = :id', { id })
      .execute();
  }

  anularExamen(id: string, observacion: string, usuarioAuditoria: string) {
    return this.actualizarEstado(
      id,
      Status.ANULADO,
      observacion,
      usuarioAuditoria,
    );
  }

  inactivarExamen(id: string, observacion: string, usuarioAuditoria: string) {
    return this.actualizarEstado(
      id,
      Status.INACTIVE,
      observacion,
      usuarioAuditoria,
    );
  }

  reprogramarExamen(id: string, observacion: string, usuarioAuditoria: string) {
    return this.actualizarEstado(
      id,
      Status.REPROGRAMADO,
      observacion,
      usuarioAuditoria,
    );
  }

  reprogramarRezagadoExamen(
    id: string,
    observacion: string,
    usuarioAuditoria: string,
  ) {
    return this.actualizarEstado(
      id,
      Status.REPROGRAMADO_REZAGADO,
      observacion,
      usuarioAuditoria,
    );
  }

  private actualizarEstado(
    id: string,
    estado: string,
    observacion: string,
    usuarioAuditoria: string,
  ) {
    return this.createQueryBuilder('estudianteExamen')
      .update(EstudianteExamen)
      .set({
        estado,
        observacion,
        usuarioActualizacion: usuarioAuditoria,
        fechaActualizacion: new Date(),
      })
      .where('id = :id', { id })
      .execute();
  }

  obtenerExamenEnProceso(id: string) {
    return getRepository(EstudianteExamen)
      .createQueryBuilder('estudianteExamen')
      .where('estudianteExamen.id = :id', { id })
      .andWhere('estudianteExamen.estado = :estado', {
        estado: Status.EN_PROCESO,
      })
      .getOne();
  }

  async calcularPuntajeTotal(id, puntajeAnulado = 0, notaPorExamenAnulado) {
    if (puntajeAnulado >= 100) {
      // Caso todas las preguntas anuladas
      return getRepository(EstudianteExamen).query(`
      UPDATE estudiante_examen ee SET puntaje = ${notaPorExamenAnulado}::DECIMAL(8,2) WHERE ee.id = '${id}';`);
    }
    const puntajeRedondeo = 99;
    const r = await getRepository(EstudianteExamen).query(`
      UPDATE estudiante_examen ee SET puntaje = (
        SELECT (sum(puntaje)*100/${
          100 - puntajeAnulado
        })::DECIMAL(8,2) FROM estudiante_examen_detalle WHERE id_estudiante_examen = ee.id
      ) WHERE ee.id = '${id}' RETURNING puntaje;`);
    // Si la nota es mayor a 99 se redondea a 100
    if (r && r[0] && r[0][0] && r[0][0].puntaje >= `${puntajeRedondeo}`) {
      await getRepository(EstudianteExamen).query(`
        UPDATE estudiante_examen ee SET puntaje = 100 WHERE ee.id = '${id}' RETURNING puntaje;`);
    }
    return r;
  }

  // Metodo para impugnacion
  buscarExamenesConPregunta(idPregunta: string) {
    return getRepository(EstudianteExamen)
      .createQueryBuilder('ee')
      .innerJoin('ee.estudianteExamenDetalles', 'eed')
      .innerJoin('ee.inscripcion', 'ins')
      .innerJoin('ins.etapaAreaGrado', 'eag')
      .select([
        'ee.id',
        'ee.estado',
        'ee.puntaje',
        'eed.id',
        'eed.puntaje',
        'eed.estado',
        'eed.id_pregunta',
        'ins',
        'eag',
      ])
      .where('eed.id_pregunta = :idPregunta', { idPregunta })
      .andWhere('ee.estado IN (:finalizado, :timeout)', {
        finalizado: 'FINALIZADO',
        timeout: 'TIMEOUT',
      })
      .getMany();
  }

  // Metodos para validar existencia de examenes calificados
  buscarExamenesCalificados(idEtapa) {
    return getRepository(EstudianteExamen)
      .createQueryBuilder('ee')
      .innerJoin('ee.inscripcion', 'ins')
      .innerJoin('ins.etapaAreaGrado', 'eag')
      .select(['ee.id', 'ee.estado', 'ee.puntaje'])
      .where(`ee.estado IN ('FINALIZADO', 'TIMEOUT')`)
      .andWhere('ee.puntaje IS NOT NULL')
      .andWhere('eag.idEtapa = :idEtapa', { idEtapa })
      .limit(10)
      .getMany();
  }
  buscarExamenesNoCalificados(idEtapa) {
    return getRepository(EstudianteExamen)
      .createQueryBuilder('ee')
      .innerJoin('ee.inscripcion', 'ins')
      .innerJoin('ins.etapaAreaGrado', 'eag')
      .select(['ee.id', 'ee.estado', 'ee.puntaje'])
      .where(`ee.estado IN ('FINALIZADO', 'TIMEOUT')`)
      .andWhere('ee.puntaje IS NULL')
      .andWhere('eag.idEtapa = :idEtapa', { idEtapa })
      .getMany();
  }

  buscarExamenPorInscripcionTipoPrueba(params: any) {
    return this.createQueryBuilder('ee')
      .select(['ee.id', 'ee.estado', 'ee.tipoPrueba', 'ee.tipoPlanificacion'])
      .where('ee.estado = :estado', { estado: Status.ACTIVE })
      .andWhere('ee.tipoPrueba = :tipoPrueba', {
        tipoPrueba: params.tipoPrueba,
      })
      .andWhere('ee.idInscripcion = :idInscripcion', {
        idInscripcion: params.idInscripcion,
      })
      .getOne();
  }

  buscarEstudiantesQueNoDieronExamenPorEtapa(idEtapa: string) {
    const q = `
      select x.id_inscripcion from (
      select ee.id_inscripcion, count (1) cantidad
      from estudiante_examen ee, inscripcion i, etapa_area_grado eag, etapa e
      where ee.id_inscripcion = i.id
      and i.id_etapa_area_grado = eag.id
      and eag.id_etapa = e.id
      and e.id = $1
      and ee.fecha_inicio is null
      and ee.fecha_fin is null
      and ee.tipo_prueba = 'ONLINE'
      and ee.tipo_planificacion = 'CRONOGRAMA'
      and ee.estado in ('ACTIVO', 'EN_PROCESO', 'FINALIZADO', 'TIMEOUT', 'INACTIVO')
      group by ee.id_inscripcion
      union all
      select ee.id_inscripcion, count (1) cantidad
      from estudiante_examen ee, inscripcion i, etapa_area_grado eag, etapa e
      where ee.id_inscripcion = i.id
      and i.id_etapa_area_grado = eag.id
      and eag.id_etapa = e.id
      and e.id = $1
      and ee.fecha_inicio is null
      and ee.fecha_fin is null
      and ee.tipo_prueba = 'OFFLINE'
      and ee.tipo_planificacion = 'CRONOGRAMA'
      and ee.estado = 'ACTIVO'
      group by ee.id_inscripcion
      ) as x
      group by x.id_inscripcion
      having sum(x.cantidad) = 2
    `;
    const params = [idEtapa];
    return this.manager.query(q, params);
  }

  // refactorizando anulaciones
  /**
   *anula los activos de una inscripcion ya que estos estarian demas por algun motivo
   *@param idInscripcion string id de la inscripcion
   */
  anularActivos(idInscripcion: string, userId: string) {
    return this.createQueryBuilder('estudianteExamen')
      .update(EstudianteExamen)
      .set({
        estado: Status.ANULADO,
        observacion: 'Anulado desde la carga offline, estaba activo.',
        usuarioActualizacion: userId,
      })
      .where('idInscripcion =:idInscripcion', {
        idInscripcion,
      })
      .andWhere('estado =:estado', { estado: 'ACTIVO' })
      .execute();
  }

  /**
   * buscar los examenes de una inscripcion solo finalizados y timeout
   * @param idInscripcion
   * */
  buscarExamenesPorInscripcion(idInscripcion: string) {
    return this.createQueryBuilder('estudianteExamen')
      .innerJoin('estudianteExamen.inscripcion', 'inscripcion')
      .select([
        'estudianteExamen.id',
        'estudianteExamen.estado',
        'estudianteExamen.fechaConclusion',
      ])
      .where('estudianteExamen.idInscripcion =:idInscripcion', {
        idInscripcion,
      })
      .andWhere('estudianteExamen.estado in (:...estados)', {
        estados: ['FINALIZADO', 'TIMEOUT'],
      })
      .getMany();
  }

  /**
   * buscar la fecha minima de conclusion
   * @param idInscripcion
   * */
  buscarFechaMinimaConclusion(idInscripcion: string) {
    return this.query(`
      select  estudiante_examen.id
      from estudiante_examen
      where fecha_conclusion = (
        select min(ee.fecha_conclusion)
        from estudiante_examen ee
        where ee.id_inscripcion = '${idInscripcion}'
      )
      and estudiante_examen.id_inscripcion = '${idInscripcion}'
    `);
  }

  /**
   * invalidar un examen finalizado por que hay otro mas con fecha de conclusion mas anterior
   * @param id string id estudianteExamen
   * @param observacion string observacion
   * @param usuarioAuditoria string id del usuario auditoria
   * */
  invalidarFinalizado(
    id: string,
    observacion: string,
    usuarioAuditoria: string,
  ) {
    return this.actualizarEstado(
      id,
      Status.FINALIZADO_INVALIDO,
      observacion,
      usuarioAuditoria,
    );
  }

  /**
   * invalidar un examen timeout por que hay otro mas con fecha de conclusion mas anterior
   * @param id string id estudianteExamen
   * @param observacion string observacion
   * @param usuarioAuditoria string id del usuario auditoria
   * */
  invalidarTimeout(id: string, observacion: string, usuarioAuditoria: string) {
    return this.actualizarEstado(
      id,
      Status.TIMEOUT_INVALIDO,
      observacion,
      usuarioAuditoria,
    );
  }

  /**
   * buscar los examenes de una inscripcion para programar rezagados
   * @param idInscripcion
   * */
  buscarExamenesPorInscripcionRezagados(idInscripcion: string) {
    return this.createQueryBuilder('estudianteExamen')
      .innerJoin('estudianteExamen.inscripcion', 'inscripcion')
      .select([
        'estudianteExamen.id',
        'estudianteExamen.estado',
        'estudianteExamen.fechaInicio',
        'estudianteExamen.fechaFin',
        'estudianteExamen.fechaConclusion',
      ])
      .where('estudianteExamen.idInscripcion =:idInscripcion', {
        idInscripcion,
      })
      .andWhere('estudianteExamen.tipoPrueba = :tipoPrueba', {
        tipoPrueba: TipoPrueba.ONLINE,
      })
      .andWhere('estudianteExamen.estado in (:...estados)', {
        estados: ['ACTIVO', 'EN_PROCESO', 'FINALIZADO', 'TIMEOUT', 'INACTIVO'],
      })
      .getMany();
  }

  runTransaction(op) {
    return this.manager.transaction(op);
  }
}
