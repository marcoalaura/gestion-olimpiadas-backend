import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import {
  EntityRepository,
  getManager,
  getRepository,
  Repository,
} from 'typeorm';
import { ExamenOffline } from '../entity/ExamenOffline.entity';

@EntityRepository(ExamenOffline)
export class ExamenOfflineRepository extends Repository<ExamenOffline> {
  async buscarOlimpiadaUnidadEducativaEtapa(
    idOlimpiada,
    idUnidadEducativa,
    idEtapa,
  ) {
    return getRepository(ExamenOffline)
      .createQueryBuilder('descarga')
      .select([
        'descarga.id AS id',
        'descarga.estado AS estado',
        'descarga.datos AS datos',
      ])
      .where('descarga.idOlimpiada = :idOlimpiada', { idOlimpiada })
      .andWhere('descarga.idUnidadEducativa = :idUnidadEducativa', {
        idUnidadEducativa,
      })
      .andWhere('descarga.idEtapa = :idEtapa', {
        idEtapa,
      })
      .andWhere('descarga.cantidad = 0')
      .andWhere(`descarga.estado IN ('CREADO','PROCESANDO','FINALIZADO')`)
      .orderBy('descarga.fechaCreacion', 'DESC')
      .getRawOne();
  }

  async listarPorOlimpiadaUnidadEducativa(
    idOlimpiada,
    idEtapa,
    idUnidadEducativa,
    paginacionQueryDto: PaginacionQueryDto,
  ) {
    const { limite, saltar } = paginacionQueryDto;

    return getRepository(ExamenOffline)
      .createQueryBuilder('descarga')
      .select(['descarga.id', 'descarga.estado', 'descarga.datos'])
      .where('descarga.idOlimpiada = :idOlimpiada', { idOlimpiada })
      .where("descarga.estado != 'ERROR'")
      .andWhere('descarga.idUnidadEducativa = :idUnidadEducativa', {
        idUnidadEducativa,
      })
      .andWhere('descarga.idEtapa = :idEtapa', {
        idEtapa,
      })
      .orderBy('descarga.fechaCreacion', 'DESC')
      .skip(saltar)
      .take(limite)
      .getManyAndCount();
  }

  async obtenerPorId(idOlimpiada, idUnidadEducativa, id) {
    return getRepository(ExamenOffline)
      .createQueryBuilder('descarga')
      .select([
        'descarga.id',
        'descarga.estado',
        'descarga.datos',
        'descarga.ruta',
        'descarga.cantidad',
      ])
      .where('descarga.idOlimpiada = :idOlimpiada', { idOlimpiada })
      .andWhere('descarga.idUnidadEducativa = :idUnidadEducativa', {
        idUnidadEducativa,
      })
      .andWhere('descarga.id = :id', { id })
      .getOne();
  }

  async listarCargadosPorOlimpiadaUnidadEducativa(
    // idOlimpiada,
    idUnidadEducativa,
    paginacionQueryDto: PaginacionQueryDto,
  ) {
    const { limite, saltar } = paginacionQueryDto;

    return (
      getRepository(ExamenOffline)
        .createQueryBuilder('cargados')
        .select(['cargados.id', 'cargados.estado', 'cargados.datos'])
        .where(`cargados.estado IN ('PENDIENTE', 'CARGADO')`)
        // .andWhere('cargados.idOlimpiada = :idOlimpiada', { idOlimpiada })
        .andWhere('cargados.idUnidadEducativa = :idUnidadEducativa', {
          idUnidadEducativa,
        })
        .orderBy('cargados.fechaCreacion', 'DESC')
        .skip(saltar)
        .take(limite)
        .getManyAndCount()
    );
  }

  async obtenerResultadoPruebaSegunCronograma(
    idOlimpiada: string,
    idEtapa: string,
  ) {
    const manager = getManager();
    const rawData = await manager.query(
      `
      SELECT t2.*
      FROM departamento dep
      INNER JOIN (
        SELECT t.*
        FROM area a
        INNER JOIN (
          SELECT
            ee.id AS id_estudiante_examen, ee.estado,
            ee.tipo_prueba, a.nombre AS area,
            a.id AS id_area,
            d.id_departamento AS id_departamento,
            i.id AS id_inscripcion,
            dep.nombre AS departamento
          FROM estudiante_examen ee
          INNER JOIN inscripcion i ON i.id = ee.id_inscripcion
          INNER JOIN etapa_area_grado eag ON eag.id = i.id_etapa_area_grado
          INNER JOIN etapa e on e.id = eag.id_etapa
          INNER JOIN area a ON a.id= eag.id_area
          INNER JOIN unidad_educativa ue ON ue.id = i.id_unidad_educativa
          INNER JOIN distrito d ON d.id = ue.id_distrito
          INNER JOIN departamento dep ON dep.id = d.id_departamento
          AND e.id_olimpiada = $1
          AND e.id = $2
        ) AS t ON t.id_area = a.id
        WHERE a.id = t.id_area
      ) AS t2 ON t2.id_departamento = dep.id
      WHERE dep.id = t2.id_departamento
      ORDER BY dep.nombre ASC, t2.area ASC;
    `,
      [idOlimpiada, idEtapa],
    );

    const departmentos = await manager.query(
      'SELECT id, nombre FROM departamento order by nombre',
    );

    const columnas = departmentos.map((row) => row.nombre);

    const areas: any = {};
    rawData.forEach(
      (row) => (areas[row.area] = { area: row.area, id_area: row.id_area }),
    );

    const filas = Object.keys(areas).map((key) => {
      const resultado: any = {};
      departmentos.forEach((dep) => {
        const rawDataAgrupado = rawData.filter(
          (row) =>
            row.id_area === areas[key].id_area &&
            row.id_departamento === dep.id,
        );

        const examenesOnline: any = {};
        const examenesOffline: any = {};
        rawDataAgrupado.forEach((row) => {
          const ins = row.id_inscripcion;
          const tipoPrueba = row.tipo_prueba;
          if (tipoPrueba === 'ONLINE') examenesOnline[ins] = row;
          if (tipoPrueba === 'OFFLINE') examenesOffline[ins] = row;
        });

        const totalOnline = Object.keys(examenesOnline).length;
        const online = rawDataAgrupado.filter(
          (row) =>
            row.tipo_prueba === 'ONLINE' &&
            ['FINALIZADO', 'TIMEOUT'].includes(row.estado),
        ).length;

        const totalOffline = Object.keys(examenesOffline).length;
        const offline = rawDataAgrupado.filter(
          (row) =>
            row.tipo_prueba === 'OFFLINE' &&
            ['FINALIZADO', 'TIMEOUT'].includes(row.estado),
        ).length;

        const onlinePorcentaje =
          totalOnline > 0 ? (100 * online) / totalOnline : 0;
        const offlinePorcentaje =
          totalOffline > 0 ? (100 * offline) / totalOffline : 0;
        resultado[dep.nombre] = {
          online: Math.round(onlinePorcentaje * 100) / 100,
          offline: Math.round(offlinePorcentaje * 100) / 100,
        };
      });

      return {
        area: areas[key].area,
        resultado,
      };
    });

    const result = { columnas, filas };
    return result;
  }
}
