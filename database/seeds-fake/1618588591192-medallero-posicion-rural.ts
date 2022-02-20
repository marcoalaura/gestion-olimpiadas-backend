import { MigrationInterface, QueryRunner } from 'typeorm';
import { EtapaAreaGrado } from '../../src/application/olimpiada/entity/EtapaAreaGrado.entity';
import { MedalleroPosicionRural } from 'src/application/olimpiada/entity/MedalleroPosicionRural.entity';

export class medalleroPosicionRural1618588591192 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        id: 'e6a8063a-0156-43b5-be67-5c921fa4aee3',
        orden: 1,
        posicionMaxima: 2,
        posicionMinima: 3,
        notaMinima: 51,
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: 'd394f1b6-81e1-40b6-be26-f0b7508b91ec',
        orden: 1,
        posicionMaxima: 1,
        posicionMinima: 1,
        notaMinima: 51,
        id_etapa_area_grado: '793e2227-770d-5692-8852-d9efdcc6a4d7',
      },
      {
        id: '1b727112-6fef-4832-bbfb-cf8a92b58c28',
        orden: 2,
        posicionMaxima: 3,
        posicionMinima: 3,
        notaMinima: 51,
        id_etapa_area_grado: '793e2227-770d-5692-8852-d9efdcc6a4d7',
      },
      {
        id: '7a1a8f51-b8af-41c9-97b1-7baffbf01d60',
        orden: 1,
        posicionMaxima: 1,
        posicionMinima: 1,
        notaMinima: 80,
        id_etapa_area_grado: '2bc7bbdd-c62d-51d1-88c2-9a91bbd5b231',
      },
      {
        id: '123fd6cb-5b19-421c-af3a-d2e8413e7b12',
        orden: 1,
        posicionMaxima: 2,
        posicionMinima: 3,
        notaMinima: 51,
        id_etapa_area_grado: '123fd6cb-5b19-421c-af3a-d2e8413e7b12',
      },
    ];
    const data = items.map((item) => {
      const e = new EtapaAreaGrado();
      e.id = item.id_etapa_area_grado;
      const m = new MedalleroPosicionRural();
      m.id = item.id;
      m.orden = item.orden;
      m.posicionMaxima = item.posicionMaxima;
      m.posicionMinima = item.posicionMinima;
      m.notaMinima = item.notaMinima;
      m.etapaAreaGrado = e;
      m.usuarioCreacion = '1';
      return m;
    });
    await queryRunner.manager.save(data);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
