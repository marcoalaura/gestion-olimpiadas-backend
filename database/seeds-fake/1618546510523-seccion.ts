import { MigrationInterface, QueryRunner } from 'typeorm';
import { Seccion } from '../../src/application/olimpiada/entity/Seccion.entity';

export class seccion1618546510523 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      'PRIMERA SECCIÓN (SAN IGNACIO)',
      'TERCERA SECCIÓN (VILLA TUNARI)',
      'SEXTA SECCIÓN (CAMIRI)',
      'CAPITAL (SANTA CRUZ DE LA SIERRA)',
      'SEGUNDA SECCIÓN (OKINAWA UNO)',
      'QUINTA SECCIÓN (GUTIÉRREZ)',
      'PRIMERA SECCIÓN (BUENA VISTA)',
      'TERCERA SECCIÓN (YAPACANÍ)',
      'SEGUNDA SECCIÓN (PAILÓN)',
      'TERCERA SECCIÓN (CABEZAS)',
      'PRIMERA SECCIÓN (WARNES)',
      'LA PAZ - CIUDAD LA PAZ',
      'VIACHA - CIUDAD VIACHA',
      'COMUNIDAD SANTA ROSA - COMUNIDAD SANTA ROSA ALTA',
      'ANTAQUIRA',
      'COMUNIDAD COLCHANI',
      'CAPITAL (LA PAZ)',
      'SEGUNDA SECCIÓN (LAJA)',
    ];
    const data = items.map((item) => {
      const se = new Seccion();
      se.nombre = item;
      se.usuarioCreacion = '1';
      return se;
    });
    await queryRunner.manager.save(data);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}

