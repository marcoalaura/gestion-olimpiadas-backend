# Ministerio de Educación - Olimpiadas Backend

## Script consulta reporte de calificaciones
Obtener la sigla de la olimpiada de donde precisa recuperar la información y obtener el tipo de la etapa.

Reemplazar la sigla obtenida en la variable [SIGLA] y el tipo de etapa [TIPO_ETAPA], en el script definida a continuación.

```sql
DO $$
DECLARE
	_sigla_olimpiada Text;
	_tipo_etapa Text;
BEGIN
	_sigla_olimpiada := '[SIGLA]';
	_tipo_etapa := '[TIPO_ETAPA]';

	EXECUTE 'CREATE TEMPORARY TABLE temp_calificaciones AS 
		SELECT a.nombre area, ge.nombre grado, ue.codigo_sie, ue.nombre unidad_educativa, inscritos.total, online.total_online, offline.total_offline
		FROM (
			SELECT eag.id_area, eag.id_grado_escolar, i.id_unidad_educativa, count(*) total
			FROM inscripcion i 
			INNER JOIN etapa_area_grado eag ON eag.id = i.id_etapa_area_grado
			INNER JOIN etapa e ON e.id = eag.id_etapa 
			INNER JOIN olimpiada o ON o.id = e.id_olimpiada
			WHERE e.tipo::text = $1 and o.sigla = $2
			GROUP BY eag.id_area, eag.id_grado_escolar, i.id_unidad_educativa
		) inscritos
		LEFT JOIN (
			SELECT eag.id_area, eag.id_grado_escolar, i.id_unidad_educativa, count(*) total_online
			FROM estudiante_examen ee
			INNER JOIN inscripcion i ON i.id = ee.id_inscripcion
			INNER JOIN etapa_area_grado eag ON eag.id = i.id_etapa_area_grado
			INNER JOIN etapa e ON e.id = eag.id_etapa 
			INNER JOIN olimpiada o ON o.id = e.id_olimpiada
			WHERE e.tipo::text = $1 and o.sigla = $2 and ee.tipo_prueba = ''ONLINE'' and ee.estado in (''FINALIZADO'', ''TIMEOUT'')
			GROUP BY eag.id_area, eag.id_grado_escolar, i.id_unidad_educativa
		) online on inscritos.id_area = online.id_area and inscritos.id_grado_escolar = online.id_grado_escolar and inscritos.id_unidad_educativa = online.id_unidad_educativa 
		LEFT JOIN (
			SELECT eag.id_area, eag.id_grado_escolar, i.id_unidad_educativa, count(*) total_offline
			FROM estudiante_examen ee
			INNER JOIN inscripcion i ON i.id = ee.id_inscripcion
			INNER JOIN etapa_area_grado eag ON eag.id = i.id_etapa_area_grado
			INNER JOIN etapa e ON e.id = eag.id_etapa 
			INNER JOIN olimpiada o ON o.id = e.id_olimpiada
			WHERE e.tipo::text = $1 and o.sigla = $2 and ee.tipo_prueba = ''OFFLINE'' and ee.estado in (''FINALIZADO'', ''TIMEOUT'')
			GROUP BY eag.id_area, eag.id_grado_escolar, i.id_unidad_educativa
		) offline on inscritos.id_area = offline.id_area and inscritos.id_grado_escolar = offline.id_grado_escolar and inscritos.id_unidad_educativa = offline.id_unidad_educativa
		INNER JOIN area a ON a.id = inscritos.id_area
		INNER JOIN grado_escolaridad ge ON ge.id = inscritos.id_grado_escolar 
		INNER JOIN unidad_educativa ue ON ue.id = inscritos.id_unidad_educativa
		ORDER BY a.nombre, ge.orden, ue.codigo_sie'
		USING _tipo_etapa, _sigla_olimpiada;
	
	COPY(SELECT * FROM temp_calificaciones) TO '/tmp/consulta_calificaciones.csv' With CSV DELIMITER '|' HEADER;
	
	DROP TABLE temp_calificaciones;

	RAISE NOTICE 'Script ejecutado correctamente.';
END $$;

```
Ejecutar el script en la consola de la base de datos respectiva.

Respuesta esperada: 
NOTICE:  Script ejecutado correctamente

Se genera como resultado un archivo en la siguiente dirección del servidor de base de datos: /tmp/consulta_calificaciones.csv.
