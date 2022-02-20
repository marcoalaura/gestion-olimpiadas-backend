# Reiniciar examenes en la prueba piloto (solo debe ejecutarse en ambiete de test)

* Para esta tarea utilizaremos `pg_cron`
* Antes de ejecutar los siguientes pasos verificar que se tiene instalado y configurado correctamente `pg_cron`

## Crear funcion para reiniciar examenes

~~~~sql
CREATE OR REPLACE FUNCTION reiniciarExamenEtapaPiloto ()
RETURNS void AS $$
declare
BEGIN
    update estudiante_examen set estado = 'ACTIVO', fecha_inicio = null, fecha_fin = null, fecha_conclusion = null, puntaje = null;
    update estudiante_examen_detalle set respuestas = null, puntaje = null;
   RETURN;
END;
$$ LANGUAGE plpgsql;
~~~~

## Crear tarea programada

~~~sql
SELECT cron.schedule('${schedule}', $$select reiniciarExamenEtapaPiloto()$$);
~~~

Actualizar `${schedule}` con el valor de cuando se necesite que se ejecute la tarea (`The schedule uses the standard cron syntax`)


