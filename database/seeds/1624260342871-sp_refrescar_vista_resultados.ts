import { MigrationInterface, QueryRunner } from 'typeorm';

export class sp_refrescar_vista_resultados1624260342871 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION sp_refrescar_vista_resultados()
      RETURNS text
        LANGUAGE plpgsql
      AS $function$
      BEGIN
        REFRESH MATERIALIZED VIEW v_resultados;
        RETURN 'Ok';
      END
      $function$;
    `);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
