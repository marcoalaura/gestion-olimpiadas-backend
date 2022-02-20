import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { EntityRepository, getRepository, Repository } from 'typeorm';

import { Estudiante } from '../entity/Estudiante.entity';
import { EstudianteExamen } from '../entity/EstudianteExamen.entity';
import { EstudianteCreacionDto } from '../dto/estudiante.dto';
import { Persona } from '../../persona/persona.entity';
import { Status, TipoPrueba } from '../../../common/constants';
import { Inscripcion } from '../entity/Inscripcion.entity';

@EntityRepository(Estudiante)
export class EstudianteRepository extends Repository<Estudiante> {
  async obtenerEstudiantes(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar } = paginacionQueryDto;
    return getRepository(Estudiante)
      .createQueryBuilder('estudiante')
      .leftJoinAndSelect('estudiante.persona', 'persona')
      .select([
        'estudiante.id',
        'estudiante.rude',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
        'persona.nroDocumento',
        'persona.tipoDocumento',
        'persona.estado',
        'persona.fechaNacimiento',
      ])
      .take(limite)
      .skip(saltar)
      .getManyAndCount();
  }

  async encontrarPorId(id: string) {
    return getRepository(Estudiante)
      .createQueryBuilder('estudiante')
      .leftJoinAndSelect('estudiante.persona', 'persona')
      .select([
        'estudiante.id',
        'estudiante.rude',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
        'persona.nroDocumento',
        'persona.tipoDocumento',
        'persona.estado',
        'persona.fechaNacimiento',
      ])
      .where('estudiante.id = :id', { id })
      .getOne();
  }

  async crear(estudianteDto: EstudianteCreacionDto, usuarioAuditoria: string) {
    const persona = new Persona();
    persona.nombres = estudianteDto.persona.nombres;
    persona.primerApellido = estudianteDto.persona.primerApellido;
    persona.segundoApellido = estudianteDto.persona.segundoApellido;
    persona.nroDocumento = estudianteDto.persona.nroDocumento;
    persona.fechaNacimiento = estudianteDto.persona.fechaNacimiento;

    const estudiante = new Estudiante();
    estudiante.persona = persona;
    estudiante.usuarioCreacion = usuarioAuditoria;
    estudiante.rude = estudianteDto.rude;
    return this.save(estudiante);
  }

  /**
   * Metodo para listar los examenes de un estudiante de la olimpiada y etapa actual
   * lista de la pantalla principal del estudiante
   * @param id identificador del estudiante
   * @returns object
   */
  async encontrarExamenes(id: string, idOlimpiada: string) {
    const tipoPruebaOnline = TipoPrueba.ONLINE;
    return getRepository(EstudianteExamen)
      .createQueryBuilder('examen')
      .innerJoinAndSelect('examen.inscripcion', 'inscripcion')
      .innerJoinAndSelect('inscripcion.etapaAreaGrado', 'eag')
      .innerJoinAndSelect('eag.calendarios', 'calendario')
      .innerJoinAndSelect('eag.area', 'area')
      .innerJoinAndSelect('eag.gradoEscolar', 'gradoEscolar')
      .innerJoinAndSelect('eag.etapa', 'etapa')
      .innerJoinAndSelect('etapa.olimpiada', 'olimpiada')
      .select([
        'examen.id AS "idExamen"',
        'examen.estado AS estado',
        'calendario.fechaHoraInicio AS "fechaHoraInicio"',
        'calendario.fechaHoraFin AS "fechaHoraFin"',
        'eag.duracionMinutos AS "duracionMinutos"',
        'area.nombre AS "area"',
        'area.logo AS "logo"',
        'gradoEscolar.nombre AS "gradoEscolar"',
        'etapa.nombre AS "etapa"',
        'etapa.estado AS "etapaEstado"',
        'olimpiada.nombre AS "olimpiada"',
        'calendario.tipoPlanificacion AS "tipoPlanificacion"',
      ])
      .where('inscripcion.id_estudiante = :id', { id })
      .andWhere('olimpiada.id = :idOlimpiada', { idOlimpiada })
      .andWhere('calendario.tipo_prueba = :calTipoPrueba', {
        calTipoPrueba: tipoPruebaOnline,
      })
      .andWhere('calendario.estado != :calEstado', {
        calEstado: Status.ELIMINADO,
      })
      .andWhere('examen.tipo_prueba = :exaTipoPrueba', {
        exaTipoPrueba: tipoPruebaOnline,
      })
      .andWhere(
        'examen.estado IN (:estadoActivo, :estadoEnProceso, :estadoFinalizado, :estadoTimeout, :estadoInactivo)',
        {
          estadoActivo: Status.ACTIVE,
          estadoEnProceso: Status.EN_PROCESO,
          estadoFinalizado: Status.FINALIZADO,
          estadoTimeout: Status.TIMEOUT,
          estadoInactivo: Status.INACTIVE,
        },
      )
      .andWhere('olimpiada.estado = :estadoOlimpiada', {
        estadoOlimpiada: Status.ACTIVE,
      })
      .andWhere(
        'calendario.tipo_planificacion::text = examen.tipo_planificacion::text',
      )
      .andWhere('now()::date between etapa.fechaInicio and etapa.fechaFin')
      .getRawMany();
  }

  async encontrarExamenesEnCalendatioVigente(
    idEstudiante: string,
    idEtapaAreaGrado: string,
    idOlimpiada: string,
  ) {
    return getRepository(EstudianteExamen)
      .createQueryBuilder('examen')
      .innerJoinAndSelect('examen.inscripcion', 'inscripcion')
      .innerJoinAndSelect('inscripcion.etapaAreaGrado', 'eag')
      .innerJoinAndSelect('eag.calendarios', 'calendario')
      .innerJoinAndSelect('eag.area', 'area')
      .innerJoinAndSelect('eag.gradoEscolar', 'gradoEscolar')
      .innerJoinAndSelect('eag.etapa', 'etapa')
      .innerJoinAndSelect('etapa.olimpiada', 'olimpiada')
      .select([
        'examen.id AS "idExamen"',
        'eag.id AS "idEtapaAreaGrado"',
        'examen.estado AS estado',
        'examen.fechaInicio AS "fechaInicio"',
        'examen.fechaConclusion AS "fechaConclusion"',
        'eag.duracionMinutos AS "duracionMinutos"',
        'area.nombre AS "area"',
        'gradoEscolar.nombre AS "gradoEscolar"',
        'etapa.nombre AS "etapa"',
        'olimpiada.nombre AS "olimpiada"',
        'calendario.tipoPlanificacion AS "tipoPlanificacion"',
      ])
      .where('inscripcion.id_estudiante = :id', { id: idEstudiante })
      .andWhere('eag.id = :idEtapaAreaGrado', { idEtapaAreaGrado })
      .andWhere('olimpiada.id = :idOlimpiada', { idOlimpiada })
      .andWhere('calendario.tipo_prueba = :calTipoPrueba', {
        calTipoPrueba: TipoPrueba.ONLINE,
      })
      .andWhere('calendario.estado != :calEstado', {
        calEstado: Status.ELIMINADO,
      })
      .andWhere('examen.tipo_prueba = :tipoPrueba', {
        tipoPrueba: TipoPrueba.ONLINE,
      })
      .andWhere(
        'examen.estado IN (:estadoActivo, :estadoEnProceso, :estadoFinalizado, :estadoTimeout)',
        {
          estadoActivo: Status.ACTIVE,
          estadoEnProceso: Status.EN_PROCESO,
          estadoFinalizado: Status.FINALIZADO,
          estadoTimeout: Status.TIMEOUT,
        },
      )
      .andWhere('olimpiada.estado = :estadoOlimpiada', {
        estadoOlimpiada: Status.ACTIVE,
      })
      .andWhere(
        'calendario.tipo_planificacion::text = examen.tipo_planificacion::text',
      )
      .andWhere('now()::date between etapa.fechaInicio and etapa.fechaFin')
      .getRawMany();
  }

  async encontrarExamenesHistoricos(id: string) {
    return getRepository(EstudianteExamen)
      .createQueryBuilder('examen')
      .innerJoinAndSelect('examen.inscripcion', 'inscripcion')
      .innerJoinAndSelect('inscripcion.etapaAreaGrado', 'eag')
      .innerJoinAndSelect('eag.area', 'area')
      .innerJoinAndSelect('eag.gradoEscolar', 'gradoEscolar')
      .innerJoinAndSelect('eag.etapa', 'etapa')
      .innerJoinAndSelect('etapa.olimpiada', 'olimpiada')
      .select([
        'examen.id AS "idExamen"',
        'examen.estado AS estado',
        'examen.tipoPrueba AS "tipoPrueba"',
        'examen.tipoPlanificacion AS "tipoPlanificacion"',
        'examen.fechaInicio AS "fechaInicio"',
        'examen.fechaConclusion AS "fechaFin"',
        'eag.duracionMinutos AS "duracionMinutos"',
        'area.nombre AS "area"',
        'area.logo AS "logo"',
        'gradoEscolar.nombre AS "gradoEscolar"',
        'etapa.nombre AS "etapa"',
        'olimpiada.id AS "idOlimpiada"',
        'olimpiada.nombre AS "olimpiada"',
      ])
      .where('inscripcion.id_estudiante = :id', { id })
      .andWhere('examen.estado in (:...estados)', {
        estados: ['FINALIZADO', 'TIMEOUT'],
      })
      .getRawMany();
    /*
      .andWhere('olimpiada.estado = :estadoOlimpiada', {
        estadoOlimpiada: Status.CLOSED,
      })
    */
  }

  async encontrarEstudiantePorCiRude(ci: string, rude: string) {
    const queryBuilder = await this.createQueryBuilder('estudiante')
      .innerJoinAndSelect(
        'estudiante.persona',
        'persona',
        'nro_documento = :ci',
        { ci },
      )
      .select([
        'estudiante.id',
        'estudiante.rude',
        'estudiante.id_persona',
        'persona.nroDocumento',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
      ])
      .where({ rude: rude })
      .getOne();
    return queryBuilder;
  }

  async guardarItem(item: any, usuarioAuditoria: string) {
    const resPersona = await this.manager.findOne(Persona, {
      nroDocumento: item.nroDocumento,
    });
    const persona = new Persona();
    if (resPersona) persona.id = resPersona.id;
    persona.nombres = item.nombres;
    persona.primerApellido = item.primerApellido;
    persona.segundoApellido = item.segundoApellido;
    persona.nroDocumento = item.nroDocumento;
    persona.fechaNacimiento = item.fechaNacimiento;
    persona.genero = item.genero;
    persona.telefono = item.telefono;
    persona.correoElectronico = item.correo;

    const resEstudiante = await this.manager.findOne(Estudiante, {
      rude: item.rude,
    });
    const estudiante = new Estudiante();
    estudiante.rude = item.rude;
    estudiante.persona = persona;
    estudiante.estado = Status.ACTIVE;
    if (resEstudiante) {
      estudiante.id = resEstudiante.id;
      estudiante.usuarioActualizacion = usuarioAuditoria;
    } else {
      estudiante.usuarioCreacion = usuarioAuditoria;
    }

    return await this.save(estudiante);
  }

  async buscarEstudianteConDistintoRude(nroDocumento: string, rude: string) {
    return this.createQueryBuilder('estudiante')
      .leftJoinAndSelect('estudiante.persona', 'persona')
      .where(
        'persona.nroDocumento = :nroDocumento AND estudiante.rude <> :rude',
        {
          nroDocumento,
          rude,
        },
      )
      .getOne();
  }

  async buscarRudeConDistintoEstudiante(nroDocumento: string, rude: string) {
    return this.createQueryBuilder('estudiante')
      .leftJoinAndSelect('estudiante.persona', 'persona')
      .where(
        'persona.nroDocumento <> :nroDocumento AND estudiante.rude = :rude',
        {
          nroDocumento,
          rude,
        },
      )
      .getOne();
  }

  buscarEstudiantePorCiRude(ciRude: string) {
    return getRepository(Inscripcion)
      .createQueryBuilder('inscripcion')
      .innerJoinAndSelect('inscripcion.estudiante', 'estudiante')
      .innerJoinAndSelect('estudiante.persona', 'persona')
      .leftJoinAndSelect('inscripcion.unidadEducativa', 'ue')
      .leftJoinAndSelect('ue.distrito', 'd')
      .leftJoinAndSelect('d.departamento', 'de')
      .select([
        'estudiante.id as "idEstudiante"',
        'estudiante.rude as "rude"',
        'estudiante.id_persona as "idPersona"',
        'persona.nroDocumento as "nroDocumento"',
        'persona.nombres as "nombres"',
        'persona.primerApellido as "primerApellido"',
        'persona.segundoApellido as "segundoApellido"',
        'persona.fechaNacimiento as "fechaNacimiento"',
        'persona.genero as "genero"',
        'de.nombre as "departamento"',
        'd.nombre as "distritoEducativo"',
        'ue.nombre as "unidadEducativa"',
      ])
      .where('estudiante.rude = :cadena OR persona.nroDocumento = :cadena', {
        cadena: ciRude,
      })
      .getRawOne();
  }

  async encontrarOlimpiadas(idEstudiante: string) {
    return getRepository(Inscripcion)
      .createQueryBuilder('inscripcion')
      .innerJoinAndSelect('inscripcion.etapaAreaGrado', 'eag')
      .innerJoinAndSelect('eag.etapa', 'etapa')
      .innerJoinAndSelect('etapa.olimpiada', 'olimpiada')
      .select([
        'DISTINCT olimpiada.id AS "id"',
        'olimpiada.nombre AS "nombre"',
        'olimpiada.logo AS "logo"',
        'olimpiada.estado AS "estado"',
        'olimpiada.fechaCreacion AS "fechaCreacion"',
      ])
      .where('inscripcion.id_estudiante = :id', { id: idEstudiante })
      .andWhere('olimpiada.estado = :estadoOlimpiada', {
        estadoOlimpiada: Status.ACTIVE,
      })
      .orderBy('olimpiada.fechaCreacion', 'DESC')
      .getRawMany();
  }
}
