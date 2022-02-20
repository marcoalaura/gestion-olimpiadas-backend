# Ministerio de Educación - Olimpiadas Backend

## Script para dar de baja estudiantes inscritos
Eliminar estudiantes inscritos, mientras eeste no se encuentre en alguna olimpiada o etapa cerrada

Reemplazar la variable [ARRAY_CIs] por el listado de carnets que desea dar de baja, en el script definida a continuación.

```sql
DO $$
declare
	_validacion integer;
	_validacion_medallero_a integer;
	_validacion_medallero_m integer;
	_listado_ci_baja text Array;
BEGIN
	_listado_ci_baja := '[ARRAY_CIs]'; -- Vea el ejemplo de abajo
	-- Ejemplo: _listado_ci_baja := '{"12365778", "10552574", "2365778", "12365709", "552574", "466542", "451012", "8466542", "365709"}';

	select count(*) into _validacion from persona p 
	inner join estudiante e on e.id_persona = p.id 
	inner join inscripcion i on i.id_estudiante = e.id 
	inner join etapa_area_grado eag on eag.id = i.id_etapa_area_grado 
	inner join etapa et on et.id = eag.id_etapa 
	inner join olimpiada o on o.id = et.id_olimpiada
	where et.estado = 'CERRADO' or o.estado = 'CERRADO' 
	and p.nro_documento = ANY (_listado_ci_baja);

	select count(*) into _validacion_medallero_a from persona p 
	inner join estudiante e on e.id_persona = p.id 
	inner join inscripcion i on i.id_estudiante = e.id 
	inner join medallero_posicion mpa on mpa.id = i.id_medallero_posicion_automatica
	where p.nro_documento = ANY (_listado_ci_baja);

	select count(*) into _validacion_medallero_m from persona p 
	inner join estudiante e on e.id_persona = p.id 
	inner join inscripcion i on i.id_estudiante = e.id 
	inner join medallero_posicion mpm on mpm.id = i.id_medallero_posicion_manual
	where p.nro_documento = ANY (_listado_ci_baja);

	if (_validacion = 0 and _validacion_medallero_a = 0 and _validacion_medallero_m = 0) then
		-- Estudiante examen detalle
		delete from estudiante_examen_detalle where id_estudiante_examen in 
		(
			select ee.id from persona p 
			inner join estudiante e on e.id_persona = p.id 
			inner join inscripcion i on i.id_estudiante = e.id
			inner join estudiante_examen ee on ee.id_inscripcion = i.id 
			where p.nro_documento = ANY (_listado_ci_baja)
		);
	
		-- Estudiante examen
		delete from estudiante_examen where id_inscripcion in 
		(
			select i.id from persona p 
			inner join estudiante e on e.id_persona = p.id 
			inner join inscripcion i on i.id_estudiante = e.id 
			where p.nro_documento = ANY (_listado_ci_baja)
		);
		
		-- Inscripcion
		delete from inscripcion where id_estudiante in 
		(
			select e.id from persona p 
			inner join estudiante e on e.id_persona = p.id  
			where p.nro_documento = ANY (_listado_ci_baja)
		);
		
		-- Estudiante
		delete from estudiante where id_persona in 
		(
			select id from persona where nro_documento = ANY (_listado_ci_baja)
		);
		
		-- Persona
		delete from persona where nro_documento = ANY (_listado_ci_baja);
	
		RAISE NOTICE 'Script ejecutado correctamente.';
	else 
		if _validacion > 0 then
			RAISE NOTICE 'No se puede eliminar, existen estudiantes que ya terminaron la etapa.';
		end if;
		if _validacion_medallero_a > 0 or _validacion_medallero_m > 0 then
			RAISE NOTICE 'No se puede eliminar, existen estudiantes asociados al medallero.';
		end if;
	end if;

END $$;

```
Ejecutar el script en la consola de la base de datos respectiva.

Respuesta esperada: 
NOTICE:  Script ejecutado correctamente
Significa que el script se ejecuto correctamente.

Respuesta con error: 
NOTICE:  No se puede eliminar, existen estudiantes que ya terminaron la etapa.
ó
NOTICE:  No se puede eliminar, existen estudiantes asociados al medallero.
Significa que el script no se ejecuto, por lo tanto se debe identificar el CI que esta dando problemas.

Ejecutar la siguiente consulta para identificarlo, ( Reemplazar [ARRAY_CIs], por un listado de carnets como este ejemplo: '{"12365778", "10552574"}' ).

```sql
select p.nro_documento, 'Se encuentra en una etapa u olimpiada CERRADA' motivo from persona p 
inner join estudiante e on e.id_persona = p.id 
inner join inscripcion i on i.id_estudiante = e.id 
inner join etapa_area_grado eag on eag.id = i.id_etapa_area_grado 
inner join etapa et on et.id = eag.id_etapa 
inner join olimpiada o on o.id = et.id_olimpiada
where et.estado = 'CERRADO' or o.estado = 'CERRADO' and p.nro_documento = ANY ([ARRAY_CIs])
UNION
select p.nro_documento, 'Se encuentra asociado a un medallero' motivo from persona p 
inner join estudiante e on e.id_persona = p.id 
inner join inscripcion i on i.id_estudiante = e.id 
inner join medallero_posicion mpa on mpa.id = i.id_medallero_posicion_automatica
where p.nro_documento = ANY ([ARRAY_CIs])
UNION
select p.nro_documento, 'Se encuentra asociado a un medallero' motivo from persona p 
inner join estudiante e on e.id_persona = p.id 
inner join inscripcion i on i.id_estudiante = e.id 
inner join medallero_posicion mpm on mpm.id = i.id_medallero_posicion_manual
where p.nro_documento = ANY ([ARRAY_CIs]);
```