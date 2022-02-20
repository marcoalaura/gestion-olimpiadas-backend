import { MigrationInterface, QueryRunner } from 'typeorm';
import { UnidadEducativa } from '../../src/application/olimpiada/entity/UnidadEducativa.entity';
import { Distrito } from '../../src/application/olimpiada/entity/Distrito.entity';
import {
  tiposAreasGeograficas,
  tiposUnidadesEducativas,
} from '../../src/common/constants';

export class unidadEducativa1618546510523 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        id: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        codigo_sie: 80730390,
        nombre: 'ROSA GATTORNO',
        tipo_unidad_educativa: tiposUnidadesEducativas.PRIVADA,
        area_geografica: tiposAreasGeograficas.URBANO,
        seccion: 'CAPITAL (LA PAZ)',
        localidad: 'LA PAZ - CIUDAD LA PAZ',
        id_distrito: '2310b8e7-aab4-4320-a3f9-4361dc95750a',
      },
      {
        id: 'd277ed90-d730-583b-bb24-aca999f2edcb',
        codigo_sie: 70620007,
        nombre: 'LOS ANDES',
        tipo_unidad_educativa: tiposUnidadesEducativas.FISCAL,
        area_geografica: tiposAreasGeograficas.RURAL,
        seccion: 'SEGUNDA SECCIÓN (LAJA)',
        localidad: 'COMUNIDAD SANTA ROSA - COMUNIDAD SANTA ROSA ALTA',
        id_distrito: '4049f17f-9760-42c7-bee9-7afb3f0865ae',
      },
      {
        id: '32b79fa5-aaba-5f11-99ad-1545e60a3eda',
        codigo_sie: 81970093,
        nombre: 'JESUS Y MARIA SCHOOL',
        tipo_unidad_educativa: tiposUnidadesEducativas.PRIVADA,
        area_geografica: tiposAreasGeograficas.URBANO,
        seccion: 'PRIMERA SECCIÓN (WARNES)',
        localidad: 'WARNES - CIUDAD WARNES',
        id_distrito: 'd4f35a56-a812-44dd-8ca7-f6b6899fda14',
      },
      {
        id: '81fa846c-8fd7-4f28-8bf2-f280928cd487',
        codigo_sie: 81970007,
        nombre: 'IGNACIO WARNES',
        tipo_unidad_educativa: tiposUnidadesEducativas.FISCAL,
        area_geografica: tiposAreasGeograficas.URBANO,
        seccion: 'PRIMERA SECCIÓN (WARNES)',
        localidad: 'WARNES - CIUDAD WARNES',
        id_distrito: 'd4f35a56-a812-44dd-8ca7-f6b6899fda14',
      },
      {
        id: '514f8edd-f1f5-4faa-b57c-b8b805eb6af0',
        codigo_sie: 81971001,
        nombre: 'UNIDAD EDUCATIVA SAN SIMON',
        tipo_unidad_educativa: tiposUnidadesEducativas.FISCAL,
        area_geografica: tiposAreasGeograficas.URBANO,
        seccion: 'PRIMERA SECCIÓN (SAN SIMON)',
        localidad: 'SAN SIMON - CIUDAD CBBA',
        id_distrito: 'fa66a92f-299d-441b-a671-d927d6d2a44b',
      },
      {
        id: '39f44e02-1b7c-4e72-b183-877ce351afe2',
        codigo_sie: 81971002,
        nombre: 'UNIDAD EDUCATIVA SAN BORJA',
        tipo_unidad_educativa: tiposUnidadesEducativas.FISCAL,
        area_geografica: tiposAreasGeograficas.URBANO,
        seccion: 'PRIMERA SECCIÓN (SAN BORJA)',
        localidad: 'SAN BORJA - CIUDAD SAN BORJA',
        id_distrito: '533d98c4-32a5-4f2d-ba02-c7ccfe2ef56b',
      },
      {
        id: '876fdf56-1eb7-4d46-9cb8-54f4fbde5e0c',
        codigo_sie: 81971003,
        nombre: 'UNIDAD EDUCATIVA VINEDO',
        tipo_unidad_educativa: tiposUnidadesEducativas.FISCAL,
        area_geografica: tiposAreasGeograficas.URBANO,
        seccion: 'PRIMERA SECCIÓN (VINEDO)',
        localidad: 'VINEDO - CIUDAD TARIJA',
        id_distrito: 'b24c8ce1-fdd0-46dd-955a-e7a998a2d86a',
      },
      {
        id: '3a753d6f-8206-4a1b-ac40-03f7d6e31e26',
        codigo_sie: 81971004,
        nombre: 'CASA DE LA MONEDA',
        tipo_unidad_educativa: tiposUnidadesEducativas.FISCAL,
        area_geografica: tiposAreasGeograficas.URBANO,
        seccion: 'PRIMERA SECCIÓN (POTOSI)',
        localidad: 'POTOSI - CIUDAD POTOSI',
        id_distrito: '57544c03-ecee-4597-8b8f-e1aa93c4787d',
      },
      {
        id: 'e0988dcd-7f9e-402d-b4f3-8fa640fa31fa',
        codigo_sie: 81971005,
        nombre: 'UNIDAD EDUCATIVA MINERA',
        tipo_unidad_educativa: tiposUnidadesEducativas.FISCAL,
        area_geografica: tiposAreasGeograficas.URBANO,
        seccion: 'PRIMERA SECCIÓN (MINERA)',
        localidad: 'MINERA - CIUDAD ORURO',
        id_distrito: '1716b255-196e-4eb5-b828-b4987d757332',
      },
      {
        id: '23f0edab-8d89-4d72-8631-99a042df22cc',
        codigo_sie: 81971006,
        nombre: 'UNIDAD EDUCATIVA SUCRE',
        tipo_unidad_educativa: tiposUnidadesEducativas.FISCAL,
        area_geografica: tiposAreasGeograficas.URBANO,
        seccion: 'PRIMERA SECCIÓN (SUCRE)',
        localidad: 'SUCRE - CIUDAD SUCRE',
        id_distrito: '87e8b6d2-eb32-43ed-9f24-c6df798fb037',
      },
      {
        id: 'b6f2f9ed-c055-4988-8e47-c431441c509b',
        codigo_sie: 81971007,
        nombre: 'UNIDAD EDUCATIVA PANDO',
        tipo_unidad_educativa: tiposUnidadesEducativas.FISCAL,
        area_geografica: tiposAreasGeograficas.URBANO,
        seccion: 'PRIMERA SECCIÓN (PANDO)',
        localidad: 'PANDO - CIUDAD PANDO',
        id_distrito: 'f8fb9c58-83fe-46e5-a998-26ec4bc397c3',
      },
      {
        id: 'cfa68b01-20ab-4950-a785-ac3fc5529cce',
        codigo_sie: 81971008,
        nombre: 'UNIDAD EDUCATIVA QUILLACOLLO',
        tipo_unidad_educativa: tiposUnidadesEducativas.PRIVADA,
        area_geografica: tiposAreasGeograficas.URBANO,
        seccion: 'PRIMERA SECCIÓN (QUILLACOLLO)',
        localidad: 'QUILLACOLLO - CIUDAD QUILLACOLLO',
        id_distrito: 'fa66a92f-299d-441b-a671-d927d6d2a44b',
      },
      {
        id: '26162cbf-bc53-4e2b-b338-d486fe91b92c',
        codigo_sie: 81971009,
        nombre: 'UNIDAD EDUCATIVA MONTERO',
        tipo_unidad_educativa: tiposUnidadesEducativas.FISCAL,
        area_geografica: tiposAreasGeograficas.URBANO,
        seccion: 'PRIMERA SECCIÓN (MONTERO)',
        localidad: 'MONTERO - CIUDAD MONTERO',
        id_distrito: 'a568abb5-8dfe-4229-b7dc-29699cb1b220',
      },
      
    ];
    const data = items.map((item) => {
      const d = new Distrito();
      d.id = item.id_distrito;
      const e = new UnidadEducativa();
      e.id = item.id;
      e.nombre = item.nombre;
      e.codigoSie = item.codigo_sie;
      e.tipoUnidadEducativa = item.tipo_unidad_educativa;
      e.areaGeografica = item.area_geografica;
      e.seccion = item.seccion;
      e.localidad = item.localidad;
      e.distrito = d;
      e.fechaCreacion = new Date();
      e.usuarioCreacion = '1';
      return e;
    });
    await queryRunner.manager.save(data);
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
