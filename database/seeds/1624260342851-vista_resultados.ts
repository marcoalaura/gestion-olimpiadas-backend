import { MigrationInterface, QueryRunner } from 'typeorm';

export class vista_resultados1624260342851 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE MATERIALIZED VIEW v_resultados
    AS SELECT i.id,
        o.id AS id_olimpiada,
        o.nombre AS nombre_olimpiada,
        o.gestion,
        d.id AS id_departamento,
        d.nombre AS nombre_departamento,
        di.id AS id_distrito,
        di.nombre AS nombre_distrito,
        ue.id AS id_unidad_educativa,
        ue.codigo_sie,
        ue.nombre AS nombre_unidad_educativa,
        ue.tipo_unidad_educativa,
        ue.area_geografica,
        eag.id AS id_etapa_area_grado,
        et.id AS id_etapa,
        et.nombre AS nombre_etapa,
        et.tipo AS tipo_etapa,
        et.estado AS etapa_estado,
        a.id AS id_area,
        a.nombre AS nombre_area,
        ge.id AS id_grado_escolar,
        ge.nombre AS nombre_grado_escolar,
        ge.orden AS orden_grado_escolar,
        ee.puntaje,
        ee.estado AS estado_puntaje,
        ee.tipo_prueba,
        ee.tipo_planificacion,
        e.id AS id_estudiante,
        e.rude,
        p.id AS id_persona,
        p.nro_documento,
        p.nombres,
        p.primer_apellido,
        p.segundo_apellido,
        p.fecha_nacimiento,
        p.genero,
            CASE
                WHEN i.clasificado THEN 'SI'::text
                ELSE 'NO'::text
            END AS clasificado,
            CASE
                WHEN i.id_medallero_posicion_manual IS NOT NULL THEN i.id_medallero_posicion_manual
                WHEN i.id_medallero_posicion_automatica IS NOT NULL THEN i.id_medallero_posicion_automatica
                ELSE NULL::uuid
            END AS id_medallero_posicion,
            CASE
                WHEN i.id_medallero_posicion_manual IS NOT NULL OR i.id_medallero_posicion_automatica IS NOT NULL THEN 'SI'::text
                ELSE 'NO'::text
            END AS medallero,
            CASE
                WHEN i.id_medallero_posicion_manual IS NOT NULL THEN mpm.denominativo
                ELSE mpa.denominativo
            END AS denominacion_medallero,
            CASE
                WHEN i.id_medallero_posicion_manual IS NOT NULL THEN mpm.sub_grupo
                ELSE mpa.sub_grupo
            END AS sub_grupo_medallero,
            CASE
                WHEN i.id_medallero_posicion_manual IS NOT NULL THEN mpm.orden_galardon
                ELSE mpa.orden_galardon
            END AS orden_galardon_medallero
       FROM inscripcion i
         JOIN estudiante e ON e.id = i.id_estudiante AND e.estado = 'ACTIVO'::estudiante_estado_enum
         LEFT JOIN estudiante_examen ee ON ee.id_inscripcion = i.id AND (ee.estado = ANY (ARRAY['FINALIZADO'::estudiante_examen_estado_enum, 'TIMEOUT'::estudiante_examen_estado_enum]))
         JOIN persona p ON p.id = e.id_persona
         JOIN unidad_educativa ue ON ue.id = i.id_unidad_educativa AND ue.estado = 'ACTIVO'::unidad_educativa_estado_enum
         JOIN distrito di ON di.id = ue.id_distrito AND di.estado = 'ACTIVO'::distrito_estado_enum
         JOIN departamento d ON d.id = di.id_departamento
         JOIN etapa_area_grado eag ON eag.id = i.id_etapa_area_grado AND eag.estado = 'ACTIVO'::etapa_area_grado_estado_enum
         JOIN etapa et ON et.id = eag.id_etapa
         JOIN olimpiada o ON o.id = et.id_olimpiada AND (o.estado = 'ACTIVO'::olimpiada_estado_enum OR o.estado = 'CERRADO'::olimpiada_estado_enum)
         JOIN area a ON a.id = eag.id_area AND a.estado = 'ACTIVO'::area_estado_enum
         JOIN grado_escolaridad ge ON ge.id = eag.id_grado_escolar AND ge.estado = 'ACTIVO'::grado_escolaridad_estado_enum
         LEFT JOIN medallero_posicion mpm ON mpm.id = i.id_medallero_posicion_manual
         LEFT JOIN medallero_posicion mpa ON mpa.id = i.id_medallero_posicion_automatica
      WHERE i.estado = 'ACTIVO'::inscripcion_estado_enum
    WITH DATA;
    `);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
