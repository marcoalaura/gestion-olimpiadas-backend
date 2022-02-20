# Ministerio de Educación - Olimpiadas Backend

## Script de carga de distritos y unidades educativas
Utilizar la plantilla: distritosUnidadesEducativas_Plantilla.ods para generar los archivos csv.

Copiar el archivo distritos.csv y unidades_educativas.csv, en la ruta /tmp

Ejecutar el script: 'scriptDistritos.sql', en la base de datos.
```bash
$ psql -U <USUARIO_POSTGRES> -d <NOMBRE_BASE_DATOS> -a -f scriptDistritos.sql
```
Respuesta esperada: 
NOTICE:  Script ejecutado correctamente
### Script de carga de usuarios (rol director)
Utilizar la plantilla: usuarios_Plantilla.ods para generar los archivos csv.

Copiar el archivo usuarios.csv en la ruta /tmp

Ejecutar el script: 'scriptUsuarios.sql', en la base de datos.
```bash
$ psql -U <USUARIO_POSTGRES> -d <NOMBRE_BASE_DATOS> -a -f scriptUsuarios.sql
```
Respuesta esperada: 
NOTICE:  Script ejecutado correctamente