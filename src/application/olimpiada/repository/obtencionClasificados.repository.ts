import { EntityRepository, getRepository, Repository, In } from 'typeorm';

import { Inscripcion } from '../entity/Inscripcion.entity';
import { EstudianteExamen } from '../entity/EstudianteExamen.entity';
import { Etapa } from '../entity/Etapa.entity';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { GetJsonData } from '../../../common/lib/json.module';
import { Status } from '../../../common/constants';
@EntityRepository(Inscripcion)
export class ObtencionClasificadosRepository extends Repository<EstudianteExamen> {
  /**
   * recupera todos los examenes de una etapa area grado y distrito
   * @param idEtapaAreaGrado
   * @param idDistrito
   * @returns object
   */
  async recuperarExamenesPorDistrito(
    idEtapaAreaGrado: string,
    idDistrito: string,
  ) {
    return getRepository(EstudianteExamen)
      .createQueryBuilder('estudianteExamen')
      .innerJoin('estudianteExamen.inscripcion', 'inscripcion')
      .innerJoin('inscripcion.estudiante', 'estudiante')
      .innerJoin('estudiante.persona', 'persona')
      .innerJoin('inscripcion.unidadEducativa', 'unidadEducativa')
      .leftJoin(
        'inscripcion.idMedalleroPosicionAutomatica',
        'medalleroAutomatico',
      )
      .leftJoin('inscripcion.idMedalleroPosicionManual', 'medalleroManual')
      .innerJoin('unidadEducativa.distrito', 'distrito')
      .innerJoin('distrito.departamento', 'departamento')
      .select([
        'estudianteExamen.id',
        'estudianteExamen.tipoPrueba',
        'estudianteExamen.tipoPlanificacion',
        'estudianteExamen.puntaje',
        'estudianteExamen.fechaConclusion',
        'inscripcion.id',
        'inscripcion.idMedalleroPosicionAutomatica',
        'inscripcion.idMedalleroPosicionManual',
        'inscripcion.idEtapaAreaGrado',
        'medalleroManual.id',
        'medalleroAutomatico.id',
        'estudiante.id',
        'estudiante.rude',
        'persona.nro_documento',
      ])
      .where('inscripcion.idEtapaAreaGrado = :idEtapaAreaGrado', {
        idEtapaAreaGrado,
      })
      .andWhere('distrito.id = :idDistrito', { idDistrito })
      .andWhere("estudianteExamen.estado IN ('FINALIZADO', 'TIMEOUT')")
      .orderBy({
        'estudianteExamen.puntaje': 'DESC',
        'estudianteExamen.fechaConclusion': 'DESC',
      })
      .getMany();
  }

  /**
   * recupera todos los examenes de una etapa area grado y departamento
   * @param idEtapaAreaGrado
   * @param idDepartamento
   * @returns object
   */
  async recuperarExamenesPorDepartamento(
    idEtapaAreaGrado: string,
    idDepartamento: string,
  ) {
    return getRepository(EstudianteExamen)
      .createQueryBuilder('estudianteExamen')
      .innerJoin('estudianteExamen.inscripcion', 'inscripcion')
      .innerJoin('inscripcion.estudiante', 'estudiante')
      .innerJoin('estudiante.persona', 'persona')
      .innerJoin('inscripcion.unidadEducativa', 'unidadEducativa')
      .leftJoin(
        'inscripcion.idMedalleroPosicionAutomatica',
        'medalleroAutomatico',
      )
      .leftJoin('inscripcion.idMedalleroPosicionManual', 'medalleroManual')
      .innerJoin('unidadEducativa.distrito', 'distrito')
      .innerJoin('distrito.departamento', 'departamento')
      .select([
        'estudianteExamen.id',
        'estudianteExamen.tipoPrueba',
        'estudianteExamen.tipoPlanificacion',
        'estudianteExamen.puntaje',
        'estudianteExamen.fechaConclusion',
        'inscripcion.id',
        'inscripcion.idMedalleroPosicionAutomatica',
        'inscripcion.idMedalleroPosicionManual',
        'inscripcion.idEtapaAreaGrado',
        'estudiante.id',
        'estudiante.rude',
        'persona.nro_documento',
      ])
      .where('inscripcion.idEtapaAreaGrado = :idEtapaAreaGrado', {
        idEtapaAreaGrado,
      })
      .andWhere('departamento.id = :idDepartamento', { idDepartamento })
      .andWhere("estudianteExamen.estado IN ('FINALIZADO', 'TIMEOUT')")
      .orderBy({
        'estudianteExamen.puntaje': 'DESC',
        'estudianteExamen.fechaConclusion': 'DESC',
      })
      .getMany();
  }

  /**
   * recupera todos los examenes de una etapa area grado a nivel nacional
   * @param idEtapaAreaGrado
   * @returns object
   */
  async recuperarExamenesNacional(idEtapaAreaGrado: string) {
    return getRepository(EstudianteExamen)
      .createQueryBuilder('estudianteExamen')
      .innerJoin('estudianteExamen.inscripcion', 'inscripcion')
      .innerJoin('inscripcion.estudiante', 'estudiante')
      .innerJoin('estudiante.persona', 'persona')
      .innerJoin('inscripcion.unidadEducativa', 'unidadEducativa')
      .leftJoin(
        'inscripcion.idMedalleroPosicionAutomatica',
        'medalleroAutomatico',
      )
      .leftJoin('inscripcion.idMedalleroPosicionManual', 'medalleroManual')
      .innerJoin('unidadEducativa.distrito', 'distrito')
      .innerJoin('distrito.departamento', 'departamento')
      .select([
        'estudianteExamen.id',
        'estudianteExamen.tipoPrueba',
        'estudianteExamen.tipoPlanificacion',
        'estudianteExamen.puntaje',
        'estudianteExamen.fechaConclusion',
        'inscripcion.id',
        'inscripcion.idMedalleroPosicionAutomatica',
        'inscripcion.idMedalleroPosicionManual',
        'inscripcion.idEtapaAreaGrado',
        'estudiante.id',
        'estudiante.rude',
        'persona.nro_documento',
      ])
      .where('inscripcion.idEtapaAreaGrado = :idEtapaAreaGrado', {
        idEtapaAreaGrado,
      })
      .andWhere("estudianteExamen.estado IN ('FINALIZADO', 'TIMEOUT')")
      .orderBy({
        'estudianteExamen.puntaje': 'DESC',
        'estudianteExamen.fechaConclusion': 'DESC',
      })
      .getMany();
  }

  /**
   * recupera todas las etapas areas grado de una etapa
   * @param idEtapa
   * @returns object
   */
  async findEtapaAreaGradosByEtapa(idEtapa: string) {
    return (
      getRepository(Etapa)
        .createQueryBuilder('etapa')
        .innerJoin('etapa.etapaAreaGrados', 'etapaAreaGrados')
        .innerJoin('etapaAreaGrados.area', 'area')
        .innerJoin('etapaAreaGrados.gradoEscolar', 'grado')
        .select([
          'etapa.id',
          'etapa.nombre',
          'etapa.tipo',
          'etapaAreaGrados.id',
          'etapaAreaGrados.criterioCalificacion',
          'etapaAreaGrados.puntajeMinimoClasificacion',
          'etapaAreaGrados.criterioMedallero',
          'etapaAreaGrados.cantidadMaximaClasificados',
          'area.id',
          'area.nombre',
          'grado.id',
          'grado.nombre',
        ])
        .where('etapa.id = :idEtapa', {
          idEtapa,
        })
        .andWhere('etapaAreaGrados.estado =:estadoEag', {
          estadoEag: 'ACTIVO',
        })
        // .groupBy('area.id')
        .getOne()
    );
  }

  /**
   * actualiza todos las inscripciones
   * @param ids array de ids incripciones
   * @param reglas con las que clasifico
   */
  async marcarClasificados(ids: Array<any>, reglas: any, usuarioActualizacion) {
    return this.createQueryBuilder()
      .update(Inscripcion)
      .set({
        clasificado: true,
        fechaClasificacion: new Date(),
        reglasClasificacion: reglas,
        usuarioActualizacion,
      })
      .where({ id: In(ids) })
      .execute();
  }

  /**
   * actualiza la etapa con el estado clasificacion en  el posicionamiento
   * @param id id de la etapa
   */
  async marcarClasificadoEtapa(id: string) {
    return this.createQueryBuilder()
      .update(Etapa)
      .set({
        estadoPosicionamiento: Status.GENERAR_CLASIFICADOS,
      })
      .where({ id })
      .execute();
  }

  /**
   * recupera todos los clasificados segun el filtro
   * @param idEtapaAreaGrado
   * @param idDepartamento
   * @returns object
   */
  async obtenerClasificados(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;
    const query = getRepository(Inscripcion)
      .createQueryBuilder('inscripcion')
      .innerJoin('inscripcion.etapaAreaGrado', 'eag')
      .innerJoin('eag.etapa', 'etapa')
      .innerJoin('etapa.olimpiada', 'olimpiada')
      .innerJoin('eag.gradoEscolar', 'gradoEscolar')
      .innerJoin('eag.area', 'area')
      .innerJoin('inscripcion.estudiante', 'estudiante')
      .innerJoin('inscripcion.estudianteExamen', 'estudianteExamen')
      .innerJoin('estudiante.persona', 'persona')
      .innerJoin('inscripcion.unidadEducativa', 'unidadEducativa')
      .innerJoin('unidadEducativa.distrito', 'distrito')
      .innerJoin('distrito.departamento', 'departamento')
      .select([
        'etapa.id',
        'etapa.nombre',
        'area.id',
        'area.nombre',
        'gradoEscolar.id',
        'gradoEscolar.nombre',
        'estudianteExamen.id',
        'estudianteExamen.puntaje',
        'eag.id',
        'distrito.id',
        'distrito.nombre',
        'departamento.nombre',
        'inscripcion.id',
        'inscripcion.idMedalleroPosicionAutomatica',
        'inscripcion.idMedalleroPosicionManual',
        'inscripcion.idEtapaAreaGrado',
        'inscripcion.clasificado',
        'inscripcion.fechaClasificacion',
        'unidadEducativa.id',
        'unidadEducativa.nombre',
        'unidadEducativa.codigoSie',
        // 'inscripcion.reglasClasificacion',
        'estudiante.id',
        'estudiante.rude',
        'persona.nro_documento',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
      ])
      .skip(saltar)
      .take(limite)
      .orderBy('area.nombre', 'ASC')
      .addOrderBy('gradoEscolar.nombre', 'ASC')
      .addOrderBy('estudianteExamen.puntaje', 'DESC');
    query.andWhere('inscripcion.clasificado = true');
    query.andWhere(`estudianteExamen.estado IN ('FINALIZADO', 'TIMEOUT')`);
    query.andWhere('inscripcion.estado = :estado', {
      estado: 'ACTIVO',
    });
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
    if (parametros?.idOlimpiada) {
      query.andWhere('olimpiada.id = :idOlimpiada', {
        idOlimpiada: parametros.idOlimpiada,
      });
    }
    if (parametros?.idEtapa) {
      query.andWhere('etapa.id = :idEtapa', { idEtapa: parametros.idEtapa });
    }
    return query.getManyAndCount();
  }
  runTransaction(op) {
    return this.manager.transaction(op);
  }
}
