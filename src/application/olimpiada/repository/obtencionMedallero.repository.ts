import {
  Brackets,
  EntityRepository,
  getManager,
  getRepository,
  Repository,
} from 'typeorm';

import { Inscripcion } from '../entity/Inscripcion.entity';
import { Etapa } from '../entity/Etapa.entity';
import { Olimpiada } from '../entity/Olimpiada.entity';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { tiposEtapa, Status } from '../../../common/constants';
import { GetJsonData } from '../../../common/lib/json.module';
import { EtapaAreaGrado } from '../entity/EtapaAreaGrado.entity';
import { ResultadosView } from '../entity/Resultados.entity';
@EntityRepository(Inscripcion)
export class ObtencionMedalleroRepository extends Repository<Inscripcion> {
  async findDistritosByEtapaAndDepartamento(
    idEtapa: string,
    idDepartamento: string,
  ) {
    return getRepository(Etapa)
      .createQueryBuilder('etapa')
      .innerJoin('etapa.etapaAreaGrados', 'etapaAreaGrados')
      .innerJoin('etapaAreaGrados.inscripcions', 'inscripcions')
      .innerJoin('inscripcions.unidadEducativa', 'unidadEducativa')
      .innerJoin('unidadEducativa.distrito', 'distrito')
      .innerJoin('distrito.departamento', 'departamento')
      .select('distrito.id', 'idDistrito')
      .where('etapa.id = :idEtapa and departamento.id = :idDepartamento', {
        idEtapa,
        idDepartamento,
      })
      .groupBy('distrito.id')
      .getRawMany();
  }

  async findAreasByEtapa(idEtapa: string) {
    return getRepository(Etapa)
      .createQueryBuilder('etapa')
      .innerJoin('etapa.etapaAreaGrados', 'etapaAreaGrados')
      .innerJoin('etapaAreaGrados.area', 'area')
      .select('area.id', 'idArea')
      .where('etapa.id = :idEtapa', {
        idEtapa,
      })
      .groupBy('area.id')
      .getRawMany();
  }

  async findGradosByEtapa(idEtapa: string) {
    return getRepository(Etapa)
      .createQueryBuilder('etapa')
      .innerJoin('etapa.etapaAreaGrados', 'etapaAreaGrados')
      .innerJoin('etapaAreaGrados.gradoEscolar', 'gradoEscolar')
      .select('gradoEscolar.id', 'idGradoEscolar')
      .where('etapa.id = :idEtapa', {
        idEtapa,
      })
      .groupBy('gradoEscolar.id')
      .getRawMany();
  }

  async findListaByNota(opciones: {
    id: string;
    idDepartamento: string;
    idDistrito: string;
    idArea: string;
    idGradoEscolar: string;
  }) {
    const whereDepartamento =
      opciones.idDepartamento == '0'
        ? ''
        : `and id_departamento = '${opciones.idDepartamento}'`;
    const whereDistrito =
      opciones.idDistrito == '0'
        ? ''
        : `and id_distrito = '${opciones.idDistrito}'`;
    const query = `
      select
      eag.id as id_etapa_area_grado, eag.id_area as id_area, eag.id_etapa as  id_etapa, eag.id_grado_escolar as id_grado_escolar,
      i.id as id_inscripcion,
      ee.tipo_prueba, ee.puntaje, EXTRACT(EPOCH FROM (ee.fecha_conclusion - ee.fecha_inicio) * 1000) AS milisegundos,
      ue.id as id_unidad_educatva, ue.area_geografica,
      d.id as id_distrito, d.nombre as nombre_distrito, d.codigo as codigo_distrito,
      d2.id as id_departamento, d2.nombre
      from etapa_area_grado eag
      join inscripcion i on i.id_etapa_area_grado = eag.id
      join estudiante_examen ee on ee.id_inscripcion = i.id
      join unidad_educativa ue on ue.id = i.id_unidad_educativa
      join distrito d on ue.id_distrito = d.id
      join departamento d2 on d2.id = d.id_departamento
      where
      eag.estado = 'ACTIVO' and
      i.estado = 'ACTIVO' and
      (ee.estado = 'FINALIZADO' or ee.estado = 'TIMEOUT') and
      eag.id_etapa = '${opciones.id}' and
      eag.id_area = '${opciones.idArea}' and
      eag.id_grado_escolar = '${opciones.idGradoEscolar}' and
      ee.puntaje is not null
      ${whereDepartamento}
      ${whereDistrito}
      order by puntaje desc, milisegundos
      `;
    const manager = getManager();
    const rawData = await manager.query(query);
    return rawData;
  }

  async listarMedallerosGenerados(
    nivel: any,
    paginacionQueryDto: PaginacionQueryDto,
    etapaTipo: string,
  ) {
    let select = '';
    let groupBy = '';
    let WhereRolNivel = '';
    const rolNivel = nivel.filtro ? GetJsonData(nivel.filtro) : null;
    if (etapaTipo == tiposEtapa.DEPARTAMENTAL) {
      select = 'd2.id as id_departamento, d2.nombre as departamento,';
      groupBy = ', d2.id';
    }
    if (etapaTipo == tiposEtapa.DISTRITAL) {
      select =
        'd2.id as id_departamento, d2.nombre as departamento, d.id as id_distrito, d.nombre  as distrito,';
      groupBy = ', d2.id, d.id';
    }
    if (rolNivel && rolNivel.idArea && etapaTipo == tiposEtapa.NACIONAL) {
      WhereRolNivel = `and a.id = '${rolNivel.idArea}'`;
    } else if (
      rolNivel &&
      rolNivel.idArea &&
      rolNivel.idDepartamento &&
      etapaTipo != tiposEtapa.NACIONAL
    ) {
      WhereRolNivel = `and a.id = '${rolNivel.idArea}' and d2.id = '${rolNivel.idDepartamento}'`;
    }
    const { filtro, orden, saltar, limite } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;
    let where = '';
    if (parametros?.area)
      where = `${where} and a.nombre ilike '%${parametros.area}%'`;
    if (parametros?.grado)
      where = `${where} and ge.nombre ilike '%${parametros.grado}%'`;
    if (parametros?.departamento)
      where = `${where} and d2.nombre ilike '%${parametros.departamento}%'`;
    if (parametros?.distrito)
      where = `${where} and d.nombre ilike '%${parametros.distrito}%'`;
    const query = `select
      eag.id as id_etapa_area_grado,
      a.id as id_area,
      a.nombre as area,
      ge.id as id_grado_escolar,
      ge.nombre as grado_escolar,
      ${select}
      0 as estado_medallero,
      0 as estudiantes,
      count(*) OVER() AS rows_total
      from etapa_area_grado eag
      join area a on eag.id_area = a.id
      join inscripcion i on i.id_etapa_area_grado = eag.id
      join estudiante_examen ee on ee.id_inscripcion = i.id
      join unidad_educativa ue on ue.id = i.id_unidad_educativa
      join distrito d on ue.id_distrito = d.id
      join departamento d2 on d2.id = d.id_departamento
      join grado_escolaridad ge on eag.id_grado_escolar = ge.id
      where eag.id_etapa = '${nivel.idEtapa}'
      ${WhereRolNivel}
      ${where}
      group by(eag.id, ge.id, a.id ${groupBy})
      order by a.nombre ${orden}
      limit ${limite}
      offset ${saltar}`;
    const manager = getManager();
    const rawData = await manager.query(query);
    return rawData;
  }

  async findDatosPosicion(
    datos: {
      idPosicion: string;
      idDepartamento: string;
      idDistrito: string;
    },
    opcion: string,
  ) {
    const query = getRepository(Inscripcion)
      .createQueryBuilder('i')
      .innerJoin('i.estudiante', 'e')
      .innerJoin('e.persona', 'p')
      .innerJoin('i.estudianteExamen', 'ee')
      .innerJoin('i.unidadEducativa', 'ue')
      .innerJoin('ue.distrito', 'd')
      .innerJoin('d.departamento', 'd2')
      .select([
        'i.id',
        'e.rude',
        'p.nombres',
        'p.primerApellido',
        'p.segundoApellido',
        'p.tipoDocumento',
        'p.nroDocumento',
        'ue.id',
        'ue.nombre',
        'ue.tipoUnidadEducativa',
        'ue.areaGeografica',
        'm.ordenGalardon',
        'm.denominativo',
        'm.id',
        'ee.puntaje',
        'd.id',
        'd.nombre',
        'd2.id',
        'd2.nombre',
      ])
      .addSelect(
        'EXTRACT(EPOCH FROM (ee.fecha_conclusion - ee.fecha_inicio) * 1000)',
        'milisegundos',
      )
      .addSelect('0', 'cambio')
      .addSelect('0', 'empates')
      .where(
        new Brackets((qb) => {
          qb.where('ee.estado = :finalizado', {
            finalizado: Status.FINALIZADO,
          }).orWhere('ee.estado = :timeout', {
            timeout: Status.TIMEOUT,
          });
        }),
      );

    if (opcion == 'manual') {
      query.innerJoin('i.idMedalleroPosicionManual', 'm');
      query.addSelect('1', 'seleccion');
      query.andWhere('i.idMedalleroPosicionManual = :idPosicion', {
        idPosicion: datos.idPosicion,
      });
    } else if (opcion == 'automatico') {
      query.innerJoin('i.idMedalleroPosicionAutomatica', 'm');
      query.addSelect('0', 'seleccion');
      query.andWhere('i.idMedalleroPosicionAutomatica = :idPosicion', {
        idPosicion: datos.idPosicion,
      });
    }

    query.andWhere('m.estado = :activo', {
      activo: Status.ACTIVE,
    });

    if (datos.idDepartamento) {
      query.andWhere('d2.id = :idDepartamento', {
        idDepartamento: datos.idDepartamento,
      });
    }

    if (datos.idDistrito) {
      query.andWhere('d.id = :idDistrito', { idDistrito: datos.idDistrito });
    }
    return query.getRawOne();
  }

  async findEtapaByEtapaAreaGrado(idEtapaAreaGrado: string) {
    return getRepository(Etapa)
      .createQueryBuilder('e')
      .innerJoin('e.etapaAreaGrados', 'eag')
      .where('eag.id = :idEtapaAreaGrado', {
        idEtapaAreaGrado,
      })
      .getOne();
  }

  async getOlimpiadaByEtapa(idEtapa: string) {
    return getRepository(Olimpiada)
      .createQueryBuilder('o')
      .innerJoin('o.etapas', 'e')
      .where('e.id = :idEtapa', {
        idEtapa,
      })
      .getOne();
  }

  async medalleroCabecera(idEtapaAreaGrado: string) {
    return getRepository(EtapaAreaGrado)
      .createQueryBuilder('eag')
      .innerJoin('eag.etapa', 'e')
      .innerJoin('e.olimpiada', 'o')
      .innerJoin('eag.area', 'a')
      .innerJoin('eag.gradoEscolar', 'ge')
      .select([
        'o.nombre',
        'o.sigla',
        'e.tipo',
        'a.nombre',
        'ge.nombre',
        'e.id',
      ])
      .where('eag.id = :idEtapaAreaGrado', { idEtapaAreaGrado })
      .getRawOne();
  }

  async acta(idEtapa: string, idArea: string, idDepartamento?: string) {
    const si = 'SI';
    const query = getRepository(ResultadosView)
      .createQueryBuilder('r')
      .where('r.id_etapa = :idEtapa', { idEtapa })
      .andWhere('r.id_area = :idArea', { idArea })
      .andWhere('r.medallero = :si', { si })
      .select([
        'r.idOlimpiada',
        'r.nombreOlimpiada',
        'r.gestion',
        'r.nombreDepartamento',
        'r.nombreDistrito',
        'r.rude',
        'r.nombreUnidadEducativa',
        'r.nombreEtapa',
        'r.tipoEtapa',
        'r.nombreArea',
        'r.nombreGradoEscolar',
        'r.denominacionMedallero',
        'r.subGrupoMedallero',
        'r.ordenGalardonMedallero',
        'r.ordenGradoEscolar',
        'r.clasificado',
      ])
      .orderBy('r.ordenGradoEscolar')
      .addOrderBy('r.ordenGalardonMedallero')
      .addOrderBy('r.nombreDepartamento')
      .addOrderBy('r.nombreDistrito');
    if (idDepartamento) {
      query.andWhere('r.id_departamento = :idDepartamento', {
        idDepartamento,
      });
    }
    return query.getMany();
  }
}
