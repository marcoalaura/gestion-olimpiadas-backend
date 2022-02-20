# Ministerio de Educación - Olimpiadas Backend

## Script consulta información de una olimpiada
Obtener la sigla de la olimpiada de donde precisa recuperar la información.

Reemplazar la sigla obtenida en la variable [SIGLA], en el script definida a continuación.

```sql
DO $$
DECLARE
    num_preguntas Int;
	tipo_pregunta Text;
	nivel_dificultad Text;
	texto_pregunta Text;
	imagen_pregunta Text;
	tipo_respuesta Text;
	opciones Text;
	respuestas_pregunta Text;
	respuestas_estudiante Text;
	puntaje_pregunta Text;
	puntaje_respuesta Text;
	estado_pregunta Text;
	columnas_sql Text;
	_sigla_olimpiada Text;
BEGIN
	_sigla_olimpiada := '[SIGLA]';

	tipo_pregunta := '';
	nivel_dificultad := '';
	texto_pregunta := '';
	imagen_pregunta := '';
	tipo_respuesta := '';
	opciones := '';
	respuestas_pregunta := '';
	respuestas_estudiante := '';
	puntaje_pregunta := '';
	puntaje_respuesta := '';
	estado_pregunta := '';

	-- Verifica en la configuración el maximo numero de preguntas
	SELECT max(eag.total_preguntas::numeric) INTO num_preguntas FROM olimpiada o 
	INNER JOIN etapa e ON e.id_olimpiada = o.id
	INNER JOIN etapa_area_grado eag ON eag.id_etapa = e.id
	WHERE o.sigla = _sigla_olimpiada;
	
	IF (num_preguntas > 0) THEN
		-- Armamos los campos dinamicos por variable
		FOR i in 1..num_preguntas LOOP
			tipo_pregunta := tipo_pregunta || 'split_part(string_agg(p.tipo_pregunta::varchar, ''~'' ORDER BY eed.id), ''~'', ' || i || ') tipo_pregunta_' || i || ', ';
			nivel_dificultad := nivel_dificultad || 'split_part(string_agg(p.nivel_dificultad::varchar, ''~'' ORDER BY eed.id), ''~'', ' || i || ') nivel_dificultad_' || i || ', ';
			texto_pregunta := texto_pregunta || 'split_part(string_agg(p.texto_pregunta::varchar, ''~'' ORDER BY eed.id), ''~'', ' || i || ') texto_pregunta_' || i || ', ';
			imagen_pregunta := imagen_pregunta || 'split_part(string_agg(p.imagen_pregunta::varchar, ''~'' ORDER BY eed.id), ''~'', ' || i || ') imagen_pregunta_' || i || ', ';
			tipo_respuesta := tipo_respuesta || 'split_part(string_agg(p.tipo_respuesta::varchar, ''~'' ORDER BY eed.id), ''~'', ' || i || ') tipo_respuesta_' || i || ', ';
			opciones := opciones || 'split_part(string_agg(p.opciones::varchar, ''~'' ORDER BY eed.id), ''~'', ' || i || ') opciones_' || i || ', ';
			respuestas_pregunta := respuestas_pregunta || 'split_part(string_agg(p.respuestas::varchar, ''~'' ORDER BY eed.id), ''~'', ' || i || ') respuestas_pregunta_' || i || ', ';
			respuestas_estudiante := respuestas_estudiante || 'split_part(string_agg(eed.respuestas::varchar, ''~'' ORDER BY eed.id), ''~'', ' || i || ') respuestas_estudiante_' || i || ', ';
			puntaje_pregunta := puntaje_pregunta || 'split_part(string_agg(
				CASE WHEN p.tipo_pregunta = ''CURRICULA'' AND p.nivel_dificultad = ''COMPLEJA'' THEN eag.puntaje_curricula_alta 
	        	 WHEN p.tipo_pregunta = ''CURRICULA'' AND p.nivel_dificultad = ''INTERMEDIA'' THEN eag.puntaje_curricula_media 
	        	 WHEN p.tipo_pregunta = ''CURRICULA'' AND p.nivel_dificultad = ''BASICA'' THEN eag.puntaje_curricula_baja 
	        	 WHEN p.tipo_pregunta = ''OLIMPIADA'' AND p.nivel_dificultad = ''COMPLEJA'' THEN eag.puntaje_curricula_alta 
	        	 WHEN p.tipo_pregunta = ''OLIMPIADA'' AND p.nivel_dificultad = ''INTERMEDIA'' THEN eag.puntaje_curricula_media 
	        	 WHEN p.tipo_pregunta = ''OLIMPIADA'' AND p.nivel_dificultad = ''BASICA'' THEN eag.puntaje_curricula_baja
				 ELSE 0 END:: varchar, ''~'' ORDER BY eed.id), ''~'', ' || i || ') puntaje_pregunta_' || i || ', ';
			puntaje_respuesta := puntaje_respuesta || 'split_part(string_agg(eed.puntaje::varchar, ''~'' ORDER BY eed.id), ''~'', ' || i || ') puntaje_respuesta_' || i || ', ';
			estado_pregunta := estado_pregunta || 'split_part(string_agg(p.estado::varchar, ''~'' ORDER BY eed.id), ''~'', ' || i || ') estado_pregunta_' || i || ', ';
		  END LOOP;
	  	  estado_pregunta := substr(estado_pregunta, 1 , length(estado_pregunta) - 2);
	
 	  	-- Ejecutamos la tabla temporal con las columnas dinamicas por variable
		EXECUTE 'CREATE TEMPORARY TABLE temp_estudiante_examen AS SELECT ee.id id_estudiante_examen, ' || tipo_pregunta || nivel_dificultad || 
		texto_pregunta || imagen_pregunta || tipo_respuesta || opciones || respuestas_pregunta || respuestas_estudiante || puntaje_pregunta || puntaje_respuesta || estado_pregunta ||
	   	' FROM estudiante_examen ee
		INNER JOIN estudiante_examen_detalle eed ON eed.id_estudiante_examen = ee.id
		INNER JOIN pregunta p ON p.id = eed.id_pregunta 
		INNER JOIN inscripcion i ON i.id = ee.id_inscripcion AND i.estado = ''ACTIVO''
		INNER JOIN etapa_area_grado eag ON eag.id = i.id_etapa_area_grado
		INNER JOIN etapa e ON e.id = eag.id_etapa
		INNER JOIN olimpiada o ON o.id = e.id_olimpiada
		WHERE o.sigla = $1
		GROUP BY ee.id'
		USING _sigla_olimpiada;

		-- Construimos la consulta solicitada
		CREATE TEMPORARY TABLE temp_reporte AS
			SELECT 	o.gestion,
		  	o.nombre AS nombre_olimpiada,
	        et.nombre AS nombre_etapa,
	        et.tipo AS tipo_etapa,
	        d.codigo AS codigo_departamento,
		  	d.nombre AS nombre_departamento,
		  	di.codigo AS codigo_distrito,
	        di.nombre AS nombre_distrito,
	        a.nombre AS nombre_area,
	        ge.nombre AS nombre_grado_escolar,
	        e.rude,
	        p.primer_apellido,
	        p.segundo_apellido,
	        p.nombres,
	        p.genero,
	        p.nro_documento,
	        p.fecha_nacimiento,
	        p.telefono,
	        p.correo_electronico,
	        ue.codigo_sie,
	        ue.nombre AS nombre_unidad_educativa,
	        ue.tipo_unidad_educativa,
	        ue.area_geografica,
	        ue.seccion,
	        ue.localidad,
	        i.id_importacion,
	        i.fecha_creacion AS fecha_inscripcion,
	        ee.tipo_prueba AS tipo_prueba,
	        ee.tipo_planificacion AS tipo_planificacion,
	        (SELECT fecha_hora_inicio FROM calendario WHERE id_etapa_area_grado = eag.id AND tipo_prueba::varchar = ee.tipo_prueba::varchar AND tipo_planificacion::varchar = ee.tipo_planificacion::varchar) AS fecha_hora_inicio,
	        (SELECT fecha_hora_inicio FROM calendario WHERE id_etapa_area_grado = eag.id AND tipo_prueba::varchar = ee.tipo_prueba::varchar AND tipo_planificacion::varchar = ee.tipo_planificacion::varchar) AS fecha_hora_fin,
	        eag.duracion_minutos,
	        CASE
	            WHEN i.id_medallero_posicion_manual IS NOT NULL THEN mpm.orden_galardon
	            ELSE mpa.orden_galardon
	        END AS posicion,
	        CASE
	            WHEN i.id_medallero_posicion_manual IS NOT NULL THEN mpm.denominativo
	            ELSE mpa.denominativo
	        END AS medallero,
	        CASE
	            WHEN i.clasificado THEN 'SI'::text
	            ELSE 'NO'::text
	        END AS clasificado,
	        tee.*,
	        ee.puntaje AS puntaje,
	        CASE
	            WHEN i.id_medallero_posicion_manual IS NOT NULL THEN 'SI'
	            ELSE 'NO'
	        END AS desempate
	       FROM inscripcion i
	         JOIN estudiante e ON e.id = i.id_estudiante 
	         LEFT JOIN (
	         	SELECT id, id_inscripcion, fecha_inicio, fecha_fin, tipo_prueba, tipo_planificacion, puntaje, estado 
	         	FROM estudiante_examen WHERE estado = ANY (ARRAY['FINALIZADO'::estudiante_examen_estado_enum, 'TIMEOUT'::estudiante_examen_estado_enum])
	         	UNION
	         	SELECT id, id_inscripcion, fecha_inicio, fecha_fin, tipo_prueba, tipo_planificacion, puntaje, estado 
	         	FROM estudiante_examen WHERE tipo_prueba = 'ONLINE' AND estado = ANY (ARRAY['ACTIVO'::estudiante_examen_estado_enum, 'INACTIVO'::estudiante_examen_estado_enum])
	         ) ee ON ee.id_inscripcion = i.id         
	         JOIN temp_estudiante_examen tee ON tee.id_estudiante_examen = ee.id
	         JOIN persona p ON p.id = e.id_persona
	         JOIN unidad_educativa ue ON ue.id = i.id_unidad_educativa 
	         JOIN distrito di ON di.id = ue.id_distrito 
	         JOIN departamento d ON d.id = di.id_departamento
	         JOIN etapa_area_grado eag ON eag.id = i.id_etapa_area_grado
	         JOIN etapa et ON et.id = eag.id_etapa
	         JOIN olimpiada o ON o.id = et.id_olimpiada AND (o.estado = 'ACTIVO'::olimpiada_estado_enum OR o.estado = 'CERRADO'::olimpiada_estado_enum)
	         JOIN area a ON a.id = eag.id_area 
	         JOIN grado_escolaridad ge ON ge.id = eag.id_grado_escolar
	         LEFT JOIN medallero_posicion mpm ON mpm.id = i.id_medallero_posicion_manual
	         LEFT JOIN medallero_posicion mpa ON mpa.id = i.id_medallero_posicion_automatica
	      WHERE i.estado = 'ACTIVO'::inscripcion_estado_enum AND o.sigla = _sigla_olimpiada
	      ORDER BY o.gestion, o.nombre, et.fecha_inicio, a.nombre, ge.orden, d.nombre, di.nombre, ue.nombre, e.rude;
		
	    ALTER TABLE temp_reporte drop id_estudiante_examen;
	    COPY(SELECT * FROM temp_reporte) TO '/tmp/consulta_general.csv' delimiter '|' csv header;
	
		DROP TABLE temp_estudiante_examen;
		DROP TABLE temp_reporte;
	END IF;

	RAISE NOTICE 'Script ejecutado correctamente.';
END $$;

```
Ejecutar el script en la consola de la base de datos respectiva.

Respuesta esperada: 
NOTICE:  Script ejecutado correctamente

Se genera como resultado un archivo en la siguiente dirección del servidor de base de datos: /tmp/consulta_general.csv.
