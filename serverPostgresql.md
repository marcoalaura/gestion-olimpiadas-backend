# Guía para crear un cluster PostgreSQL 12 sobre Debian 10
##### Septiembre, 2021
#

> **Recomendación 1.-**

Para alcanzar esperados niveles de rendimiento y escalabilidad, instalar el sistema de archivos XFS, con la opción LVM, en > cada una de las particiones donde se hallará la base de datos PostgreSQL.

### 1. Crear el usuario postgres a nivel sistema operativo

```sh
$ sudo userdel postgres
$ sudo useradd -m -d /home/postgres -s /bin/bash -c "PostgreSQL Server" postgres
$ sudo passwd postgres
## _password_postgres_so_
```
> **Nota.-**

La instalación en Debian incluye una envoltura de comandos que mantienen sin modificación los siguientes directorios: 
1. /usr/lib/postgresql/12, para programas ejecutables del motor PostgreSQL.
2. /etc/postgresql/12/main, para archivos de configuración inicial del cluster PostgreSQL.

> **Recomendación 2.-**

Para alcanzar altos niveles de rendimiento, es necesaria, la asignación de unidades de disco específicas, de acuerdo al tamaño que alcanzará la base de datos en un tiempo determinado (Ej.: un par de años):
- Archivos de la data y logs             (Ej.: /u01, 20% del tamaño de la BD)
- Archivos WAL                           (Ej.: /u02, 30% del t```shamaño de la BD)
- Archivos de datos                      (Ej.: /u03, 160% del tamaño de la BD)
- Archivos de índices                    (Ej.: /u04, 40% del tamaño de la BD)

Es decir, si por ejemplo la BD ocupará en 2 años un tamaño de 100 GB, entonces asignar discos de capacidad:
- /u01 = 100 * 0.2 = 20 GB 
- /u02 = 100 * 0.3 = 30 GB
- /u03 = 100 * 1.6 = 160 GB
- /u04 = 100 * 0.4 = 40 GB

### 2. Crear directorios de datos, índices y archivos WAL

```sh
$ sudo mkdir -p /u01/pgdata
$ sudo mkdir -p /u02/pgdata
$ sudo mkdir -p /u03/pgdata
$ sudo mkdir -p /u04/pgdata
```
Cambiar a la propiedad del usuario postgres todas las carpetas "pgdata"
```sh
$ sudo chown -R postgres:postgres /u01/pgdata
$ sudo chown -R postgres:postgres /u02/pgdata
$ sudo chown -R postgres:postgres /u03/pgdata
$ sudo chown -R postgres:postgres /u04/pgdata
```
Crear las subcarpetas de la base de datos y establecer variables de entorno
```sh
$ sudo su - postgres
$ umask 027
$ mkdir -p /u01/pgdata/12/main
$ mkdir -p /u01/pgdata/12/pg_log
$ mkdir -p /u02/pgdata/12/pg_wal
$ mkdir -p /u03/pgdata/12/tbs_data
$ mkdir -p /u04/pgdata/12/tbs_indx
```
```sh
$ echo 'export LANG="es_BO.UTF-8"' >> .profile
$ echo 'export LC_ALL="es_BO.UTF-8"' >> .profile
$ echo 'export PGDATA=/u01/pgdata/12/main' >> .profile
$ echo 'export PGHOME=/usr/lib/postgresql/12' >> .profile
$ echo 'export PATH=$PGHOME/bin:$PATH' >> .profile
$ echo 'umask 027' >> .profile
$ echo 'echo "####  PostgreSQL 12  ####"' >> .profile
$ exit
```
### 3. Instalar el software y crear el cluster PostgreSQL

```sh
$ sudo apt update
$ sudo apt -y upgrade
$ sudo apt install -y vim wget
$ wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
$ RELEASE=$(lsb_release -cs)
$ echo "deb http://apt.postgresql.org/pub/repos/apt/ ${RELEASE}"-pgdg main | sudo tee /etc/apt/sources.list.d/pgdg.list
$ sudo apt update
$ sudo apt -y install postgresql-12 postgresql-client-12
```
Re-crear el cluster PostgreSQL sobre una ruta personalizada
```sh
$ sudo -u postgres pg_dropcluster --stop 12 main
$ sudo -u postgres pg_createcluster 12 main -d /u01/pgdata/12/main -l /u01/pgdata/12/pg_log/postgresql-12-main.log -e UTF8 --locale=es_BO.UTF-8 -p 5445 -- --waldir=/u02/pgdata/12/pg_wal --wal-segsize=64
```
Arrancar el cluster PostgreSQL 12

**Modo 1**
```sh
$ sudo systemctl start postgresql@12-main.service
$ systemctl status postgresql@12-main.service
$ sudo -u postgres pg_lsclusters
```
**Modo 2**
```sh
$ sudo -u postgres pg_ctlcluster 12 main stop -- -o '-c config_file=/etc/postgresql/12/main/postgresql.conf -p 5445'
$ sudo -u postgres pg_ctlcluster 12 main start -- -o '-c config_file=/etc/postgresql/12/main/postgresql.conf -p 5445'
$ sudo -u postgres pg_ctlcluster 12 main status -- -o '-c config_file=/etc/postgresql/12/main/postgresql.conf -p 5445'
$ sudo -u postgres pg_lsclusters
```
Cambiar la contraseña al usuario postgres y crear un usuario propietario
```sh
$ sudo -u postgres psql -p 5445 -c "alter user postgres with password '_password_postgres_bd_'" 
$ sudo -u postgres psql -p 5445 -c "create user _usuario_db_ with password '_password_usuario_db_'" 
```
Crear los tablespaces
```sh
$ sudo -u postgres psql -p 5445 -c "create tablespace tbs_dat owner _usuario_db_ location '/u03/pgdata/12/tbs_data'"
$ sudo -u postgres psql -p 5445 -c "create tablespace tbs_idx owner _usuario_db_ location '/u04/pgdata/12/tbs_indx'"
```
Crear la nueva base de datos
```sh
$ sudo -u postgres psql -p 5445 -c "create database _nombre_db_ owner _usuario_db_ tablespace tbs_dat"
```
Crear el módulo para generar identificadores únicos
```sh
$ sudo -u postgres psql -p 5445 -d _nombre_db_ -c 'create extension if not exists "uuid-ossp"'
```
Asegurar que el estilo de fecha y timezone sean los correctos
```sh
$ sudo -u postgres psql -p 5445 -c "alter system set datestyle to 'iso, dmy'"
$ sudo -u postgres psql -p 5445 -c "alter system set timezone to 'America/La_Paz'"
```
Abrir la base de datos para permitir conexiones remotas
```
$ sudo -u postgres psql -p 5445 -c "alter system set listen_addresses to '*'"
$ sudo systemctl restart postgresql@12-main.service
$ systemctl status postgresql@12-main.service
$ sudo -u postgres pg_lsclusters
```
Finalmente, adicionar IPs y/o segmentos de red autorizados para conectarse a la nueva base de datos
```sh
$ su - postgres
$ echo "host    _nombre_db_     _usuario_db_    direccion_IP/32         md5"   >> /etc/postgresql/12/main/pg_hba.conf
$ echo "host    _nombre_db_     _usuario_db_    segmento_red/24         md5"   >> /etc/postgresql/12/main/pg_hba.conf
$ exit
```

