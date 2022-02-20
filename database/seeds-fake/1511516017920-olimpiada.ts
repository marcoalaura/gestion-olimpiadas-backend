import LOGO2020 from 'src/application/olimpiada/templates_carbon/logo2020';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { Olimpiada } from '../../src/application/olimpiada/entity/Olimpiada.entity';

export class olimpiada1511516017920 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        id: '97303a51-8570-453f-9e67-1a06537c0744',
        nombre: 'Olimpiadas científicas',
        sigla: 'OCEPB',
        gestion: 2021,
        fechaInicio: new Date('2021-03-31'),
        fechaFin: new Date('2021-09-30'),
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
        leyenda: '2021 AÑO POR LA RECUPERACIÓN DEL DERECHO A LA EDUCACIÓN',
        logo: LOGO2020,
      },
      {
        id: '719e52b4-d8e1-11eb-b8bc-0242ac130003',
        nombre: 'Olimpiadas científicas 2020',
        sigla: 'OCEPB2020',
        gestion: 2020,
        fechaInicio: new Date('2020-01-01'),
        fechaFin: new Date('2021-08-30'),
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
        leyenda: '2020 AÑO POR LA RECUPERACIÓN DEL DERECHO A LA EDUCACIÓN',
        logo: LOGO2020,
      },
      {
        id: '203ea483-f326-4019-85fa-4938a3326547',
        nombre: 'Olimpiadas científicas 2020 v2',
        sigla: 'OCEPB2020v2',
        gestion: 2020,
        fechaInicio: new Date('2020-09-01'),
        fechaFin: new Date('2021-12-31'),
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
        leyenda: '2020 AÑO POR LA RECUPERACIÓN DEL DERECHO A LA EDUCACIÓN',
        logo: LOGO2020,
      },
    ];
    const olimpiadas = items.map((item) => {
      const o = new Olimpiada();
      o.id = item.id;
      o.nombre = item.nombre;
      o.gestion = item.gestion;
      o.sigla = item.sigla;
      o.fechaInicio = item.fechaInicio;
      o.fechaFin = item.fechaFin;
      o.fechaCreacion = item.fechaCreacion;
      o.usuarioCreacion = item.usuarioCreacion;
      o.leyenda = item.leyenda;
      o.logo = item.logo;
      return o;
    });
    await queryRunner.manager.save(olimpiadas);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}

}
