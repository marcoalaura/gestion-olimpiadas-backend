DO $$
DECLARE
    filas_actualizadas Int;
    _id_rol varchar;
BEGIN
    
    CREATE temp TABLE tmp_persona(
    	nro_documento varchar,
    	nombres varchar,
    	primer_apellido varchar,
    	segundo_apellido varchar,
    	fecha_nacimiento varchar,
    	telefono integer,
    	correo_electronico varchar,
    	genero varchar,
    	codigo_sie integer,
    	sigla_olimpiada varchar
    );
   
   	SELECT id into _id_rol FROM rol WHERE rol = 'DIRECTOR';
    
	   
    copy tmp_persona(nro_documento, nombres, primer_apellido, segundo_apellido, fecha_nacimiento, telefono, correo_electronico, genero, codigo_sie, sigla_olimpiada)
        from '/tmp/usuarios.csv' delimiter '|' csv header;
   
    INSERT INTO persona (id, nombres, primer_apellido, segundo_apellido, tipo_documento, nro_documento, fecha_nacimiento, telefono, correo_electronico, genero, estado, fecha_creacion, usuario_creacion)
    SELECT md5(nro_documento)::uuid, nombres, primer_apellido, segundo_apellido, 'CI'::persona_tipo_documento_enum, nro_documento, fecha_nacimiento::date, telefono, correo_electronico, genero::persona_genero_enum , 'ACTIVO', CURRENT_TIMESTAMP, '1' 
    FROM tmp_persona WHERE nro_documento NOT IN (SELECT nro_documento FROM persona WHERE estado = 'ACTIVO');

    INSERT INTO usuario (id, id_persona, usuario, contrasena, correo_electronico, estado, intentos, fecha_creacion, usuario_creacion)
	SELECT md5(nro_documento)::uuid, md5(nro_documento)::uuid, nro_documento, crypt(nro_documento, gen_salt('bf', 10)), correo_electronico, 'ASIGNADO'::usuario_estado_enum, 0, CURRENT_TIMESTAMP, '1' 
	FROM tmp_persona WHERE nro_documento NOT IN (SELECT usuario FROM usuario);

	DELETE FROM usuario_rol WHERE id_rol = _id_rol::uuid and id_olimpiada in (
		SELECT o.id FROM olimpiada o INNER JOIN tmp_persona t on t.sigla_olimpiada = o.sigla GROUP BY o.id 
	) and id_usuario in (
		SELECT u.id FROM usuario u INNER JOIN tmp_persona t on t.nro_documento = u.usuario
	); 

	INSERT INTO usuario_rol (id,  id_usuario, id_rol, id_olimpiada, id_unidad_educativa, estado, fecha_creacion, usuario_creacion)
	SELECT uuid_generate_v4(), md5(nro_documento)::uuid, _id_rol::uuid, o.id::uuid, u.id, 'ACTIVO', CURRENT_TIMESTAMP, '1' FROM tmp_persona t
	INNER JOIN olimpiada o on o.sigla = t.sigla_olimpiada
	LEFT JOIN unidad_educativa u on u.codigo_sie = t.codigo_sie;

    DROP TABLE IF EXISTS tmp_persona;

    RAISE NOTICE 'Script ejecutado correctamente';
    
END $$;
