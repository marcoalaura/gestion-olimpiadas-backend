import { MigrationInterface, QueryRunner } from 'typeorm';
import { Localidad } from '../../src/application/olimpiada/entity/Localidad.entity';

export class localidad1618546510523 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      'SAN IGNACIO (RANCHO SANTA CLARA) - SAN IGNACIO',
      'ETERAZAMA',
      'CAMIRI - CIUDAD CAMIRI',
      'SANTA CRUZ - CIUDAD SANTA CRUZ',
      'OKINAWA 1',
      'COMUNIDAD IPATIMIRI (CAPITANIA DEL GRAN KAIPIPENDI - COMUNIDAD IPATIMIRI',
      'COMUNIDAD SAN ISIDRO',
      'COMUNIDAD SAN GERMAN - SAN GERMAN',
      'PAILON',
      'ZANJA HONDA',
      'WARNES - CIUDAD WARNES',
      'COMUNIDAD POTRERO LARGO - POTRERO LARGO',
      'LA PAZ - CIUDAD LA PAZ',
      'COMUNIDAD SANTA ROSA - COMUNIDAD SANTA ROSA ALTA',
    ];
    const data = items.map((item) => {
      const lo = new Localidad();
      lo.nombre = item;
      lo.usuarioCreacion = '1';
      return lo;
    });
    await queryRunner.manager.save(data);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}

