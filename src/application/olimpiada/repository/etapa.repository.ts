import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { TextService } from '../../../common/lib/text.service';
import { GetJsonData } from '../../../common/lib/json.module';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { EtapaDto } from '../dto/etapa.dto';
import { Etapa } from '../entity/Etapa.entity';
import { EtapaAreaGrado } from '../entity/EtapaAreaGrado.entity';
import { Olimpiada } from '../entity/Olimpiada.entity';
import { Status, tiposEtapa } from '../../../common/constants';
import { Inscripcion } from '../entity/Inscripcion.entity';

@EntityRepository(Etapa)
export class EtapaRepository extends Repository<Etapa> {
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const query = getRepository(Etapa)
      .createQueryBuilder('etapa')
      .leftJoinAndSelect('etapa.olimpiada', 'olimpiada')
      .select([
        'etapa.id',
        'etapa.nombre',
        'etapa.tipo',
        'etapa.jerarquia',
        'etapa.comiteDesempate',
        'etapa.fechaInicio',
        'etapa.fechaFin',
        'etapa.fechaInicioImpugnacion',
        'etapa.fechaFinImpugnacion',
        'etapa.estado',
        'etapa.estadoSorteoPreguntas',
        'olimpiada.id',
        'olimpiada.nombre',
        'olimpiada.fechaInicio',
        'olimpiada.fechaFin',
      ])
      .orderBy('etapa.jerarquia', orden)
      .skip(saltar)
      .take(limite);

    if (parametros?.idOlimpiada) {
      query.andWhere('olimpiada.id = :olimpiada', {
        olimpiada: parametros.idOlimpiada,
      });
    }
    if (parametros?.nombre) {
      query.andWhere('etapa.nombre ilike :nombre', {
        nombre: `%${parametros.nombre}%`,
      });
    }
    if (parametros?.tipo) {
      query.andWhere('etapa.tipo = :tipo', { tipo: parametros.tipo });
    }
    if (parametros?.estado) {
      query.andWhere('etapa.estado = :estado', { estado: parametros.estado });
    }

    return query.getManyAndCount();
  }

  async buscarPorId(id: string) {
    return getRepository(Etapa)
      .createQueryBuilder('etapa')
      .innerJoinAndSelect('etapa.olimpiada', 'olimpiada')
      .select([
        'etapa.id',
        'etapa.nombre',
        'etapa.tipo',
        'etapa.jerarquia',
        'etapa.comiteDesempate',
        'etapa.fechaInicio',
        'etapa.fechaFin',
        'etapa.fechaInicioImpugnacion',
        'etapa.fechaFinImpugnacion',
        'etapa.estado',
        'etapa.estadoSorteoPreguntas',
        'olimpiada.id',
        'olimpiada.nombre',
        'olimpiada.fechaInicio',
        'olimpiada.fechaFin',
      ])
      .where('etapa.id = :id', { id })
      .getOne();
  }

  async buscarPorIdOlimpiadaTipo(idOlimpiada: string, tipo: string) {
    return getRepository(Etapa)
      .createQueryBuilder('etapa')
      .select([
        'etapa.id',
        'etapa.nombre',
        'etapa.tipo',
        'etapa.jerarquia',
        'etapa.comiteDesempate',
        'etapa.fechaInicio',
        'etapa.fechaFin',
        'etapa.fechaInicioImpugnacion',
        'etapa.fechaFinImpugnacion',
        'etapa.estado',
        'etapa.estadoSorteoPreguntas',
      ])
      .where('etapa.idOlimpiada = :idOlimpiada', { idOlimpiada })
      .andWhere('etapa.tipo = :tipo', { tipo })
      .getOne();
  }

  async contarPorTipo(idOlimpiada: string, tipo: string, id: string) {
    const query = getRepository(Etapa)
      .createQueryBuilder('etapa')
      .innerJoinAndSelect('etapa.olimpiada', 'olimpiada')
      .where('olimpiada.id = :idOlimpiada and tipo = :tipo', {
        idOlimpiada,
        tipo,
      });

    if (id) {
      query.andWhere('etapa.id <> :id', { id });
    }
    return query.getCount();
  }

  async contarEtapasAnteriores(idOlimpiada: string, fecha: Date, id: string) {
    const query = getRepository(Etapa)
      .createQueryBuilder('etapa')
      .innerJoinAndSelect('etapa.olimpiada', 'olimpiada')
      .where(
        // 'olimpiada.id = :idOlimpiada and case when etapa.fechaFinImpugnacion is null then etapa.fechaFin > :fecha else etapa.fechaFinImpugnacion > :fecha end and etapa.fechaInicio < :fecha',
        'olimpiada.id = :idOlimpiada and etapa.fechaFin > :fecha and etapa.fechaInicio < :fecha',
        {
          idOlimpiada,
          fecha,
        },
      );

    if (id) {
      query.andWhere('etapa.id <> :id', { id });
    }
    return query.getCount();
  }

  async contarEtapasPosteriores(idOlimpiada: string, fecha: Date, id: string) {
    const query = getRepository(Etapa)
      .createQueryBuilder('etapa')
      .innerJoinAndSelect('etapa.olimpiada', 'olimpiada')
      .where(
        'olimpiada.id = :idOlimpiada and etapa.fechaInicio < :fecha and etapa.fechaFin > :fecha',
        {
          idOlimpiada,
          fecha,
        },
      );

    if (id) {
      query.andWhere('etapa.id <> :id', { id });
    }
    return query.getCount();
  }

  async contarEtapasCruzadas(
    idOlimpiada: string,
    fechaInicio: Date,
    fechaFin: Date,
    id: string,
  ) {
    const query = getRepository(Etapa)
      .createQueryBuilder('etapa')
      .innerJoinAndSelect('etapa.olimpiada', 'olimpiada')
      .where(
        // 'olimpiada.id = :idOlimpiada and ((etapa.fechaInicio <= :fechaInicio and case when etapa.fechaFinImpugnacion is null then etapa.fechaFin >= :fechaFin else etapa.fechaFinImpugnacion >= :fechaFin end) or (etapa.fechaInicio >= :fechaInicio and case when etapa.fechaFinImpugnacion is null then etapa.fechaFin <= :fechaFin else etapa.fechaFinImpugnacion <= :fechaFin end))',
        'olimpiada.id = :idOlimpiada and ((etapa.fechaInicio <= :fechaInicio and etapa.fechaFin >= :fechaFin) or (etapa.fechaInicio >= :fechaInicio and etapa.fechaFin <= :fechaFin))',
        {
          idOlimpiada,
          fechaInicio,
          fechaFin,
        },
      );

    if (id) {
      query.andWhere('etapa.id <> :id', { id });
    }
    return query.getCount();
  }

  async contarEtapasJerarquiaAnterior(
    idOlimpiada: string,
    jerarquia: number,
    id: string,
  ) {
    const query = getRepository(Etapa)
      .createQueryBuilder('etapa')
      .innerJoinAndSelect('etapa.olimpiada', 'olimpiada')
      .where('etapa.estado <> :estadoCerrado', { estadoCerrado: Status.CLOSED })
      .andWhere(
        'olimpiada.id = :idOlimpiada and etapa.jerarquia < :jerarquia',
        {
          idOlimpiada,
          jerarquia,
        },
      );

    if (id) {
      query.andWhere('etapa.id <> :id', { id });
    }
    return query.getCount();
  }

  // Validar que la etapa registrada este en un orden adecuado según las fechas de registro Distrital-Departamental-Nacional
  async contarEtapasRompenOrden(
    idOlimpiada: string,
    fechaInicio: Date,
    tipo: string,
    id: string,
  ) {
    const query = getRepository(Etapa)
      .createQueryBuilder('etapa')
      .innerJoinAndSelect('etapa.olimpiada', 'olimpiada')
      .where('olimpiada.id = :idOlimpiada', {
        idOlimpiada,
      });

    if (tipo === tiposEtapa.DISTRITAL)
      query.andWhere(
        '((etapa.fechaInicio < :fechaInicio and etapa.tipo = :tipo1) or (etapa.fechaInicio < :fechaInicio and etapa.tipo = :tipo2))',
        {
          fechaInicio,
          tipo1: tiposEtapa.DEPARTAMENTAL,
          tipo2: tiposEtapa.NACIONAL,
        },
      );
    else if (tipo === tiposEtapa.DEPARTAMENTAL)
      query.andWhere(
        '((etapa.fechaInicio > :fechaInicio and etapa.tipo = :tipo1) or (etapa.fechaInicio < :fechaInicio and etapa.tipo = :tipo2))',
        {
          fechaInicio,
          tipo1: tiposEtapa.DISTRITAL,
          tipo2: tiposEtapa.NACIONAL,
        },
      );
    else
      query.andWhere(
        '((etapa.fechaInicio > :fechaInicio and etapa.tipo = :tipo1) or (etapa.fechaInicio > :fechaInicio and etapa.tipo = :tipo2))',
        {
          fechaInicio,
          tipo1: tiposEtapa.DISTRITAL,
          tipo2: tiposEtapa.DEPARTAMENTAL,
        },
      );

    if (id) {
      query.andWhere('etapa.id <> :id', { id });
    }
    return query.getCount();
  }

  async crearActualizar(etapaDto: EtapaDto, usuarioAuditoria: string) {
    const {
      id,
      nombre,
      tipo,
      jerarquia,
      comiteDesempate,
      fechaInicio,
      fechaFin,
      fechaInicioImpugnacion,
      fechaFinImpugnacion,
      // estado,
      idOlimpiada,
    } = etapaDto;

    const olimpiada = new Olimpiada();
    olimpiada.id = idOlimpiada;
    const etapa = new Etapa();
    etapa.id = id ? id : TextService.generateUuid();
    etapa.nombre = nombre;
    etapa.tipo = tipo;
    // La jerarquia se obtiene segun el tipo de etapa que se seleccione
    etapa.jerarquia = jerarquia
      ? jerarquia
      : Object.values(JSON.parse(JSON.stringify(tiposEtapa))).indexOf(tipo) + 1;
    etapa.comiteDesempate = comiteDesempate;
    etapa.fechaInicio = fechaInicio;
    etapa.fechaFin = fechaFin;
    etapa.fechaInicioImpugnacion = fechaInicioImpugnacion;
    etapa.fechaFinImpugnacion = fechaFinImpugnacion;
    // etapa.estado = estado; Solo cambiaremos con la maquina de estados
    etapa.olimpiada = olimpiada;

    if (id) {
      etapa.usuarioActualizacion = usuarioAuditoria;
    } else {
      etapa.usuarioCreacion = usuarioAuditoria;
    }

    await this.save(etapa);
    return etapa;
  }

  async actualizarEstado(id: string, estado: string, usuarioAuditoria: string) {
    return this.createQueryBuilder('etapa')
      .update(Etapa)
      .set({ estado, usuarioActualizacion: usuarioAuditoria })
      .where('id = :id', { id })
      .execute();
  }

  async actualizar(id: string, params: any) {
    return getRepository(Etapa)
      .createQueryBuilder()
      .update(Etapa)
      .set(params)
      .where('id = :id', { id })
      .execute();
  }

  async eliminar(etapa: Etapa) {
    return this.remove(etapa);
  }

  listarEtapasPorOlimpiada(idOlimpiada: string, nivel: PaginacionQueryDto) {
    const { filtro, limite, saltar, orden } = nivel;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const query = this.createQueryBuilder('etapa')
      .innerJoinAndSelect('etapa.olimpiada', 'olimpiada')
      .select([
        'etapa.id',
        'etapa.nombre',
        'etapa.tipo',
        'etapa.jerarquia',
        'etapa.comiteDesempate',
        'etapa.fechaInicio',
        'etapa.fechaFin',
        'etapa.fechaInicioImpugnacion',
        'etapa.fechaFinImpugnacion',
        'etapa.estado',
        'etapa.estadoSorteoPreguntas',
        'etapa.estadoSorteoPreguntasRezagados',
        'etapa.estadoPosicionamiento',
        'olimpiada.id',
        'olimpiada.nombre',
        'olimpiada.fechaInicio',
        'olimpiada.fechaFin',
        'olimpiada.estado',
      ])
      .where('etapa.olimpiada.id = :id', { id: idOlimpiada })
      .orderBy('etapa.jerarquia', orden)
      .skip(saltar)
      .take(limite);

    if (parametros.idEtapa) {
      query.andWhere('etapa.id = :idEtapa', { idEtapa: parametros.idEtapa });
    }
    return query.getManyAndCount();
  }

  listarEtapasPorOlimpiadaPublico(
    idOlimpiada: string,
    nivel: PaginacionQueryDto,
  ) {
    const { limite, saltar, orden } = nivel;

    const query = this.createQueryBuilder('etapa')
      .innerJoinAndSelect('etapa.olimpiada', 'olimpiada')
      .select(['etapa.id', 'etapa.nombre', 'etapa.tipo', 'etapa.jerarquia'])
      .where('(olimpiada.estado = :activo or olimpiada.estado = :cerrado)', {
        activo: Status.ACTIVE,
        cerrado: Status.CLOSED,
      })
      .andWhere('etapa.olimpiada.id = :id', {
        id: idOlimpiada,
      })
      .andWhere('(etapa.estado = :publicado or etapa.estado = :cerrado)', {
        publicado: Status.PUBLICACION_RESULTADOS,
        cerrado: Status.CLOSED,
      })
      .orderBy('etapa.jerarquia', orden)
      .skip(saltar)
      .take(limite);

    return query.getManyAndCount();
  }

  obtenerEtapaPorEtapaAreaGrado(idEtapaAreaGrado: string) {
    return getRepository(EtapaAreaGrado)
      .createQueryBuilder('etapaAreaGrado')
      .innerJoinAndSelect('etapaAreaGrado.etapa', 'etapa')
      .select([
        'etapaAreaGrado.id',
        'etapaAreaGrado.estado',
        'etapa.id',
        'etapa.nombre',
        'etapa.tipo',
        'etapa.jerarquia',
        'etapa.comiteDesempate',
        'etapa.fechaInicio',
        'etapa.fechaFin',
        'etapa.fechaInicioImpugnacion',
        'etapa.fechaFinImpugnacion',
        'etapa.estado',
      ])
      .where('etapaAreaGrado.id = :id', { id: idEtapaAreaGrado })
      .getOne();
  }

  obtenerDatosParaEmpaquetado(
    idOlimpiada: string,
    idUnidadEducativa: string,
    idEtapa: string,
  ) {
    return getRepository(Etapa)
      .createQueryBuilder('etapa')
      .leftJoinAndSelect('etapa.etapaAreaGrados', 'eag')
      .leftJoinAndSelect('eag.area', 'area')
      .leftJoinAndSelect('eag.gradoEscolar', 'grado')
      .leftJoinAndSelect('eag.inscripcions', 'ins')
      .leftJoin(
        'ins.estudianteExamen',
        'estExamen',
        `estExamen.tipoPrueba = 'OFFLINE'`,
      )
      .leftJoin('estExamen.estudianteExamenDetalles', 'examenDetalle')
      .leftJoin('examenDetalle.pregunta', 'pregunta')
      .leftJoin('ins.estudiante', 'est')
      .leftJoin('est.persona', 'persona')
      .leftJoin(
        'eag.calendarios',
        'calendarios',
        'calendarios.estado not in  (:estadoCalendario)',
        { estadoCalendario: 'ELIMINADO' },
      )
      .innerJoin(
        'etapa.olimpiada',
        'olimpiada',
        'olimpiada.id = :idOlimpiada',
        {
          idOlimpiada,
        },
      )
      .innerJoin(
        'ins.unidadEducativa',
        'uEducativa',
        'uEducativa.id = :idUnidadEducativa',
        { idUnidadEducativa },
      )
      .select([
        'etapa.id',
        'etapa.nombre',
        'etapa.tipo',
        'etapa.fechaInicio',
        'etapa.fechaFin',
        'etapa.estado',
        'eag.id',
        'eag.totalPreguntas',
        'eag.estado',
        'eag.duracionMinutos',
        'calendarios.id',
        'calendarios.tipoPrueba',
        'calendarios.fechaHoraInicio',
        'calendarios.fechaHoraFin',
        'calendarios.estado',
        'area.id',
        'area.nombre',
        'area.estado',
        'grado.id',
        'grado.nombre',
        'grado.estado',
        'ins.id',
        'ins.estado',
        'est.id',
        'est.rude',
        'persona.id',
        'persona.nroDocumento',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
        'estExamen.id',
        'estExamen.tipoPrueba',
        'estExamen.data',
        'estExamen.estado',
        'examenDetalle.id',
        'examenDetalle.estado',
        'pregunta.id',
        'pregunta.tipoPregunta',
        'pregunta.nivelDificultad',
        'pregunta.textoPregunta',
        'pregunta.imagenPregunta',
        'pregunta.tipoRespuesta',
        'pregunta.opciones',
        'pregunta.estado',
        'olimpiada.id',
        'olimpiada.nombre',
        'olimpiada.sigla',
        'olimpiada.gestion',
        'olimpiada.fechaInicio',
        'olimpiada.fechaFin',
        'olimpiada.estado',
      ])
      .andWhere('etapa.id = :idEtapa', {
        idEtapa,
      })
      .andWhere('estExamen.estado = :estado', { estado: 'ACTIVO' })
      .getMany();
  }
  contarEtapaAreaGradoPorEtapa(idEtapa: string) {
    return getRepository(EtapaAreaGrado)
      .createQueryBuilder('etapaAreaGrado')
      .innerJoinAndSelect('etapaAreaGrado.etapa', 'etapa')
      .where('etapa.id = :id', { id: idEtapa })
      .getCount();
  }
  contarConfiguracionMinimaPorEtapa(idEtapa: string) {
    return getRepository(EtapaAreaGrado)
      .createQueryBuilder('etapaAreaGrado')
      .innerJoinAndSelect('etapaAreaGrado.etapa', 'etapa')
      .where(
        'etapa.id = :id and ' +
          '(etapaAreaGrado.totalPreguntas is null or etapaAreaGrado.totalPreguntas < 3 or ' +
          'etapaAreaGrado.preguntasCurricula + etapaAreaGrado.preguntasOlimpiada = 0 or ' +
          'etapaAreaGrado.puntosPreguntaCurricula + etapaAreaGrado.puntosPreguntaOlimpiada = 0 or ' +
          'etapaAreaGrado.duracionMinutos is null or etapaAreaGrado.duracionMinutos < 0 or ' +
          'etapaAreaGrado.nroPosicionesTotal is null or ' +
          'case when etapaAreaGrado.criterioCalificacion then etapaAreaGrado.puntajeMinimoClasificacion is null else false end or ' +
          'case when etapaAreaGrado.criterioMedallero then etapaAreaGrado.puntajeMinimoMedallero is null else false end )',
        { id: idEtapa },
      )
      .getCount();
  }
  ConsultaResultados(idEtapa: string, paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const query = getRepository(Inscripcion)
      .createQueryBuilder('i')
      .innerJoinAndSelect('i.etapaAreaGrado', 'eag')
      .innerJoinAndSelect('i.estudiante', 'e')
      .innerJoinAndSelect('e.persona', 'p')
      .innerJoinAndSelect('eag.gradoEscolar', 'ge')
      .innerJoinAndSelect('eag.area', 'a')
      .innerJoinAndSelect('eag.etapa', 'et')
      .innerJoinAndSelect('et.olimpiada', 'o')
      .innerJoinAndSelect('i.unidadEducativa', 'ue')
      .innerJoinAndSelect('ue.distrito', 'di')
      .innerJoinAndSelect('di.departamento', 'de')
      .innerJoinAndSelect('i.estudianteExamen', 'ee')
      .select([
        'e.rude as "rude"',
        'p.nroDocumento as "nroDocumento"',
        'p.nombres as "nombres"',
        'p.primerApellido as "primerApellido"',
        'p.segundoApellido as "segundoApellido"',
        'o.nombre as "olimpiada"',
        'et.nombre as "etapa"',
        'a.nombre as "area"',
        'ge.nombre as "grado"',
        'ue.nombre as "unidadEducativa"',
        'ee.tipoPrueba as "tipoPrueba"',
        'ee.puntaje as "puntaje"',
      ])
      .where('et.id = :idEtapa and i.clasificado = true', { idEtapa })
      .orderBy('et.jerarquia', orden)
      .skip(saltar)
      .take(limite);

    if (parametros?.idArea)
      query.andWhere('et.id = :idArea', {
        idArea: parametros.idArea,
      });
    if (parametros?.idGradoEscolar)
      query.andWhere('ge.id = :idGradoEscolar', {
        idGradoEscolar: parametros.idGradoEscolar,
      });
    if (parametros?.idDepartamento)
      query.andWhere('de.id = :idDepartamento', {
        idDepartamento: parametros.idDepartamento,
      });
    if (parametros?.idDistrito)
      query.andWhere('di.id = :idDistrito', {
        idDistrito: parametros.idDistrito,
      });
    if (parametros?.idUnidadEducativa)
      query.andWhere('ue.id = :idUnidadEducativa', {
        idUnidadEducativa: parametros.idUnidadEducativa,
      });
    if (parametros?.rude)
      query.andWhere('e.rude = :rude', { rude: parametros.rude });

    return query.getRawMany();
  }

  runTransaction(op) {
    return this.manager.transaction(op);
  }
}
