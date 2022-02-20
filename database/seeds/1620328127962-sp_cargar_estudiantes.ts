import { MigrationInterface, QueryRunner } from 'typeorm';
import { Calendario } from '../../src/application/olimpiada/entity/Calendario.entity';
import { EtapaAreaGrado } from '../../src/application/olimpiada/entity/EtapaAreaGrado.entity';

export class sp_cargar_estudiantes1620328127962 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
  CREATE OR REPLACE FUNCTION sp_cargar_estudiantes(_id_etapa_area_grado uuid, _items json, _usuario uuid)
    RETURNS text
    LANGUAGE plpgsql
   AS $function$
      DECLARE respuesta text;
      DECLARE reg_estudiante RECORD;
      DECLARE p_id_persona uuid;
      DECLARE p_id_estudiante uuid;
      DECLARE p_id_unidad_educativa uuid;
        BEGIN
          respuesta := '';
      
          CREATE TEMP TABLE tmp_estudiantes(
               "linea" integer,
               "idInscripcion" varchar,
                "codigoSie" integer, 
                rude varchar, 
                "nroDocumento" varchar,
                "tipoDocumento" varchar, 
                "fechaNacimiento" date, 
                nombres varchar,
                "primerApellido" varchar, 
                "segundoApellido" varchar, 
                genero varchar,
                telefono varchar,
                correo varchar);
          
        INSERT INTO tmp_estudiantes
        SELECT row_number() over(), "idInscripcion", "codigoSie", rude, "nroDocumento", "tipoDocumento", "fechaNacimiento", nombres, "primerApellido", "segundoApellido", genero, telefono, correo
        FROM json_populate_recordset(null::tmp_estudiantes, _items);
        
        -- Validamos que el código RUDE, CI y IdInscripcion no se encuentre repetido en el listado
        SELECT json_agg(r) INTO respuesta
        FROM (
            SELECT "idInscripcion", "codigoSie", rude, "nroDocumento", "tipoDocumento", "fechaNacimiento", nombres, "primerApellido", "segundoApellido", genero, telefono, correo,
             json_build_object('rude', json_build_object('linea', linea, 'error', 'El codigo de RUDE se encuentra repetido en el listado')) errores
            FROM tmp_estudiantes WHERE rude IN 
            (
                SELECT rude FROM tmp_estudiantes GROUP BY rude HAVING COUNT(*) >= 2
            )
        ) r;
        IF (respuesta != '') THEN
              RAISE EXCEPTION '%', respuesta;
            END IF;
        
        SELECT json_agg(r) INTO respuesta
        FROM (
            SELECT "idInscripcion", "codigoSie", rude, "nroDocumento", "tipoDocumento", "fechaNacimiento", nombres, "primerApellido", "segundoApellido", genero, telefono, correo,
             json_build_object('nroDocumento', json_build_object('linea', linea, 'error', 'El número de documento se encuentra repetido en el listado')) errores
            FROM tmp_estudiantes WHERE "nroDocumento" IN 
            (
                SELECT "nroDocumento" FROM tmp_estudiantes GROUP BY "nroDocumento" HAVING COUNT(*) >= 2
            )
        ) r;
       	IF (respuesta != '') THEN
              RAISE EXCEPTION '%', respuesta;
            END IF;
        
        SELECT json_agg(r) INTO respuesta
        FROM (
            SELECT "idInscripcion", "codigoSie", rude, "nroDocumento", "tipoDocumento", "fechaNacimiento", nombres, "primerApellido", "segundoApellido", genero, telefono, correo,
              json_build_object('idInscripcion', json_build_object('linea', linea, 'error', 'El Id Inscripción se encuentra repetido en el listado')) errores
            FROM tmp_estudiantes WHERE "idInscripcion" IN 
            (
                SELECT "idInscripcion" FROM tmp_estudiantes GROUP BY "idInscripcion" HAVING COUNT(*) >= 2
            )
        ) r;
          IF (respuesta != '') THEN
              RAISE EXCEPTION '%', respuesta;
            END IF;

        -- Validación de que el CI no este registrado con otro RUDE
        SELECT json_agg(r) INTO respuesta
        FROM (
           SELECT "idInscripcion", "codigoSie", t.rude, "nroDocumento", "tipoDocumento", "fechaNacimiento", t.nombres, "primerApellido", "segundoApellido", t.genero, t.telefono, t.correo,
             json_build_object('rude', json_build_object('linea', t.linea, 'error', 'El código rude esta registrado a otra persona')) errores
              FROM tmp_estudiantes t
              INNER JOIN estudiante e ON e.rude = t.rude and e.estado = 'ACTIVO'
              INNER JOIN persona p ON p.id = e.id_persona and p.estado = 'ACTIVO' and t."nroDocumento" <> p.nro_documento 
          ) r;
         
          IF (respuesta != '') THEN
              RAISE EXCEPTION '%', respuesta;
            END IF;

        SELECT json_agg(r) INTO respuesta
        FROM (
           SELECT "idInscripcion", "codigoSie", t.rude, "nroDocumento", "tipoDocumento", "fechaNacimiento", t.nombres, "primerApellido", "segundoApellido", t.genero, t.telefono, t.correo,
             json_build_object('nroDocumento', json_build_object('linea', t.linea, 'error', 'El número de documento ya esta registrado con otro código de rude')) errores
              FROM tmp_estudiantes t
              INNER JOIN persona p ON p.nro_documento = t."nroDocumento" and p.estado = 'ACTIVO'
              INNER JOIN estudiante e ON e.id_persona = p.id and e.estado = 'ACTIVO'  and e.rude <> t.rude
          ) r;
         
          IF (respuesta != '') THEN
              RAISE EXCEPTION '%', respuesta;
            END IF;
        
        -- Validación de que no se repita el idInscripción en otras inscripciones
        SELECT json_agg(r) INTO respuesta
        FROM (
            SELECT "idInscripcion", "codigoSie", t.rude, "nroDocumento", "tipoDocumento", "fechaNacimiento", t.nombres, "primerApellido", "segundoApellido", t.genero, t.telefono, t.correo,
              json_build_object('idInscripcion', json_build_object('linea', t.linea, 'error', 'El Id Inscripción ya esta registrado en otro registro de la etapa')) errores
              FROM tmp_estudiantes t
              INNER JOIN inscripcion i ON i.id_importacion = t."idInscripcion" AND i.id_etapa_area_grado <> _id_etapa_area_grado
        INNER JOIN etapa_area_grado eag ON eag.id = i.id_etapa_area_grado AND eag.estado = 'ACTIVO'
        INNER JOIN etapa et ON et.id = eag.id_etapa
        INNER JOIN etapa_area_grado eag2 on eag2.id = _id_etapa_area_grado and eag2.estado = 'ACTIVO'
              INNER JOIN etapa et2 ON et2.id = eag2.id_etapa AND et2.id = et.id
          ) r;
          
          IF (respuesta != '') THEN
              RAISE EXCEPTION '%', respuesta;
            END IF;

        -- Validación de las unidades educativas existan
        SELECT json_agg(r) INTO respuesta
        FROM (
           SELECT "idInscripcion", "codigoSie", rude, "nroDocumento", "tipoDocumento", "fechaNacimiento", nombres, "primerApellido", "segundoApellido", genero, telefono, correo,
             json_build_object('unidadEducativa', json_build_object('linea', linea, 'error', 'El código de la unidad educativa no existe')) errores
              FROM tmp_estudiantes t
              LEFT JOIN unidad_educativa u ON u.codigo_sie = t."codigoSie"
              WHERE u.codigo_sie is null
          ) r;
         
          IF (respuesta != '') THEN
              RAISE EXCEPTION '%', respuesta;
            END IF;
        
        -- Validación que el estudiante no este registrado en otra Unidades Educativas
        SELECT json_agg(r) INTO respuesta
        FROM (
            SELECT "idInscripcion", "codigoSie", t.rude, "nroDocumento", "tipoDocumento", "fechaNacimiento", t.nombres, "primerApellido", "segundoApellido", t.genero, t.telefono, t.correo,
              json_build_object('unidadEducativa', json_build_object('linea', t.linea, 'error', 'El estudiante esta registrado en otra unidad educativa')) errores
              FROM tmp_estudiantes t
              INNER JOIN estudiante e ON e.rude = t.rude and e.estado = 'ACTIVO'
              INNER JOIN persona p ON p.id = e.id_persona and p.estado = 'ACTIVO' and t."nroDocumento" = p.nro_documento
              INNER JOIN inscripcion i ON i.id_estudiante = e.id and i.id_etapa_area_grado <> _id_etapa_area_grado
              INNER JOIN unidad_educativa u on u.id = i.id_unidad_educativa and u.codigo_sie <> t."codigoSie"
              INNER JOIN etapa_area_grado eag on eag.id = i.id_etapa_area_grado and eag.estado = 'ACTIVO'
              INNER JOIN etapa et ON et.id = eag.id_etapa 
              INNER JOIN etapa_area_grado eag2 on eag2.id = _id_etapa_area_grado and eag2.estado = 'ACTIVO'
              INNER JOIN etapa et2 ON et2.id = eag2.id_etapa
              WHERE et2.id_olimpiada = et.id_olimpiada
          ) r;
          
          IF (respuesta != '') THEN
              RAISE EXCEPTION '%', respuesta;
            END IF;

        -- Validación de que no tenga más de 2 áreas
          SELECT json_agg(r) INTO respuesta
        FROM (
            SELECT "idInscripcion", "codigoSie", rude, "nroDocumento", "tipoDocumento", "fechaNacimiento", nombres, "primerApellido", "segundoApellido", genero, telefono, correo,
             json_build_object('area', json_build_object('linea', linea, 'error', 'El estudiante no se puede estar registrado en más de 2 áreas')) errores
            FROM tmp_estudiantes WHERE linea IN 
            (
                SELECT t.linea
                FROM tmp_estudiantes t
                INNER JOIN estudiante e ON e.rude = t.rude and e.estado = 'ACTIVO' 
                INNER JOIN inscripcion i ON i.id_estudiante = e.id and i.estado = 'ACTIVO'
                INNER JOIN etapa_area_grado eag on eag.id = i.id_etapa_area_grado and eag.estado = 'ACTIVO'
                INNER JOIN etapa et ON et.id = eag.id_etapa 
                INNER JOIN etapa_area_grado eag2 on eag2.id = _id_etapa_area_grado and eag2.estado = 'ACTIVO'
                INNER JOIN etapa et2 ON et2.id = eag2.id_etapa and et2.id = et.id
                GROUP BY t.linea, et.id
                HAVING COUNT(et.id) >= 2
            )
        ) r;
       
       IF (respuesta != '') THEN
              RAISE EXCEPTION '%', respuesta;
            END IF;
       
        -- Validación de que no este inscrito a más de 1 grado escolar
          SELECT json_agg(r) INTO respuesta
        FROM (
            SELECT "idInscripcion", "codigoSie", rude, "nroDocumento", "tipoDocumento", "fechaNacimiento", nombres, "primerApellido", "segundoApellido", genero, telefono, correo,
             json_build_object('gradoEscolar', json_build_object('linea', linea, 'error', 'El estudiante no se puede registrado en más de 1 grado escolar')) errores
            FROM tmp_estudiantes WHERE linea IN 
            (
                SELECT t.linea
                FROM tmp_estudiantes t
                INNER JOIN estudiante e ON e.rude = t.rude and e.estado = 'ACTIVO' 
                INNER JOIN inscripcion i ON i.id_estudiante = e.id and i.estado = 'ACTIVO'
                INNER JOIN etapa_area_grado eag on eag.id = i.id_etapa_area_grado and eag.estado = 'ACTIVO'
                INNER JOIN etapa et ON et.id = eag.id_etapa 
                INNER JOIN etapa_area_grado eag2 on eag2.id = _id_etapa_area_grado and eag2.estado = 'ACTIVO'
                INNER JOIN etapa et2 ON et2.id = eag2.id_etapa and et2.id = et.id
                WHERE eag.id_grado_escolar <> eag2.id_grado_escolar 
                GROUP BY t.linea, et.id
                HAVING COUNT(et.id) >= 1
            )
        ) r;
       
        IF (respuesta != '') THEN
              RAISE EXCEPTION '%', respuesta;
            END IF;
             
              FOR reg_estudiante IN (select "idInscripcion", "codigoSie", rude, "nroDocumento", "tipoDocumento", "fechaNacimiento", nombres, "primerApellido", "segundoApellido", genero, telefono, correo
                FROM tmp_estudiantes)
              LOOP
                SELECT id INTO p_id_persona FROM persona WHERE nro_documento = reg_estudiante."nroDocumento";
                IF (p_id_persona is NOT NULL) THEN
              UPDATE persona SET nombres = reg_estudiante.nombres, primer_apellido = reg_estudiante."primerApellido", segundo_apellido = reg_estudiante."segundoApellido", 
              tipo_documento = reg_estudiante."tipoDocumento"::persona_tipo_documento_enum, fecha_nacimiento = reg_estudiante."fechaNacimiento"::date, genero = reg_estudiante.genero::persona_genero_enum, 
              telefono = reg_estudiante.telefono, correo_electronico = reg_estudiante.correo, fecha_actualizacion = now(), usuario_actualizacion = _usuario
              WHERE nro_documento = reg_estudiante."nroDocumento";
                  ELSE
                    INSERT INTO persona (nombres, primer_apellido, segundo_apellido, tipo_documento, nro_documento, fecha_nacimiento, genero, telefono, correo_electronico, estado, fecha_creacion, usuario_creacion)
              VALUES (reg_estudiante.nombres, reg_estudiante."primerApellido", reg_estudiante."segundoApellido", reg_estudiante."tipoDocumento"::persona_tipo_documento_enum, reg_estudiante."nroDocumento", 
              reg_estudiante."fechaNacimiento"::date, reg_estudiante.genero::persona_genero_enum, reg_estudiante.telefono, reg_estudiante.correo, 'ACTIVO', now(), _usuario) RETURNING id INTO p_id_persona;
                  END IF;
                 
            SELECT id INTO p_id_estudiante FROM estudiante WHERE rude = reg_estudiante.rude;
                  IF (p_id_estudiante is NULL) THEN
                    INSERT INTO estudiante (rude, id_persona, fecha_creacion, usuario_creacion)
              VALUES(reg_estudiante.rude, p_id_persona, now(), _usuario) RETURNING id INTO p_id_estudiante;
                  END IF;
                 
                  SELECT id INTO p_id_unidad_educativa FROM unidad_educativa WHERE codigo_sie = reg_estudiante."codigoSie";
            IF EXISTS (SELECT id FROM inscripcion WHERE id_estudiante = p_id_estudiante and id_etapa_area_grado = _id_etapa_area_grado) THEN
              UPDATE inscripcion SET id_importacion = reg_estudiante."idInscripcion", id_unidad_educativa = p_id_unidad_educativa, fecha_actualizacion = now(), usuario_actualizacion = _usuario , estado = 'ACTIVO', importado = true 
              WHERE id_estudiante = p_id_estudiante and id_etapa_area_grado = _id_etapa_area_grado;
                  ELSE
                    INSERT INTO inscripcion (id, id_importacion, id_estudiante , id_etapa_area_grado, id_unidad_educativa, importado, fecha_creacion, usuario_creacion)
              VALUES (uuid_generate_v4(), reg_estudiante."idInscripcion", p_id_estudiante, _id_etapa_area_grado, p_id_unidad_educativa, true, now(), _usuario);
                  END IF;
              END LOOP;
              DROP TABLE IF EXISTS tmp_estudiantes;
             RETURN 'Ok';
           EXCEPTION WHEN OTHERS THEN
              DROP TABLE IF EXISTS tmp_estudiantes;
             RETURN SQLERRM;
           END;
           $function$;
    `);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
