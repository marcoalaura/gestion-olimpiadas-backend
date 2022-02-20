import { MigrationInterface, QueryRunner } from 'typeorm';
import { MedalleroPosicion } from '../../src/application/olimpiada/entity/MedalleroPosicion.entity';
import { EtapaAreaGrado } from '../../src/application/olimpiada/entity/EtapaAreaGrado.entity';

export class medalleroPosicion1618588591190 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        id: 'e6a8063a-0156-43b5-be67-5c921fa4aee3',
        ordenGalardon: 1,
        subGrupo: 'ORO',
        denominativo: 'ORO 1',
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: '5d2cd72d-1c79-45db-a3a7-d22b46fc60c7',
        ordenGalardon: 2,
        subGrupo: 'ORO',
        denominativo: 'ORO 2',
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: '7dacfb73-6dbf-4f18-a173-da671cb62935',
        ordenGalardon: 3,
        subGrupo: 'PLATA',
        denominativo: 'PLATA',
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: 'd394f1b6-81e1-40b6-be26-f0b7508b91ec',
        ordenGalardon: 1,
        subGrupo: 'ORO',
        denominativo: 'PRIMERO',
        id_etapa_area_grado: '793e2227-770d-5692-8852-d9efdcc6a4d7',
      },
      {
        id: '1b727112-6fef-4832-bbfb-cf8a92b58c28',
        ordenGalardon: 2,
        subGrupo: 'ORO',
        denominativo: 'SEGUNDO',
        id_etapa_area_grado: '793e2227-770d-5692-8852-d9efdcc6a4d7',
      },
      {
        id: '1b727112-6fef-4832-bbfb-cf8a92b58c29',
        ordenGalardon: 3,
        subGrupo: 'PLATA',
        denominativo: 'TERCERO',
        id_etapa_area_grado: '793e2227-770d-5692-8852-d9efdcc6a4d7',
      },
      {
        id: '7a1a8f51-b8af-41c9-97b1-7baffbf01d60',
        ordenGalardon: 1,
        subGrupo: 'GANADOR',
        denominativo: 'GANADOR',
        id_etapa_area_grado: '2bc7bbdd-c62d-51d1-88c2-9a91bbd5b231',
      },
      {
        id: '6a5862f8-d8e9-11eb-b8bc-0242ac130003',
        ordenGalardon: 1,
        subGrupo: 'ORO',
        denominativo: 'ORO',
        id_etapa_area_grado: 'bf57d2c4-d8e5-11eb-b8bc-0242ac130003',
      },
      {
        id: '725e904e-d8e9-11eb-b8bc-0242ac130003',
        ordenGalardon: 2,
        subGrupo: 'PLATA',
        denominativo: 'PLATA',
        id_etapa_area_grado: 'bf57d2c4-d8e5-11eb-b8bc-0242ac130003',
      },
      {
        id: '07a6a19c-f958-499d-9b00-937f3700eeb8',
        ordenGalardon: 1,
        subGrupo: 'BRONCE',
        denominativo: 'BRONCE',
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b7',
      },
      {
        id: '22e2f067-2fe6-42b6-9d26-a4b7291f6e4d',
        ordenGalardon: 1,
        subGrupo: 'PLATINO',
        denominativo: 'PLATINO',
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b8',
      },
      {
        id: '123fd6cb-5b19-421c-af3a-d2e8413e7b12',
        ordenGalardon: 1,
        subGrupo: 'PRIMERO',
        denominativo: 'PRIMERO',
        id_etapa_area_grado: '123fd6cb-5b19-421c-af3a-d2e8413e7b12',
      },
      {
        id: '234fd6cb-5b19-421c-af3a-d2e8413e7b12',
        ordenGalardon: 2,
        subGrupo: 'SEGUNDO',
        denominativo: 'SEGUNDO',
        id_etapa_area_grado: '123fd6cb-5b19-421c-af3a-d2e8413e7b12',
      },
      {
        id: '345fd6cb-5b19-421c-af3a-d2e8413e7b12',
        ordenGalardon: 3,
        subGrupo: 'TERCERO',
        denominativo: 'TERCERO',
        id_etapa_area_grado: '123fd6cb-5b19-421c-af3a-d2e8413e7b12',
      },
      {
        id: '456fd6cb-5b19-421c-af3a-d2e8413e7b12',
        ordenGalardon: 4,
        subGrupo: 'CUARTO',
        denominativo: 'CUARTO',
        id_etapa_area_grado: '123fd6cb-5b19-421c-af3a-d2e8413e7b12',
      },
      {
        id: '567fd6cb-5b19-421c-af3a-d2e8413e7b12',
        ordenGalardon: 5,
        subGrupo: 'QUINTO',
        denominativo: 'QUINTO',
        id_etapa_area_grado: '123fd6cb-5b19-421c-af3a-d2e8413e7b12',
      },

      {
        id: '93646460-b888-4817-b001-5103af3b36f1',
        ordenGalardon: 1,
        subGrupo: 'ORO',
        denominativo: 'ORO',
        id_etapa_area_grado: '0734d1c0-3760-441e-b3bb-783ee9c7ee7c',
      },
      {
        id: '028b7057-f5e2-4ee3-9429-a5e9041897db',
        ordenGalardon: 2,
        subGrupo: 'PLATA',
        denominativo: 'PLATA',
        id_etapa_area_grado: '0734d1c0-3760-441e-b3bb-783ee9c7ee7c',
      },
      {
        id: '05eca3fa-28f3-494b-bd13-5caae3df60f8',
        ordenGalardon: 1,
        subGrupo: 'PRIMER',
        denominativo: 'PRIMER',
        id_etapa_area_grado: '007a50d0-4334-4423-b77f-2ce5d26b4bda',
      },
      {
        id: '4ba91924-1ec9-4a54-8e3d-0464a2137b8b',
        ordenGalardon: 2,
        subGrupo: 'SEGUNDO',
        denominativo: 'SEGUNDO',
        id_etapa_area_grado: '007a50d0-4334-4423-b77f-2ce5d26b4bda',
      },
      {
        id: '17eb57eb-8638-4330-95a7-9ff0ce147e9a',
        ordenGalardon: 1,
        subGrupo: 'FIRST',
        denominativo: 'FIRST',
        id_etapa_area_grado: 'c6fcdfc1-a587-4b76-a892-bd241ee914fd',
      },
      {
        id: '8b616c41-2969-4c4c-9a79-7033babd1380',
        ordenGalardon: 2,
        subGrupo: 'SECOND',
        denominativo: 'SECOND',
        id_etapa_area_grado: 'c6fcdfc1-a587-4b76-a892-bd241ee914fd',
      },
    ];
    const data = items.map((item) => {
      const e = new EtapaAreaGrado();
      e.id = item.id_etapa_area_grado;
      const m = new MedalleroPosicion();
      m.id = item.id;
      m.ordenGalardon = item.ordenGalardon;
      m.subGrupo = item.subGrupo;
      m.denominativo = item.denominativo;
      m.etapaAreaGrado = e;
      m.usuarioCreacion = '1';
      return m;
    });
    await queryRunner.manager.save(data);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
