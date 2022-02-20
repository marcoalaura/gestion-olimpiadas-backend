import LOGO2020 from 'src/application/olimpiada/templates_carbon/logo2020';
import { Status } from 'src/common/constants';
import { TextService } from 'src/common/lib/text.service';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { Olimpiada } from '../../src/application/olimpiada/entity/Olimpiada.entity';

export class olimpiada1611516017920 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        nombre: 'Administración',
        sigla: 'MINEDU',
        gestion: 2021,
        fechaInicio: new Date('2021-01-02'),
        fechaFin: new Date('2021-01-02'),
        fechaCreacion: new Date(),
        usuarioCreacion: '1',
        leyenda: '-',
        estado: Status.CLOSED,
        logo: LOGO2020,
      },
    ];
    const olimpiadas = items.map((item) => {
      const o = new Olimpiada();
      o.id = TextService.textToUuid(item.sigla);
      o.nombre = item.nombre;
      o.gestion = item.gestion;
      o.sigla = item.sigla;
      o.fechaInicio = item.fechaInicio;
      o.fechaFin = item.fechaFin;
      o.fechaCreacion = item.fechaCreacion;
      o.usuarioCreacion = item.usuarioCreacion;
      o.leyenda = item.leyenda;
      o.logo = item.logo;
      o.estado = item.estado;
      return o;
    });
    await queryRunner.manager.save(olimpiadas);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}

}
