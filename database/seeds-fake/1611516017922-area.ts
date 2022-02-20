import LOGO2020 from 'src/application/olimpiada/templates_carbon/logo2020';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { Area } from '../../src/application/olimpiada/entity/Area.entity';

export class area1611516017922 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        id: '0a55e851-622e-4465-8d72-c7ba2cf79c79',
        nombre: 'MATEMÁTICAS',
        logo: LOGO2020,
      },
      {
        id: 'f6b02355-e60f-4464-a1a2-52e784b1717f',
        nombre: 'FÍSICA',
        logo: LOGO2020,
      },
      {
        id: '795f761d-2764-408e-94ea-7d5020bc30ac',
        nombre: 'QUÍMICA',
        logo: LOGO2020,
      },
      {
        id: '297cd53f-d950-401d-912a-f9deb66550b9',
        nombre: 'BIOLOGÍA',
        logo: LOGO2020,
      },
      {
        id: '52720f8a-2c0d-49fe-beaf-811dc6b08e6b',
        nombre: 'GEOGRAFÍA',
        logo: LOGO2020,
      },
      {
        id: '438e933d-5d84-4eb1-b27d-9b1da1af230f',
        nombre: 'ASTRONOMÍA-ASTROFÍSICA',
        logo: LOGO2020,
      },
    ];
    const data = items.map((item) => {
      const e = new Area();
      e.id = item.id;
      e.nombre = item.nombre;
      e.fechaCreacion = new Date();
      e.usuarioCreacion = '1';
      e.logo = item.logo;
      return e;
    });
    await queryRunner.manager.save(data);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
