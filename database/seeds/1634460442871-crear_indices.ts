import { MigrationInterface, QueryRunner } from 'typeorm';

export class crear_indices1634460442871 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS estudiante_examen_id_inscripcion_idx on estudiante_examen (id_inscripcion);
      CREATE INDEX IF NOT EXISTS refresh_tokens_grant_id_idx on refresh_tokens (grant_id);

      CREATE INDEX IF NOT EXISTS pregunta_id_etapa_area_grado_idx ON public.pregunta (id_etapa_area_grado);
      CREATE INDEX IF NOT EXISTS inscripcion_id_medallero_posicion_idx ON public.inscripcion USING btree (id_medallero_posicion_automatica, id_medallero_posicion_manual);
    `);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
