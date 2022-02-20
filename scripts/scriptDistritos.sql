DO $$
DECLARE
    filas_actualizadas Int;
BEGIN
    
    CREATE temp TABLE tmp_distrito(
        codigo_distrito integer,
        nombre_distrito varchar,
        codigo_departamento varchar
    );
   
    copy tmp_distrito(codigo_distrito, nombre_distrito, codigo_departamento)
        from '/tmp/distritos.csv' delimiter '|' csv header;
    
    -- Si existe el distrito no debe registrar
    insert into distrito (codigo, nombre, id_departamento, usuario_creacion, fecha_creacion)
    select t.codigo_distrito, t.nombre_distrito, d.id, '1', now()  from tmp_distrito t
    inner join departamento d on d.codigo = cast(t.codigo_departamento as varchar)
   	where t.codigo_distrito not in (select codigo from distrito where estado = 'ACTIVO');
    
    DROP TABLE IF EXISTS tmp_distrito;
    
    create temp TABLE tmp_unidad_educativa(
            codigo_sie integer,
            nombre varchar,
            dependencia varchar,
            area varchar,
            seccion varchar,
            localidad varchar,
            codigo_distrito varchar
        );
       
    copy tmp_unidad_educativa(codigo_sie, nombre, dependencia, area, seccion, localidad, codigo_distrito)
        from '/tmp/unidades_educativas.csv' delimiter '|' csv header;
   
   	INSERT INTO seccion (nombre, estado, fecha_creacion, usuario_creacion)
    SELECT seccion, 'ACTIVO', CURRENT_TIMESTAMP, '1'  
   	FROM tmp_unidad_educativa WHERE nombre NOT IN ( SELECT nombre FROM seccion WHERE estado = 'ACTIVO') GROUP BY seccion; 
   
   	INSERT INTO localidad (nombre, estado, fecha_creacion, usuario_creacion)
    SELECT localidad, 'ACTIVO', CURRENT_TIMESTAMP, '1'  
   	FROM tmp_unidad_educativa WHERE nombre NOT IN ( SELECT nombre FROM localidad WHERE estado = 'ACTIVO') GROUP BY localidad;
    
   	-- si existe no registrar
    insert into unidad_educativa (codigo_sie, nombre, tipo_unidad_educativa, area_geografica, seccion, localidad, id_distrito, usuario_creacion, fecha_creacion)
    select t.codigo_sie, t.nombre, UPPER(t.dependencia)::unidad_educativa_tipo_unidad_educativa_enum , UPPER(t.area)::unidad_educativa_area_geografica_enum , t.seccion, t.localidad, d.id, '1', now()  from tmp_unidad_educativa t
    inner join distrito d on cast(d.codigo as varchar) = t.codigo_distrito
   	where t.codigo_sie not in (select codigo_sie from unidad_educativa where estado = 'ACTIVO');
    
    DROP TABLE IF EXISTS tmp_unidad_educativa;

    RAISE NOTICE 'Script ejecutado correctamente';
    
END $$;



