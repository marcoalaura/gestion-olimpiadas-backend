import { PreconditionFailedException } from '@nestjs/common';
import { ReporteQueryDto } from 'src/common/dto/report-query.dto';
import { EntityRepository, getManager, Repository } from 'typeorm';
import { Olimpiada } from '../olimpiada/entity/Olimpiada.entity';

@EntityRepository(Olimpiada)
export class ReporteRepository extends Repository<Olimpiada> {
  getFilters(reporteQueryDto: ReporteQueryDto, comillas = "'") {
    const {
      idOlimpiada,
      idEtapa,
      idArea,
      idDepartamento,
      idDistrito,
      idGradoEscolar,
    } = reporteQueryDto;
    let queryOlimpiada = '';
    if (idOlimpiada) {
      queryOlimpiada = `and id_olimpiada = ${comillas}${idOlimpiada}${comillas}`;
    }

    let queryEtapa = '';
    if (idEtapa) {
      queryEtapa = `and id_etapa = ${comillas}${idEtapa}${comillas}`;
    }

    let queryArea = '';
    if (idArea) {
      queryArea = `and id_area = ${comillas}${idArea}${comillas}`;
    }

    let queryDepartamento = '';
    if (idDepartamento) {
      queryDepartamento = `and id_departamento = ${comillas}${idDepartamento}${comillas}`;
    }

    let queryDistrito = '';
    if (idDistrito) {
      queryDistrito = `and id_distrito = ${comillas}${idDistrito}${comillas}`;
    }

    let queryGradoEscolar = '';
    if (idGradoEscolar) {
      queryGradoEscolar = `and id_grado_escolar = ${comillas}${idGradoEscolar}${comillas}`;
    }

    return `${queryOlimpiada} ${queryEtapa} ${queryArea} ${queryDepartamento} ${queryDistrito} ${queryGradoEscolar}`;
  }

  async frecuenciasPorcentaje(reporteQueryDto: ReporteQueryDto) {
    const filtros = this.getFilters(reporteQueryDto);

    const manager = getManager();
    const totalCantidad = await manager.query(
      `select count(*) from v_resultados where id is not null and puntaje is not null ${filtros}`,
    );
    const cantidad = totalCantidad[0].count;
    const query = `
         select 0 as min,
         10 as max,
         count(*) as cantidad_estudiantes,
         case when ${cantidad} > 0 then round(count(*)*100::decimal/(${cantidad}), 2)  else 0 end as porcentaje_acumulado
         from v_resultados vr
         where puntaje >= 0 and puntaje <= 10
         ${filtros}
         union
         select 11 as min,
         20 as max,
         count(*) as cantidad_estudiantes,
         case when ${cantidad} > 0 then round(count(*)*100::decimal/(${cantidad}), 2)  else 0 end as porcentaje_acumulado
         from v_resultados vr
         where puntaje >= 11 and puntaje <= 20
         ${filtros}
         union
         select 21 as min,
         30 as max,
         count(*) as cantidad_estudiantes,
         case when ${cantidad} > 0 then round(count(*)*100::decimal/(${cantidad}), 2)  else 0 end as porcentaje_acumulado
         from v_resultados vr
         where puntaje >= 21 and puntaje <= 30
         ${filtros}
         union
         select 31 as min,
         40 as max,
         count(*) as cantidad_estudiantes,
         case when ${cantidad} > 0 then round(count(*)*100::decimal/(${cantidad}), 2)  else 0 end as porcentaje_acumulado
         from v_resultados vr
         where puntaje >= 31 and puntaje <= 40
         ${filtros}
         union
         select 41 as min,
         50 as max,
         count(*) as cantidad_estudiantes,
         case when ${cantidad} > 0 then round(count(*)*100::decimal/(${cantidad}), 2)  else 0 end as porcentaje_acumulado
         from v_resultados vr
         where puntaje >= 41 and puntaje <= 50
         ${filtros}
         union
         select 51 as min,
         60 as max,
         count(*) as cantidad_estudiantes,
         case when ${cantidad} > 0 then round(count(*)*100::decimal/(${cantidad}), 2)  else 0 end as porcentaje_acumulado
         from v_resultados vr
         where puntaje >= 51 and puntaje <= 60
         ${filtros}
         union
         select 61 as min,
         70 as max,
         count(*) as cantidad_estudiantes,
         case when ${cantidad} > 0 then round(count(*)*100::decimal/(${cantidad}), 2)  else 0 end as porcentaje_acumulado
         from v_resultados vr
         where puntaje >= 61 and puntaje <= 70
         ${filtros}
         union
         select 71 as min,
         80 as max,
         count(*) as cantidad_estudiantes,
         case when ${cantidad} > 0 then round(count(*)*100::decimal/(${cantidad}), 2)  else 0 end as porcentaje_acumulado
         from v_resultados vr
         where puntaje >= 71 and puntaje <= 80
         ${filtros}
         union
         select 81 as min,
         90 as max,
         count(*) as cantidad_estudiantes,
         case when ${cantidad} > 0 then round(count(*)*100::decimal/(${cantidad}), 2)  else 0 end as porcentaje_acumulado
         from v_resultados vr
         where puntaje >= 81 and puntaje <= 90
         ${filtros}
         union
         select 91 as min,
         100 as max,
         count(*) as cantidad_estudiantes,
         case when ${cantidad} > 0 then round(count(*)*100::decimal/(${cantidad}), 2)  else 0 end as porcentaje_acumulado
         from v_resultados vr
         where puntaje >= 91 and puntaje <= 100
         ${filtros}
         order by min asc;
    `;
    const rawData = await manager.query(query);
    return rawData;
  }

  async obtenerPromedioDepartamentoArea(reporteQueryDto: ReporteQueryDto) {
    const filtros = this.getFilters(reporteQueryDto, "''");
    const nombre = Date.now();
    try {
      const queryPivot = `
      select dynamic_pivot(
           E'SELECT
           nombre_area,
           UPPER(nombre_departamento) nombre_departamento,
           case when round(avg(puntaje), 2) = 0.00 then 0 else round(avg(puntaje), 2) end  as promedio
           FROM v_resultados where id is not null
           ${filtros}
         group by id_area, nombre_area, nombre_departamento ORDER BY 1
         ',
         E'select UPPER(nombre) nombre from departamento',
         '"${nombre}"'
      ) as cur;`;

      const query = `select * from "${nombre}";`;
      const dropPivot = `drop table "${nombre}"`;

      const manager = getManager();
      await manager.query(queryPivot);
      const resp = await manager.query(query);
      await manager.query(dropPivot);
      return resp;
    } catch (error) {
      console.log('error dynamic pivot', error);
      throw new PreconditionFailedException('No se encontraron resultados');
    }
  }

  async obtenerPromedioAnioEscolaridadDepartamentoArea(
    reporteQueryDto: ReporteQueryDto,
  ) {
    const filtros = this.getFilters(reporteQueryDto, "''");
    try {
      const nombre = Date.now();
      const queryPivot = `
          select dynamic_pivot(
          E'SELECT nombre_area,
          nombre_grado_escolar as nombre,
          case when round(avg(puntaje), 2) = 0.00 then 0 else round(avg(puntaje), 2) end  as promedio
          FROM v_resultados
          where id is not null ${filtros}
          group by id_area, nombre_area, id_grado_escolar, nombre_grado_escolar ORDER BY 1
         ',
         E'select upper(nombre) nombre from grado_escolaridad order by orden asc',
         '"${nombre}"'
         ) as cur;
         `;

      const query = `
         select
         * from "${nombre}";
    `;

      const dropPivot = `drop table "${nombre}"`;

      const manager = getManager();
      await manager.query(queryPivot);
      const resp = await manager.query(query);
      await manager.query(dropPivot);
      return resp;
    } catch (error) {
      console.log('error dynamic pivot', error);
      throw new PreconditionFailedException('No se encontraron resultados');
    }
  }

  async obtenerParticipacion(reporteQueryDto: ReporteQueryDto) {
    const filtros = this.getFilters(reporteQueryDto);
    const query = `
      (SELECT t.nombre_departamento departamento, t.nombre_area area, t.habilitados, t.participacion,
      case when t.habilitados::numeric > 0 then round(t.participacion::numeric / t.habilitados::numeric * 100) else 0 end "porcentajeParticipacion"
      FROM (
        SELECT 
        nombre_departamento,
        nombre_area,
        count(*) habilitados,
        sum(case when puntaje >= 0 and estado_puntaje is not null then 1 else 0 end) participacion
        FROM v_resultados
        WHERE id is not null ${filtros}
        GROUP BY nombre_departamento, id_area, nombre_area 
        ORDER BY 1, 2
      ) t)
      UNION ALL
      (SELECT 'NACIONAL' departamento, t.nombre_area area, t.habilitados, t.participacion,
      case when t.habilitados::numeric > 0 then round(t.participacion::numeric / t.habilitados::numeric * 100) else 0 end "porcentajeParticipacion"
      FROM (
        SELECT
        'NACIONAL',
        nombre_area,
        count(*) habilitados,
        sum(case when puntaje >= 0 and estado_puntaje is not null then 1 else 0 end) participacion
        FROM v_resultados
        WHERE id is not null ${filtros}
        GROUP BY id_area, nombre_area
        ORDER BY 1, 2
      ) t)
      `;
    const manager = getManager();
    return manager.query(query);
  }

  async obtenerParticipacionTipoPrueba(reporteQueryDto: ReporteQueryDto) {
    const filtros = this.getFilters(reporteQueryDto);
    const query = `
      SELECT t.nombre_departamento departamento, t.habilitados, t.participacion,
      case when t.habilitados::numeric > 0 then round(t.participacion::numeric / t.habilitados::numeric * 100) else 0 end "porcentajeParticipacion",
      t.online,
      case when t.participacion::numeric > 0 then round(t.online::numeric / t.participacion::numeric * 100) else 0 end "porcentajeOnline",
      t.offline,
      case when t.participacion::numeric > 0 then round(t.offline::numeric / t.participacion::numeric * 100) else 0 end "porcentajeOffline"
      FROM (
        (SELECT 
        nombre_departamento,
        count(*) habilitados,
        sum(case when puntaje > 0 then 1 else 0 end) participacion,
        sum(case when puntaje > 0 and tipo_prueba = 'ONLINE' then 1 else 0 end) online,
        sum(case when puntaje > 0 and tipo_prueba = 'OFFLINE' then 1 else 0 end) offline
        FROM v_resultados
        WHERE id is not null ${filtros}
        GROUP BY nombre_departamento)
        UNION ALL
        (SELECT 
        'NACIONAL',
        count(*) habilitados,
        sum(case when puntaje > 0 then 1 else 0 end) participacion,
        sum(case when puntaje > 0 and tipo_prueba = 'ONLINE' then 1 else 0 end) online,
        sum(case when puntaje > 0 and tipo_prueba = 'OFFLINE' then 1 else 0 end) offline
        FROM v_resultados
        WHERE id is not null ${filtros} )
      ) t;`;
    const manager = getManager();
    return manager.query(query);
  }

  async obtenerPreguntas(reporteQueryDto: ReporteQueryDto) {
    const {
      idOlimpiada,
      idEtapa,
      idArea,
      idDistrito,
      idDepartamento,
      idGradoEscolar,
    } = reporteQueryDto;
    let queryOlimpiada = '';
    if (idOlimpiada) {
      queryOlimpiada = ` and e.id_olimpiada = '${idOlimpiada}'`;
    }
    let queryEtapa = '';
    if (idEtapa) {
      queryEtapa = ` and e.id = '${idEtapa}'`;
    }
    let queryArea = '';
    if (idArea) {
      queryArea = ` and eag.id_area = '${idArea}'`;
    }
    let queryDistrito = '';
    if (idDistrito) {
      queryDistrito = ` and d.id = '${idDistrito}'`;
    }
    let queryDepartamento = '';
    if (idDepartamento) {
      queryDepartamento = ` and d2.id = '${idDepartamento}'`;
    }
    let queryGradoEscolaridad = '';
    if (idGradoEscolar) {
      queryGradoEscolaridad = ` and eag.id_grado_escolar = '${idGradoEscolar}'`;
    }
    const filtros = `${queryOlimpiada} ${queryEtapa} ${queryArea} ${queryDepartamento} ${queryDistrito} ${queryGradoEscolaridad}`;
    const filtrosNacional = `${queryOlimpiada} ${queryEtapa} ${queryArea} ${queryGradoEscolaridad}`;

    let query = '';
    query = `
         select
         d2.nombre departamento, p.texto_pregunta pregunta, p.imagen_pregunta imagen, count(p.id) cantidad,
         sum(case when eed.puntaje > 0 then 1  else 0 end) correcto
         from pregunta p
         inner join estudiante_examen_detalle eed on p.id = eed.id_pregunta and eed.estado = 'FINALIZADO'
         inner join estudiante_examen ee on eed.id_estudiante_examen = ee.id and (ee.estado = 'FINALIZADO' or ee.estado = 'TIMEOUT')
         inner join inscripcion i on ee.id_inscripcion = i.id and i.estado = 'ACTIVO'
         inner join unidad_educativa ue on i.id_unidad_educativa = ue.id and ue.estado = 'ACTIVO'
         inner join distrito d on ue.id_distrito = d.id and d.estado = 'ACTIVO'
         inner join departamento d2 on d.id_departamento = d2.id
         inner join etapa_area_grado eag on p.id_etapa_area_grado = eag.id and eag.estado = 'ACTIVO'
         inner join etapa e on eag.id_etapa = e.id
         where
         p.estado = 'APROBADO'
         ${filtros}
         group by d2.id, p.id
         order by cantidad desc
         ;
    `;
    if (!idDepartamento && !idDistrito) {
      query = `
         select
         'NACIONAL' departamento, p.texto_pregunta pregunta, p.imagen_pregunta imagen, count(p.id) cantidad,
         sum(case when eed.puntaje > 0 then 1  else 0 end) correcto
         from pregunta p 
         inner join estudiante_examen_detalle eed on p.id = eed.id_pregunta and eed.estado = 'FINALIZADO'
         inner join estudiante_examen ee on eed.id_estudiante_examen = ee.id and (ee.estado = 'FINALIZADO' or ee.estado = 'TIMEOUT')
         inner join inscripcion i on ee.id_inscripcion = i.id and i.estado = 'ACTIVO'
         inner join unidad_educativa ue on i.id_unidad_educativa = ue.id and ue.estado = 'ACTIVO'
         inner join distrito d on ue.id_distrito = d.id and d.estado = 'ACTIVO'
         inner join departamento d2 on d.id_departamento = d2.id
         inner join etapa_area_grado eag on p.id_etapa_area_grado = eag.id and eag.estado = 'ACTIVO'
         inner join etapa e on eag.id_etapa = e.id
         where
         p.estado = 'APROBADO'
         ${filtrosNacional}
         group by p.id
         order by cantidad desc
      `;
    }
    const manager = getManager();
    return manager.query(query);
  }

  async obtenerClasificados(reporteQueryDto: ReporteQueryDto) {
    const filtros = this.getFilters(reporteQueryDto);
    const query = `
      SELECT t.nombre_departamento departamento, t.habilitados, t.clasificados,
        round((t.clasificados::numeric / t.habilitados::numeric) * 100) "porcentajeClasificados"
      FROM (
        (SELECT 
        nombre_departamento,
        count(*) habilitados,
        sum(case when clasificado = 'SI' then 1 else 0 end) clasificados
        FROM v_resultados
        WHERE id is not null ${filtros}
        GROUP BY nombre_departamento)
        UNION ALL
        (SELECT 
        'Nacional',
        count(*) habilitados,
        sum(case when clasificado = 'SI' then 1 else 0 end) clasificados
        FROM v_resultados
        WHERE id is not null ${filtros})
      ) t
      ;`;
    const manager = getManager();
    return manager.query(query);
  }

  async obtenerPreguntasAreaGrado(reporteQueryDto: ReporteQueryDto) {
    const {
      idOlimpiada,
      idEtapa,
      idArea,
      idDistrito,
      idDepartamento,
      idGradoEscolar,
    } = reporteQueryDto;
    let queryOlimpiada = '';
    if (idOlimpiada) {
      queryOlimpiada = ` and e.id_olimpiada = '${idOlimpiada}'`;
    }
    let queryEtapa = '';
    if (idEtapa) {
      queryEtapa = ` and e.id = '${idEtapa}'`;
    }
    let queryArea = '';
    if (idArea) {
      queryArea = ` and eag.id_area = '${idArea}'`;
    }
    let queryDistrito = '';
    if (idDistrito) {
      queryDistrito = ` and d.id = '${idDistrito}'`;
    }
    let queryDepartamento = '';
    if (idDepartamento) {
      queryDepartamento = ` and d2.id = '${idDepartamento}'`;
    }
    let queryGradoEscolaridad = '';
    if (idGradoEscolar) {
      queryGradoEscolaridad = ` and eag.id_grado_escolar = '${idGradoEscolar}'`;
    }
    const filtros = `${queryOlimpiada} ${queryEtapa} ${queryArea} ${queryDepartamento} ${queryDistrito} ${queryGradoEscolaridad}`;

    const query = `
         select
         d2.nombre departamento,
         e.nombre etapa,
         a.nombre area,
         ge.nombre grado_escolaridad,
         p.texto_pregunta pregunta,
         p.imagen_pregunta imagen,
         count(*) cantidad,
         sum(case when eed.puntaje > 0 then 1  else 0 end) correcto
         from pregunta p
         inner join etapa_area_grado eag on p.id_etapa_area_grado = eag.id
         inner join area a on eag.id_area = a.id
         inner join grado_escolaridad ge on eag.id_grado_escolar = ge.id
         inner join etapa e on eag.id_etapa = e.id
         inner join inscripcion i on eag.id = i.id_etapa_area_grado
         inner join unidad_educativa ue on i.id_unidad_educativa = ue.id
         inner join distrito d on ue.id_distrito = d.id
         inner join departamento d2 on d.id_departamento = d2.id
         inner join estudiante_examen_detalle eed on p.id = eed.id_pregunta
         where d2.id is not null
         ${filtros}
         group by d2.id, e.id, a.id, ge.id, p.id order by d2.id, e.id asc;

    `;
    const manager = getManager();
    return manager.query(query);
  }

  async obtenerMedallerosArea(
    reporteQueryDto: ReporteQueryDto,
    idDepartamento?: string,
  ) {
    const filtros = this.getFilters(reporteQueryDto);
    const where = idDepartamento
      ? `and id_departamento = '${idDepartamento}'`
      : '';
    const query = `
      select count(*) as total, sub_grupo_medallero , nombre_area ,
      sum(case when genero = 'M' then 1 else 0 end) as masculino,
      sum(case when genero = 'F' then 1 else 0 end) as femenino,
      sum(case when tipo_unidad_educativa = 'FISCAL' then 1 else 0 end) as fiscal,
      sum(case when tipo_unidad_educativa = 'PRIVADA' then 1 else 0 end) as privada,
      sum(case when tipo_unidad_educativa = 'CONVENIO' then 1 else 0 end) as convenio,
      sum(case when area_geografica = 'URBANO' then 1 else 0 end) as urbano,
      sum(case when area_geografica = 'RURAL' then 1 else 0 end) as rural
      from v_resultados vr
      where
      medallero = 'SI'
      ${where}
      ${filtros}
      group by nombre_area , sub_grupo_medallero
      -- orden_galardon_medallero
      -- order by orden_galardon_medallero
    `;
    const manager = getManager();
    return manager.query(query);
  }
}
