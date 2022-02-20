# Instalación del Servidor Media

```
 ___________        ________________           _______________
| navegador | ----> | servidor_nginx | -----> | almacenamiento |
|___________| https |_____cliente____|  nfs   |________________|
                                                     ^
                                                     |
                                                     | nfs
                                               _____________
                                              |   backend   |
                                              |___cliente___|
```

---

## Requerimientos para servicio de almacenamiento.

Sistema Operativo TrueNAS como servicio de almacenamiento, correctamente configurado con todas las medidas de seguridad necesarias.

1. [TrueNAS](https://www.truenas.com/)

> Ejemplo de [configuracion básica del servicio](Configuracion_basica_TrueNAS.pdf)

---

## Requerimientos para el cliente de acceso a la carpeta compartida.

Se necesita contar con las siguientes paquetes instalados, se recomienda revisar la documentación oficial:

1. [Node y Npm](https://github.com/nodesource/distributions/blob/master/README.md)
2. [NVM](https://github.com/nvm-sh/nvm) Se recomienda NVM solo para ambientes de DESARROLLO.
3. [Manejador de procesos PM2](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)
4. [Nginx](https://www.nginx.com/)
5. Cliente NFS, `$ apt-get install nfs-common`

---

## Montar la carpeta compartida del servicio de almacenamiento en el cliente

```
$ mount [ip_servicio_nfs]:/[ruta_carpeta_compartida] /home/usuario/nfs_imagenes
```

### Configurar Nginx para el acceso a la carpeta

Instalar nginx

```
$ apt-get install nginx nginx-extras
```

Archivo `/etc/nginx/sites-enabled/default`

```
  # Es necesario limitar el acceso como por ejemplo
  if ( $http_referer !~* (dominio.gob.bo) ) {
    return 403;
  }
  server_tokens off;
  more_set_headers 'Server: Sector 7G';

  add_header 'X-Content-Type-Options'    'nosniff';
  add_header 'Strict-Transport-Security' 'max-age=15724800; includeSubdomains';
  add_header 'X-Frame-Options'           'DENY';
  add_header 'Cache-Control'             'no-store';

  location / {
    autoindex off;
    try_files $uri $uri/ =404;
  }

  location /media/ {
    autoindex off;
    alias /home/usuario/nfs_imagenes/;
  }
```

### Subir imágenes hasta 3 MB aprox.

Para la subida de imágenes debe estar correctamente configurados los proxys correspondientes

Por ejemplo para proxy Nginx editar el archivo `/etc/nginx/nginx.conf`, para subir imagenes de hasta ~3 MB

```
  http {
    client_max_body_size 4M;
  }
```
