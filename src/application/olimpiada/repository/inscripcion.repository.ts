import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { GetJsonData } from '../../../common/lib/json.module';
import { Brackets, EntityRepository, getRepository, Repository } from 'typeorm';
import { Inscripcion } from '../entity/Inscripcion.entity';
import { InscripcionCreacionDto } from '../dto/inscripcion.dto';
import { Estudiante } from '../entity/Estudiante.entity';
import { UnidadEducativa } from '../entity/UnidadEducativa.entity';
import { EtapaAreaGrado } from '../entity/EtapaAreaGrado.entity';
import { Persona } from '../../persona/persona.entity';
import { getManager, In } from 'typeorm';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';
import { Messages } from '../../../common/constants/response-messages';
import { Status } from '../../../common/constants';
import { PreconditionFailedException } from '@nestjs/common';
@EntityRepository(Inscripcion)
export class InscripcionRepository extends Repository<Inscripcion> {
  async listar(
    idEtapaAreaGrado: string,
    paginacionQueryDto: PaginacionQueryDto,
  ) {
    const { limite, saltar, filtro, orden } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const query = getRepository(Inscripcion)
      .createQueryBuilder('inscripcion')
      .leftJoinAndSelect('inscripcion.etapaAreaGrado', 'etapaAreaGrado')
      .leftJoinAndSelect('etapaAreaGrado.gradoEscolar', 'gradoEscolar')
      .leftJoinAndSelect('etapaAreaGrado.etapa', 'etapa')
      .leftJoinAndSelect('etapa.olimpiada', 'olimpiada')
      .leftJoinAndSelect('inscripcion.estudiante', 'estudiante')
      .leftJoinAndSelect('inscripcion.unidadEducativa', 'unidadEducativa')
      .leftJoinAndSelect('unidadEducativa.distrito', 'di')
      .leftJoinAndSelect('di.departamento', 'de')
      .leftJoinAndSelect('estudiante.persona', 'persona')
      .select([
        'inscripcion.id',
        'inscripcion.idImportacion',
        'inscripcion.estado',
        'etapaAreaGrado.id',
        'gradoEscolar.nombre',
        'etapa.estado',
        'unidadEducativa.id',
        'unidadEducativa.nombre',
        'unidadEducativa.codigoSie',
        'di.nombre',
        'de.nombre',
        'estudiante.id',
        'estudiante.rude',
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
      ])
      .where('etapaAreaGrado.id = :idEtapaAreaGrado', { idEtapaAreaGrado })
      .orderBy('persona.nroDocumento', orden)
      .skip(saltar)
      .take(limite);
    if (parametros?.estado) {
      query.andWhere('inscripcion.estado = :estado', {
        estado: parametros.estado,
      });
    }
    if (parametros?.rude) {
      query.andWhere('estudiante.rude = :rude', {
        rude: parametros.rude,
      });
    }
    if (parametros?.nroDocumento) {
      query.andWhere('persona.nroDocumento = :nroDocumento', {
        nroDocumento: parametros.nroDocumento,
      });
    }
    if (parametros?.idUnidadEducativa) {
      query.andWhere('unidadEducativa.id = :idUnidadEducativa', {
        idUnidadEducativa: parametros.idUnidadEducativa,
      });
    }
    if (parametros?.idEstudiante) {
      query.andWhere('estudiante.id = :idEstudiante', {
        idEstudiante: parametros.idEstudiante,
      });
    }
    if (parametros?.idOlimpiada) {
      query.andWhere('olimpiada.id = :idOlimpiada', {
        idOlimpiada: parametros.idOlimpiada,
      });
    }
    if (parametros?.estudiante) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('persona.nroDocumento ilike :estudiante')
            .orWhere('persona.nombres ilike :estudiante')
            .orWhere('persona.primerApellido ilike :estudiante')
            .orWhere('persona.segundoApellido ilike :estudiante')
            .orWhere('estudiante.rude ilike :estudiante');
        }),
      );
      query.setParameter('estudiante', `%${parametros.estudiante}%`);
    }
    return query.getManyAndCount();
  }

  async buscarPorId(id: string) {
    return getRepository(Inscripcion)
      .createQueryBuilder('inscripcion')
      .leftJoinAndSelect('inscripcion.etapaAreaGrado', 'etapaAreaGrado')
      .leftJoinAndSelect('etapaAreaGrado.gradoEscolar', 'gradoEscolar')
      .leftJoinAndSelect('inscripcion.estudiante', 'estudiante')
      .leftJoinAndSelect('inscripcion.unidadEducativa', 'unidadEducativa')
      .leftJoinAndSelect('estudiante.persona', 'persona')
      .select([
        'inscripcion.id',
        'inscripcion.idImportacion',
        'inscripcion.estado',
        'etapaAreaGrado.id',
        'gradoEscolar.nombre',
        'unidadEducativa.id',
        'unidadEducativa.nombre',
        'unidadEducativa.codigoSie',
        'estudiante.id',
        'estudiante.rude',
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
      ])
      .where('inscripcion.id = :id', { id })
      .getOne();
  }

  async contarPorIdEtapaAreaGrado(idEtapaAreaGrado: string) {
    return getRepository(Inscripcion)
      .createQueryBuilder('inscripcion')
      .where('inscripcion.etapaAreaGrado = :id', { id: idEtapaAreaGrado })
      .getCount();
  }

  async crearActualizar(
    inscripcionDto: InscripcionCreacionDto,
    usuarioAuditoria: string,
    id: string,
  ) {
    return getManager().transaction(async (transactionEntityManager) => {
      let persona = new Persona();
      persona.nombres = inscripcionDto.estudiante.persona.nombres;
      persona.primerApellido = inscripcionDto.estudiante.persona.primerApellido;
      persona.segundoApellido =
        inscripcionDto.estudiante.persona.segundoApellido;
      persona.nroDocumento = inscripcionDto.estudiante.persona.nroDocumento;
      persona.fechaNacimiento =
        inscripcionDto.estudiante.persona.fechaNacimiento;
      persona.genero = inscripcionDto.estudiante.persona.genero;
      persona.telefono = inscripcionDto.estudiante.persona.telefono;
      persona.correoElectronico =
        inscripcionDto.estudiante.persona.correoElectronico;
      const persona_ = await getRepository(Persona)
        .createQueryBuilder('persona')
        .select(['persona.id'])
        .where('persona.nroDocumento = :nroDocumento', {
          nroDocumento: inscripcionDto.estudiante.persona.nroDocumento,
        })
        .getOne();
      if (persona_ && inscripcionDto.estudiante.persona.nroDocumento != '') {
        persona.id = persona_.id;
        persona.usuarioActualizacion = usuarioAuditoria;
      } else {
        persona.usuarioCreacion = usuarioAuditoria;
      }

      persona = await transactionEntityManager.save(persona);
      let estudiante = new Estudiante();
      estudiante.rude = inscripcionDto.estudiante.rude;
      estudiante.persona = persona;
      const estudiante_ = await getRepository(Estudiante)
        .createQueryBuilder('estudiante')
        .select(['estudiante.id', 'estudiante.rude'])
        .where('estudiante.rude = :rude', {
          rude: inscripcionDto.estudiante.rude,
        })
        .getOne();
      if (estudiante_) {
        estudiante.id = estudiante_.id;
        estudiante.usuarioActualizacion = usuarioAuditoria;
      } else {
        estudiante.usuarioCreacion = usuarioAuditoria;
      }
      estudiante = await transactionEntityManager.save(estudiante);
      const queryValidation = getRepository(Inscripcion)
        .createQueryBuilder('inscripcion')
        .select(['inscripcion.id'])
        .where(
          `inscripcion.id_estudiante = :idEstudiante
        AND inscripcion.id_etapa_area_grado = :idEtapaAreaGrado
        `,
          {
            idEstudiante: estudiante.id,
            idEtapaAreaGrado: inscripcionDto.idEtapaAreaGrado,
          },
        );
      if (id) {
        queryValidation.andWhere('inscripcion.id <> :id', { id });
      }
      const inscripcion_ = await queryValidation.getOne();
      if (inscripcion_) {
        throw new PreconditionFailedException(
          'Ya existe una inscripción del estudiante a la etapa-area-grado',
        );
      }
      const etapaAreaGrado = new EtapaAreaGrado();
      etapaAreaGrado.id = inscripcionDto.idEtapaAreaGrado;

      const unidadEducativa = new UnidadEducativa();
      unidadEducativa.id = inscripcionDto.idUnidadEducativa;

      let inscripcion = new Inscripcion();
      inscripcion.etapaAreaGrado = etapaAreaGrado;
      inscripcion.estudiante = estudiante;
      inscripcion.unidadEducativa = unidadEducativa;
      inscripcion.idImportacion = inscripcionDto.idImportacion;
      if (id) {
        inscripcion.id = id;
        inscripcion.usuarioActualizacion = usuarioAuditoria;
      } else {
        inscripcion.usuarioCreacion = usuarioAuditoria;
      }
      inscripcion = await transactionEntityManager.save(inscripcion);
      return inscripcion;
    });
  }

  async eliminar(id: string, usuarioActualizacion: string) {
    const inscripcion = await this.findOne({
      id,
      estado: In(['ACTIVO']),
    });
    if (!inscripcion) {
      throw new EntityNotFoundException(Messages.EXCEPTION_NOT_FOUND);
    }
    inscripcion.usuarioActualizacion = usuarioActualizacion;
    inscripcion.estado = Status.INACTIVE;
    return this.save(inscripcion);
  }

  async guardarItem(
    item: any,
    idEtapaAreaGrado: string,
    estudiante: Estudiante,
    usuarioAuditoria: string,
  ) {
    const etapaAreaGrado = new EtapaAreaGrado();
    etapaAreaGrado.id = idEtapaAreaGrado;

    const resUnidadEducativa = await this.manager.findOne(UnidadEducativa, {
      codigoSie: item.codigoSie,
    });

    const resInscripcion = await this.manager.findOne(Inscripcion, {
      etapaAreaGrado: etapaAreaGrado,
      estudiante: estudiante,
      unidadEducativa: resUnidadEducativa,
    });

    const inscripcion = new Inscripcion();
    inscripcion.etapaAreaGrado = etapaAreaGrado;
    inscripcion.estudiante = estudiante;
    inscripcion.unidadEducativa = resUnidadEducativa;
    inscripcion.estado = Status.ACTIVE;
    inscripcion.importado = true;
    if (resInscripcion) {
      inscripcion.id = resInscripcion.id;
      inscripcion.usuarioActualizacion = usuarioAuditoria;
    } else {
      inscripcion.usuarioCreacion = usuarioAuditoria;
    }

    return await this.save(inscripcion);
  }

  async obtenerPorIds(idEtapaAreaGrado: string, idEstudiante: string) {
    return await getRepository(Inscripcion)
      .createQueryBuilder('inscripcion')
      .select(['inscripcion.id'])
      .where(
        `inscripcion.id_estudiante = :idEstudiante 
      AND inscripcion.id_etapa_area_grado = :idEtapaAreaGrado 
      `,
        {
          idEstudiante,
          idEtapaAreaGrado,
        },
      )
      .getOne();
  }

  listarPorEtapaAreaGrado(idEtapaAreaGrado: string) {
    return getRepository(Inscripcion)
      .createQueryBuilder('i')
      .leftJoinAndSelect('i.etapaAreaGrado', 'eag')
      .leftJoinAndSelect('eag.area', 'a')
      .leftJoinAndSelect('eag.gradoEscolar', 'ge')
      .leftJoinAndSelect('i.unidadEducativa', 'ue')
      .leftJoinAndSelect('ue.distrito', 'd')
      .leftJoinAndSelect('d.departamento', 'de')
      .leftJoinAndSelect('i.estudiante', 'e')
      .leftJoinAndSelect('e.persona', 'p')
      .leftJoinAndSelect('eag.etapa', 'et')
      .leftJoinAndSelect('et.olimpiada', 'o')
      .select([
        'i.id as "idInscripcion"',
        'eag.id as "idEtapaAreaGrado"',
        'e.id as "idEstudiante"',
        'o.nombre as "olimpiada"',
        'e.rude as "rude"',
        'de.nombre as "departamento"',
        'a.nombre as "area"',
        'd.nombre as "distritoEducativo"',
        'ge.nombre as "gradoEscolar"',
        `concat(p.nombres, ' ', p.primer_apellido, ' ', p.segundo_apellido) as "estudiante"`,
        'et.nombre as "etapa"',
      ])
      .where('i.idEtapaAreaGrado = :idEtapaAreaGrado', { idEtapaAreaGrado })
      .getRawMany();
  }

  listarRezagadosPorEtapaAreaGrado(idEtapaAreaGrado: string) {
    return getRepository(Inscripcion)
      .createQueryBuilder('i')
      .leftJoinAndSelect('i.etapaAreaGrado', 'eag')
      .leftJoinAndSelect('eag.area', 'a')
      .leftJoinAndSelect('eag.gradoEscolar', 'ge')
      .leftJoinAndSelect('i.unidadEducativa', 'ue')
      .leftJoinAndSelect('ue.distrito', 'd')
      .leftJoinAndSelect('d.departamento', 'de')
      .leftJoinAndSelect('i.estudiante', 'e')
      .leftJoinAndSelect('e.persona', 'p')
      .leftJoinAndSelect('eag.etapa', 'et')
      .leftJoinAndSelect('et.olimpiada', 'o')
      .select([
        'i.id as "idInscripcion"',
        'eag.id as "idEtapaAreaGrado"',
        'e.id as "idEstudiante"',
        'o.nombre as "olimpiada"',
        'e.rude as "rude"',
        'de.nombre as "departamento"',
        'a.nombre as "area"',
        'd.nombre as "distritoEducativo"',
        'ge.nombre as "gradoEscolar"',
        `concat(p.nombres, ' ', p.primer_apellido, ' ', p.segundo_apellido) as "estudiante"`,
        'et.nombre as "etapa"',
      ])
      .where('i.idEtapaAreaGrado = :idEtapaAreaGrado', { idEtapaAreaGrado })
      .andWhere(`i.rezagado = true`)
      .getRawMany();
  }

  buscarInscripcion(id: string) {
    return getRepository(Inscripcion)
      .createQueryBuilder('i')
      .leftJoinAndSelect('i.etapaAreaGrado', 'eag')
      .leftJoinAndSelect('eag.area', 'a')
      .leftJoinAndSelect('eag.gradoEscolar', 'ge')
      .leftJoinAndSelect('i.unidadEducativa', 'ue')
      .leftJoinAndSelect('ue.distrito', 'd')
      .leftJoinAndSelect('d.departamento', 'de')
      .leftJoinAndSelect('i.estudiante', 'e')
      .leftJoinAndSelect('e.persona', 'p')
      .leftJoinAndSelect('eag.etapa', 'et')
      .leftJoinAndSelect('et.olimpiada', 'o')
      .select([
        'i.id as "idInscripcion"',
        'eag.id as "idEtapaAreaGrado"',
        'e.id as "idEstudiante"',
        'o.nombre as "olimpiada"',
        'e.rude as "rude"',
        'de.nombre as "departamento"',
        'a.nombre as "area"',
        'd.nombre as "distritoEducativo"',
        'ge.nombre as "gradoEscolar"',
        `concat(p.nombres, ' ', p.primer_apellido, ' ', p.segundo_apellido) as "estudiante"`,
      ])
      .where('i.id = :id', { id })
      .getRawOne();
  }

  async guardarImportacion(
    idEtapaAreaGrado: string,
    items: any,
    usuario: string,
  ): Promise<any[]> {
    return await this.query(
      `select sp_cargar_estudiantes('${idEtapaAreaGrado}', '${JSON.stringify(
        items,
      ).replace(/'/g, "''")}', '${usuario}')`,
    );
  }

  listarParaCalificacionReporte(idEtapaAreaGrado: string) {
    return getRepository(Inscripcion)
      .createQueryBuilder('i')
      .innerJoinAndSelect('i.etapaAreaGrado', 'eag')
      .innerJoinAndSelect('i.unidadEducativa', 'ue')
      .innerJoinAndSelect('i.estudianteExamen', 'ee')
      .select([
        'i.id as "idInscripcion"',
        'eag.id as "idEtapaAreaGrado"',
        'ue.id as "idUnidadEducativa"',
        'ue.nombre as "unidadEducativa"',
        'ue.codigoSie as "codigoSie"',
        'ee.id as "idEstudianteExamen"',
        'ee.fechaInicio as "fechaInicio"',
        'ee.fechaFin as "fechaFin"',
        'ee.fechaConclusion as "fechaConclusion"',
        'ee.estado as "examenEstado"',
        'ee.tipoPrueba as "tipoPrueba"',
      ])
      .where('i.idEtapaAreaGrado = :idEtapaAreaGrado', { idEtapaAreaGrado })
      .andWhere(`ee.estado NOT IN ('ANULADO')`)
      .getRawMany();
  }

  listarParaCalificacionReporteV2(
    idEtapa: string,
    paginacion: PaginacionQueryDto,
    filtros,
  ) {
    const { orden } = paginacion;
    return getRepository(Inscripcion)
      .createQueryBuilder('i')
      .innerJoinAndSelect('i.etapaAreaGrado', 'eag')
      .innerJoinAndSelect('i.unidadEducativa', 'ue')
      .innerJoinAndSelect('i.estudianteExamen', 'ee')
      .innerJoinAndSelect('eag.area', 'area')
      .innerJoinAndSelect('eag.gradoEscolar', 'ge')
      .leftJoinAndSelect('ue.distrito', 'd')
      .leftJoinAndSelect('d.departamento', 'de')
      .select([
        'i.id as "idInscripcion"',
        'eag.id as "idEtapaAreaGrado"',
        'area.id as "areaId"',
        'area.nombre as "areaNombre"',
        'area.estado as "areaEstado"',
        'ge.id as "gradoEscolarId"',
        'ge.nombre as "gradoEscolarNombre"',
        'ge.estado as "gradoEscolarEstado"',
        'ue.id as "idUnidadEducativa"',
        'ue.nombre as "unidadEducativa"',
        'ue.codigoSie as "codigoSie"',
        'd.nombre as "distritoNombre"',
        'de.nombre as "departamentoNombre"',
        'ee.id as "idEstudianteExamen"',
        'ee.fechaInicio as "fechaInicio"',
        'ee.fechaFin as "fechaFin"',
        'ee.fechaConclusion as "fechaConclusion"',
        'ee.estado as "examenEstado"',
        'ee.tipoPrueba as "tipoPrueba"',
      ])
      .where('eag.idEtapa = :idEtapa', { idEtapa })
      .andWhere(`ee.estado NOT IN ('ANULADO')`)
      .orderBy('ue.nombre', orden)
      .getRawMany();
  }

  listarParaCalificacionReporteV3(idEtapa: string) {
    return this.query(
      `SELECT i.id as "idInscripcion",
        eag.id as "idEtapaAreaGrado",
        area.id as "areaId",
        area.nombre as "areaNombre",
        area.estado as "areaEstado",
        ge.id as "gradoEscolarId",
        ge.nombre as "gradoEscolarNombre",
        ge.estado as "gradoEscolarEstado",
        ue.id as "idUnidadEducativa",
        ue.nombre as "unidadEducativa",
        ue.codigo_sie as "codigoSie",
        di.nombre as "distritoNombre",
        de.nombre as "departamentoNombre",
        ee.id as "idEstudianteExamen",
        ee.estado as "examenEstado",
        ee.tipo_prueba as "tipoPrueba"
        FROM etapa_area_grado eag 
        INNER JOIN area ON area.id = eag.id_area  
        INNER JOIN grado_escolaridad ge ON ge.id = eag.id_grado_escolar  
        INNER JOIN inscripcion i ON i.id_etapa_area_grado = eag.id  
        INNER JOIN unidad_educativa ue ON ue.id = i.id_unidad_educativa  
        INNER JOIN estudiante_examen ee ON ee.id_inscripcion = i.id 
        LEFT JOIN distrito di ON di.id = ue.id_distrito
        LEFT JOIN departamento de ON de.id = di.id_departamento
        WHERE eag.id_etapa = '${idEtapa}' 
        AND ee.estado NOT IN ('ANULADO')`,
    );
  }

  listarParaCalificacionReporteV4(
    idEtapa: string,
    paginacionQueryDto: PaginacionQueryDto,
  ) {
    let limites = '';
    let filtros = '';
    if (paginacionQueryDto) {
      const { limite, pagina, filtro } = paginacionQueryDto;
      const parametros = filtro ? GetJsonData(filtro) : null;
      const nombre = parametros?.unidadEducativa
        ? parametros?.unidadEducativa
        : '';
      if (nombre)
        filtros = `AND (ue.codigo_sie::VARCHAR like '%${nombre}%' OR ue.nombre ilike '%${nombre}%')`;
      if (limite && pagina)
        limites = `limit ${limite} offset ${(pagina - 1) * limite}`;
    }
    return this.query(
      `SELECT 
        a.nombre as "area",
        ge.nombre as "gradoEscolar",
        ue.nombre as "unidadEducativa",
        ue.codigo_sie as "codigoSie",
        inscritos.total as "cantidadInscritos",
        coalesce(online.total_online, 0) as "cantidadOnline",
        coalesce(offline.total_offline, 0) as "cantidadOffline",
        coalesce(online.total_online, 0) + coalesce(offline.total_offline, 0) as "examenesFinalizados",
        round((coalesce(online.total_online, 0) + coalesce(offline.total_offline, 0))::numeric / inscritos.total::numeric * 100) as "porcentaje"
        FROM (
          SELECT eag.id_area, eag.id_grado_escolar, i.id_unidad_educativa, count(*) total
          FROM inscripcion i 
          INNER JOIN etapa_area_grado eag ON eag.id = i.id_etapa_area_grado
          INNER JOIN etapa e ON e.id = eag.id_etapa 
          INNER JOIN unidad_educativa ue ON ue.id = i.id_unidad_educativa
          WHERE e.id = '${idEtapa}'
          ${filtros}
          GROUP BY eag.id_area, eag.id_grado_escolar, i.id_unidad_educativa
          ${limites}
        ) inscritos
        LEFT JOIN (
          SELECT eag.id_area, eag.id_grado_escolar, i.id_unidad_educativa, count(*) total_online
          FROM estudiante_examen ee
          INNER JOIN inscripcion i ON i.id = ee.id_inscripcion
          INNER JOIN etapa_area_grado eag ON eag.id = i.id_etapa_area_grado
          INNER JOIN etapa e ON e.id = eag.id_etapa 
          INNER JOIN unidad_educativa ue ON ue.id = i.id_unidad_educativa
          WHERE e.id = '${idEtapa}' and ee.tipo_prueba = 'ONLINE' and ee.estado in ('FINALIZADO', 'TIMEOUT')
          ${filtros}
          GROUP BY eag.id_area, eag.id_grado_escolar, i.id_unidad_educativa
          ${limites}
        ) online on inscritos.id_area = online.id_area and inscritos.id_grado_escolar = online.id_grado_escolar and inscritos.id_unidad_educativa = online.id_unidad_educativa 
        LEFT JOIN (
          SELECT eag.id_area, eag.id_grado_escolar, i.id_unidad_educativa, count(*) total_offline
          FROM estudiante_examen ee
          INNER JOIN inscripcion i ON i.id = ee.id_inscripcion
          INNER JOIN etapa_area_grado eag ON eag.id = i.id_etapa_area_grado
          INNER JOIN etapa e ON e.id = eag.id_etapa 
          INNER JOIN unidad_educativa ue ON ue.id = i.id_unidad_educativa
          WHERE e.id = '${idEtapa}' and ee.tipo_prueba = 'OFFLINE' and ee.estado in ('FINALIZADO', 'TIMEOUT')
          ${filtros}
          GROUP BY eag.id_area, eag.id_grado_escolar, i.id_unidad_educativa
          ${limites}
        ) offline on inscritos.id_area = offline.id_area and inscritos.id_grado_escolar = offline.id_grado_escolar and inscritos.id_unidad_educativa = offline.id_unidad_educativa
        INNER JOIN area a ON a.id = inscritos.id_area
        INNER JOIN grado_escolaridad ge ON ge.id = inscritos.id_grado_escolar 
        INNER JOIN unidad_educativa ue ON ue.id = inscritos.id_unidad_educativa
      `,
    );
  }

  totalCalificacionReporteAgrupado(
    idEtapa: string,
    paginacionQueryDto: PaginacionQueryDto,
  ): Promise<any[]> {
    const { filtro } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;
    const nombre = parametros?.unidadEducativa
      ? parametros?.unidadEducativa
      : '';
    return this.query(
      `SELECT count(*) total FROM (
        SELECT area.id AS area_id, ge.id AS ge_id, ue.id AS ue_id 
        FROM etapa_area_grado eag 
        INNER JOIN area ON area.id = eag.id_area  
        INNER JOIN grado_escolaridad ge ON ge.id = eag.id_grado_escolar  
        INNER JOIN inscripcion i ON i.id_etapa_area_grado = eag.id  
        INNER JOIN unidad_educativa ue ON ue.id = i.id_unidad_educativa  
        INNER JOIN estudiante_examen ee ON ee.id_inscripcion = i.id 
        WHERE eag.id_etapa = '${idEtapa}' 
        AND (ue.codigo_sie::VARCHAR like '%${nombre}%' OR ue.nombre ilike '%${nombre}%')
        AND ee.estado NOT IN ('ANULADO') 
        GROUP BY area.id, ge.id, ue.id 
      ) as t`,
    );
  }

  listarParaCalificacionReporteSP(
    idEtapa: string,
    paginacionQueryDto: PaginacionQueryDto,
  ): Promise<any[]> {
    const { limite, saltar, filtro } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;
    return this.query(
      `select * from sp_obtener_calificaciones('${idEtapa}', ${limite}, ${saltar}, '${
        parametros?.unidadEducativa ? parametros?.unidadEducativa : ''
      }')`,
    );
  }

  listarParaCalificacion(idEtapaAreaGrado: string) {
    return getRepository(Inscripcion)
      .createQueryBuilder('i')
      .innerJoinAndSelect('i.etapaAreaGrado', 'eag')
      .innerJoinAndSelect('i.unidadEducativa', 'ue')
      .innerJoinAndSelect('i.estudianteExamen', 'ee')
      .select([
        'i.id as "idInscripcion"',
        'eag.id as "idEtapaAreaGrado"',
        'ue.id as "idUnidadEducativa"',
        'ue.nombre as "unidadEducativa"',
        'ue.codigoSie as "codigoSie"',
        'ee.id as "idEstudianteExamen"',
        'ee.fechaInicio as "fechaInicio"',
        'ee.fechaFin as "fechaFin"',
        'ee.fechaConclusion as "fechaConclusion"',
        'ee.estado as "examenEstado"',
        'ee.tipoPrueba as "tipoPrueba"',
      ])
      .where('i.idEtapaAreaGrado = :idEtapaAreaGrado', { idEtapaAreaGrado })
      .andWhere('ee.puntaje IS NULL')
      .andWhere('ee.estado IN (:finalizado, :timeout)', {
        finalizado: 'FINALIZADO',
        timeout: 'TIMEOUT',
      })
      .getRawMany();
  }

  async buscarPorEtapaGrado(
    idEtapa: string,
    idGradoEscolar: string,
    rude: string,
  ) {
    return getRepository(Inscripcion)
      .createQueryBuilder('i')
      .innerJoinAndSelect('i.etapaAreaGrado', 'eag')
      .innerJoinAndSelect('i.estudiante', 'e')
      .select(['eag.idGradoEscolar'])
      .distinct(true)
      .where('e.rude = :rude', { rude })
      .andWhere('eag.idEtapa = :idEtapa', { idEtapa })
      .andWhere('eag.idGradoEscolar <> :idGradoEscolar', { idGradoEscolar })
      .getRawMany();
    // .andWhere('i.estado = :estado', { estado: Status.ACTIVE })
  }

  async buscarPorEtapa(idEtapa: string, rude: string, id: string) {
    const query = getRepository(Inscripcion)
      .createQueryBuilder('i')
      .innerJoinAndSelect('i.etapaAreaGrado', 'eag')
      .innerJoinAndSelect('i.estudiante', 'e')
      .select(['eag.idArea'])
      .where('e.rude = :rude', { rude })
      .andWhere('eag.idEtapa = :idEtapa', { idEtapa });
    if (id) {
      query.andWhere('i.id <> :id', { id });
    }
    return query.getRawMany();
  }

  async buscarPorIdImportacion(
    idEtapa: string,
    idImportacion: string,
    id: string,
  ) {
    const query = getRepository(Inscripcion)
      .createQueryBuilder('i')
      .innerJoinAndSelect('i.etapaAreaGrado', 'eag')
      .innerJoinAndSelect('i.estudiante', 'e')
      .select(['i.id'])
      .where('eag.idEtapa = :idEtapa', { idEtapa })
      .andWhere('i.idImportacion = :idImportacion', { idImportacion });
    if (id) {
      query.andWhere('i.id <> :id', { id });
    }
    return query.getRawMany();
  }

  async contarClasificadosPorEtapa(idEtapa: string) {
    return getRepository(Inscripcion)
      .createQueryBuilder('i')
      .innerJoinAndSelect('i.etapaAreaGrado', 'eag')
      .where('eag.idEtapa = :idEtapa', { idEtapa })
      .andWhere('i.clasificado is true')
      .andWhere('i.estado = :estado', { estado: Status.ACTIVE })
      .getCount();
  }

  async cargarInscritosPorEAG(
    idEAGOrigen: string,
    idEAGDestino: string,
    usuarioAuditoria: string,
  ): Promise<any[]> {
    return await this.query(
      `INSERT INTO inscripcion (id, id_etapa_area_grado, id_estudiante, id_unidad_educativa, id_importacion, usuario_creacion, fecha_creacion)
      SELECT uuid_generate_v4(), '${idEAGDestino}', i.id_estudiante, i.id_unidad_educativa, i.id_importacion, '${usuarioAuditoria}', now()  
      FROM inscripcion i
      LEFT JOIN inscripcion ireg ON ireg.id_etapa_area_grado = '${idEAGDestino}' and ireg.id_importacion = i.id_importacion 
      and ireg.id_estudiante = i.id_estudiante and ireg.id_unidad_educativa =i.id_unidad_educativa 
      WHERE i.id_etapa_area_grado = '${idEAGOrigen}' and i.clasificado = true and ireg.id is null`,
    );
  }

  habilitarRezagado(idInscripcion: string, usuarioAuditoria: string) {
    return this.createQueryBuilder('inscripcion')
      .update()
      .set({
        rezagado: true,
        usuarioActualizacion: usuarioAuditoria,
      })
      .where('id = :idInscripcion', { idInscripcion })
      .execute();
  }

  async listarRezagadosPorEtapa(
    idEtapa: string,
    paginacionQueryDto: PaginacionQueryDto,
  ) {
    const { limite, saltar } = paginacionQueryDto;
    const q = `
    select x.id_inscripcion from (
    select ee.id_inscripcion, count (1) cantidad
    from estudiante_examen ee, inscripcion i, etapa_area_grado eag, etapa e
    where ee.id_inscripcion = i.id
    and i.id_etapa_area_grado = eag.id
    and eag.id_etapa = e.id
    and e.id = '${idEtapa}'
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
    and e.id = '${idEtapa}'
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
    return this.createQueryBuilder('i')
      .innerJoinAndSelect('i.etapaAreaGrado', 'eag')
      .innerJoinAndSelect('i.estudiante', 'e')
      .innerJoinAndSelect('eag.area', 'a')
      .innerJoinAndSelect('eag.gradoEscolar', 'ge')
      .select(['i.id', 'eag.id', 'a.nombre', 'ge.nombre', 'e.rude'])
      .where('i.id IN (' + q + ') ')
      .skip(saltar)
      .take(limite)
      .getManyAndCount();
  }
}
