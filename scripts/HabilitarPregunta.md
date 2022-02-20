# Ministerio de Educación - Olimpiadas Backend

## Script para habilitar la edición de una pregunta APROBADA
Ajustamos el estado de una pregunta a CREADO, en caso de equivocación por parte del comite de aprobación.

Reemplazar las variables [NOMBRE_OLIMPIADA], [AREA] [GRADO_ESCOLAR], [RUTA_IMAGEN], [TEXTO_PREGUNTA].

Primeramente verificamos si la pregunta se encuentra, mediante la siguiente consulta:

Ejemplo:

select p.id, p.texto_pregunta, p.imagen_pregunta, p.estado 
from pregunta p 
inner join etapa_area_grado eag on eag.id = p.id_etapa_area_grado 
inner join etapa e on e.id = eag.id_etapa 
inner join area a on a.id = eag.id_area 
inner join grado_escolaridad ge on ge.id = eag.id_grado_escolar 
inner join olimpiada o on o.id = e.id_olimpiada 
where o.nombre ilike '10ma Olimpiada Científica Estudiantil Plurinacional Boliviana'
and a.nombre ilike 'Geografía' and ge.nombre ilike 'Quinto de secundaria'
and (p.imagen_pregunta = 'deci2da/geo/geo514.jpg' or p.texto_pregunta = '[TEXTO_PREGUNTA]')

```sql
select p.id, p.texto_pregunta, p.imagen_pregunta, p.estado 
from pregunta p 
inner join etapa_area_grado eag on eag.id = p.id_etapa_area_grado 
inner join etapa e on e.id = eag.id_etapa 
inner join area a on a.id = eag.id_area 
inner join grado_escolaridad ge on ge.id = eag.id_grado_escolar 
inner join olimpiada o on o.id = e.id_olimpiada 
where o.nombre ilike '[NOMBRE_OLIMPIADA]'
and a.nombre ilike '[AREA]' and ge.nombre ilike '[GRADO_ESCOLAR]'
and (p.imagen_pregunta = '[RUTA_IMAGEN]' or p.texto_pregunta = '[TEXTO_PREGUNTA]')
```
A continuación ejecutamos la siguiente consulta:

```sql
update pregunta set estado = 'CREADO' where id in (
	select p.id from pregunta p 
	inner join etapa_area_grado eag on eag.id = p.id_etapa_area_grado 
	inner join etapa e on e.id = eag.id_etapa 
	inner join area a on a.id = eag.id_area 
	inner join grado_escolaridad ge on ge.id = eag.id_grado_escolar 
	inner join olimpiada o on o.id = e.id_olimpiada 
	where o.nombre ilike '[NOMBRE_OLIMPIADA]'
	and a.nombre ilike '[AREA]' and ge.nombre ilike '[GRADO_ESCOLAR]'
	and (p.imagen_pregunta = '[RUTA_IMAGEN]' or p.texto_pregunta = '[TEXTO_PREGUNTA]')
);
```
La consulta devolverá N valores actualizados