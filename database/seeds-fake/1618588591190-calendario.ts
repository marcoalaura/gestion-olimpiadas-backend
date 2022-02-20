import { MigrationInterface, QueryRunner } from 'typeorm';
import { Calendario } from '../../src/application/olimpiada/entity/Calendario.entity';
import { EtapaAreaGrado } from '../../src/application/olimpiada/entity/EtapaAreaGrado.entity';
import { TipoPlanificacion } from '../../src/common/constants';
export class calendario1618588591190 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        id: '19b07dd5-07b2-4622-b721-177b2a4f7c8e',
        tipoPrueba: 'ONLINE',
        TipoPlanificacion: TipoPlanificacion.CRONOGRAMA,
        fechaHoraInicio: new Date('2021-04-14 08:00:00'),
        fechaHoraFin: new Date('2021-04-14 09:00:00'),
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: '0a55e851-622e-4465-8d72-c7ba2cf79c79',
        tipoPrueba: 'OFFLINE',
        TipoPlanificacion: TipoPlanificacion.CRONOGRAMA,
        fechaHoraInicio: new Date('2021-04-14 08:00:00'),
        fechaHoraFin: new Date('2021-07-14 09:00:00'),
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: '7eba1568-ffc6-49e8-9926-dbd0ef1346c4',
        tipoPrueba: 'ONLINE',
        TipoPlanificacion: TipoPlanificacion.CRONOGRAMA,
        fechaHoraInicio: new Date('2021-04-15 12:00:00'),
        fechaHoraFin: new Date('2021-04-15 13:30:00'),
        id_etapa_area_grado: '793e2227-770d-5692-8852-d9efdcc6a4d7',
      },
      {
        id: '5bdfbb6c-f7c5-4516-83e1-dd5b690c4bdb',
        tipoPrueba: 'OFFLINE',
        TipoPlanificacion: TipoPlanificacion.CRONOGRAMA,
        fechaHoraInicio: new Date('2021-04-16 16:00:00'),
        fechaHoraFin: new Date('2021-04-16 18:00:00'),
        id_etapa_area_grado: '2bc7bbdd-c62d-51d1-88c2-9a91bbd5b231',
      },
      {
        id: '519be091-cc5a-4c6d-a3cb-3318fea6c18f',
        tipoPrueba: 'ONLINE',
        TipoPlanificacion: TipoPlanificacion.CRONOGRAMA,
        fechaHoraInicio: new Date('2021-04-14 08:00:00'),
        fechaHoraFin: new Date('2021-04-14 09:00:00'),
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b7',
      },
      {
        id: '356e79c8-f9e7-49f3-84b2-acc58c709c1b',
        tipoPrueba: 'ONLINE',
        TipoPlanificacion: TipoPlanificacion.CRONOGRAMA,
        fechaHoraInicio: new Date('2021-04-14 08:00:00'),
        fechaHoraFin: new Date('2021-04-14 09:00:00'),
        id_etapa_area_grado: 'c9930379-5dc1-556f-847c-802dd9d1d9b8',
      },
    ];
    const data = items.map((item) => {
      const e = new EtapaAreaGrado();
      e.id = item.id_etapa_area_grado;
      const c = new Calendario();
      c.id = item.id;
      c.tipoPrueba = item.tipoPrueba;
      c.tipoPlanificacion = item.TipoPlanificacion;
      c.fechaHoraInicio = item.fechaHoraInicio;
      c.fechaHoraFin = item.fechaHoraFin;
      c.etapaAreaGrado = e;
      c.usuarioCreacion = 'seeders';
      return c;
    });
    await queryRunner.manager.save(data);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
