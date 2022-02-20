import { MigrationInterface, QueryRunner } from 'typeorm';

export class sp_obtener_calificaciones1634460342871
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
   CREATE OR REPLACE FUNCTION sp_obtener_calificaciones(_id_etapa uuid, _limite integer, _saltar integer, _unidad_educativa varchar)
    RETURNS TABLE("idInscripcion" uuid, "idEtapaAreaGrado" uuid, "areaId" uuid, "areaNombre" varchar, "areaEstado" varchar, "gradoEscolarId" uuid,
			"gradoEscolarNombre" varchar, "gradoEscolarEstado" varchar, "idUnidadEducativa" uuid, "unidadEducativa" varchar, "codigoSie" integer, 
			"distritoNombre" varchar, "departamentoNombre" varchar, "idEstudianteExamen" uuid, "examenEstado" varchar, "tipoPrueba" varchar)
    LANGUAGE plpgsql
   AS $function$
    DECLARE respuesta text;
    DECLARE reg_grupo RECORD;
   	DECLARE reg_estudiante_examen RECORD;
    BEGIN
      	FOR reg_grupo IN (
      		SELECT eag.id_area as "areaId", eag.id_grado_escolar as "gradoEscolarId", ue.id as "unidadEducativaId" 
			FROM inscripcion i 
			INNER JOIN etapa_area_grado eag ON eag.id = i.id_etapa_area_grado  
			INNER JOIN unidad_educativa ue ON ue.id = i.id_unidad_educativa  
			INNER JOIN estudiante_examen ee ON ee.id_inscripcion = i.id  
			WHERE eag.id_etapa = _id_etapa AND ee.estado NOT IN ('ANULADO') 
			AND (ue.codigo_sie::VARCHAR like '%' || _unidad_educativa || '%'
				OR ue.nombre ilike '%' || _unidad_educativa || '%')
			GROUP BY eag.id_area, eag.id_grado_escolar, ue.id 
			ORDER BY ue.nombre ASC 
			LIMIT _limite OFFSET _saltar
      	)
        LOOP
        	RETURN QUERY SELECT i.id, eag.id, a.id, a.nombre, a.estado::varchar, ge.id,
			ge.nombre, ge.estado::varchar, ue.id, ue.nombre, ue.codigo_sie, 
			d.nombre, de.nombre, ee.id, ee.estado::varchar, ee.tipo_prueba::varchar 
			FROM inscripcion i 
			INNER JOIN etapa_area_grado eag ON eag.id=i.id_etapa_area_grado  
			INNER JOIN unidad_educativa ue ON ue.id=i.id_unidad_educativa  
			INNER JOIN estudiante_examen ee ON ee.id_inscripcion=i.id  
			INNER JOIN area a ON a.id=eag.id_area  
			INNER JOIN grado_escolaridad ge ON ge.id=eag.id_grado_escolar  
			INNER JOIN distrito d ON d.id=ue.id_distrito  
			INNER JOIN departamento de ON de.id=d.id_departamento 
			WHERE eag.id_etapa = _id_etapa
			AND ee.estado NOT IN ('ANULADO')
			AND a.id = reg_grupo."areaId" and ge.id = reg_grupo."gradoEscolarId" and ue.id = reg_grupo."unidadEducativaId";
     	END LOOP;
		RAISE NOTICE 'FINALIZADO';
   	END;
   $function$;
    `);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
