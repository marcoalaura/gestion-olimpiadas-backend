# Instalación del Proyecto

## Instalar los requerimientos necesarios en el servidor

Es necesario tener configurado un servidor, para esto puede ver [SERVER.md](SERVER.md).

## Instalación del código fuente

### 1. Clonar el proyecto

```
$ git clone https://gitlab.agetic.gob.bo/agetic/minedu/olimpiadas/minedu-olimpiadas-backend.git
```

### 2. Ingresar a la carpeta

```
$ cd minedu-olimpiadas-backend
```

### 3. Instalar dependencias del proyecto

> Es necesario que el servidor tenga correctamente configurado los [repositorios](http://repositorio.agetic.gob.bo/).

```
$ npm install
```

### 4. Archivo de configuración

Copiar el archivo de configuración de ejemplo.

```
$ cp .env.sample .env
```

Verificar que todas las variables esten correctamente configurados.

```
$ nano .env
```

Revisar el archivo creado `.env` y configurar las variables necesarias. Los ejemplos se encuentran en el archivo `.env.sample` de configuración.

**NOTA**: PARA MAYOR DETALLE REVISAR LA ÚLTIMA VERSIÓN DEL ARCHIVO .env.sample.

**Datos de despliegue**
- NODE_ENV: ambiente de despliegue.
- PORT: Puerto en el que se levantará la aplicación.

**Configuración de la base de datos**
- DB_HOST: Host de la base de datos.
- DB_USERNAME: nombre de usuario de la base de datos.
- DB_PASSWORD: contraseña de la base de datos.
- DB_DATABASE: nombre de la base de datos.
- DB_PORT: puerto de despliegue de la base de datos.
- PATH_SUBDOMAIN: `api` - mantener.

**Configuración para módulo de autenticación**
- JWT_SECRET: Llave para generar los tokens de autorización. Genera una llave fuerte para producción.
- JWT_EXPIRES_IN: Tiempo de expiración del token de autorización en milisegundos.
- REFRESH_TOKEN_NAME: `jid`
- REFRESH_TOKEN_EXPIRES_IN: tiempo en milisegundos
- REFRESH_TOKEN_ROTATE_IN: tiempo en milisegundos
- REFRESH_TOKEN_SECURE: `false`
- REFRESH_TOKEN_DOMAIN: dominio de despligue
- REFRESH_TOKEN_PATH: `/`

**Configuración para el servicio de Mensajería Electrónica (Alertín), si se utiliza en el sistema**
- MSJ_URL: URL de consumo al servicio de Mensajería Electrónico (Alertín).
- MSJ_TOKEN: TOKEN de consumo al servicio de Mensajería Electrónico (Alertín).

**Configuración para el servicio SEGIP de IOP, si corresponde**
- IOP_SEGIP_URL: URL de consumo al servicio interoperabilidad de SEGIP.
- IOP_SEGIP_TOKEN: Token de consumo al servicio interoperabilidad de SEGIP.

**Configuración para el servicio del proveedor de ejecutables**
- EMPAQUETADO_URL: URL de consumo al servicio del proveedor de ejecutables.
- EMPAQUETADO_TOKEN: Token de consumo al servicio del proveedor de ejecutables.
  Se obtiene luego de ejecutar el comando `npm run token` desde el directorio donde se encuentra instalado el proveedor `minedu-olimpiadas-proveedor-offline`.
- EMPAQUETADO_LLAVE: Clave de cifrado de datos para encriptar los datos con el aplicativo desktop.
  DEBE SER UNA CADENA DE TEXTO DE 16 CARACTERES y es la misma clave que aparece en `minedu-olimpiadas-proveedor-offline` y `minedu-olimpiadas-desktop`.

**Configurar la URL del frontend, según el ambiente de despliegue**
- URL_FRONTEND: dominio en el que se encuentra levantado el frontend, si corresponde.

**Configuración para almacenamiento de archivos**
- PDF_PATH: ruta en el que se almacenarán los archivos, si corresponde.
- EXAMENES_OFFLINE: ruta absoluta del directorio donde se subiran los archivos de los examens offline
- UPLOAD_FILES_PATH: ruta absoluta del directorio donde se subiran los archivos de importación de preguntas y estudiantes
- SERVER_IMAGES_UPLOAD: ruta absoluta del directorio compartido donde se almacenarán las imágenes
- SERVER_IMAGES_UPLOAD_SIZE: tamaño máximo de archivo permitido en kB (kiloBytes)
- SERVER_IMAGES_UPLOAD_WIDTH=: ancho máximo de imágen permitido en pixeles
- SERVER_IMAGES_UPLOAD_HEIGHT=: alto máximo de imágen permitido en pixeles
- SERVER_IMAGES_UPLOAD_EXT: Extensiones permitidas ej: jpg,jpeg

**Configuración de Logs, según el ambiente**
- LOG_PATH:
- LOG_HIDE:request.headers.host request.headers.authorization request.body.contrasena
- LOG_URL:
- LOG_URL_TOKEN:
- LOG_PATH:
- LOG_STD_OUT:
- REFRESH_TOKEN_REVISIONS=`*/5 * * * *`


### 5. Crear la estructura de la base de datos

Si se genera la base de datos por primera vez o se necesita restablecer, ejecutar:

```
npm run setup
```

Si se necesitan ejecutar los comandos individualmente, ejecutar dependiente de la necesidad (generalmente para actualizaciones):

- Generación de migraciones
```
$ npm run migrations:generate <nombre-migracion>
```
- Ejecución de migraciones
```
$ npm run migrations:run
```
- Ejecucion de seeders
```
$ npm run seeds:run
```

## Ejecución manual

- Ejecución en modo desarrollo
```bash
# development
$ npm run start
```
- Ejecución en modo desarrollo (live-reload)
```bash
# watch mode
$ npm run start:dev
```
- Ejecución en modo PRODUCCIÓN
```bash
# production mode
$ npm run start:prod
```

### Iniciar aplicación para producción

Generar archivos para producción.

```
$ npm run build
```

Iniciar y guardar autoreinicio en el manejador de procesos PM2.

```
$ env NODE_ENV=production pm2 start dist/src/main.js --name "olimpiada-api"
$ pm2 save
$ pm2 startup
[PM2] Init System found: systemd
[PM2] To setup the Startup Script, copy/paste the following command:
sudo env PATH=$PATH:/home/usuario/.nvm/versions/node/v14.16.1/bin /home/usuario/.nvm/versions/node/v14.16.1/lib/node_modules/pm2/bin/pm2 startup systemd -u usuario --hp /home/usuario
```

### Verificar estado del servicio

```
$ curl http://localhost:3000/api/estado
{"estado":"Servicio funcionando correctamente","hora":1619626685000}
```
