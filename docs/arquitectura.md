# Proyecto base Backend

## Estructura de directorios

```
.
├─docs                          # directorio con la documentacion del proyecto
├─scripts                       # directorio con scripts
├─src
|  ├── application              # directorio con logica de negocio de la aplicacion 
|  |    ├── modulo1
|  |    ├── ...
|  |    └── moduloN                       
|  ├── common                   # directorio con modulos comunes (utilitarios, contantes, etc)
|  |    ├── constants
|  |    ├── dto
|  |    ├── exceptions
|  |    ├── filters
|  |    ├── interceptors
|  |    ├── helpers
|  |    ├── lib
|  |    └── serializers
|  ├── core                     # directorio con modulos del nucleo del proyecto base
|  |    ├── authentication      # Modulo de autenticacion
|  |    ├── authorization       # Modulo de autorizacion
|  |    ├── config              # Modulo de configuraciones base
|  |    |    ├── authorization
|  |    |    ├── database
|  |    |    └── logger
|  |    └── external-services   # Modulo de servicios externos
|  |    |    ├── iop
|  |    |    └── mensajeria
|  ├── templates
|  ├── app.controller.ts
|  ├── app.module.ts        # Modulo principal de composicion de otros modulos
|  └── main.ts              # Archivo principal de aplicacion
├──test                     # Directorio con test de integracion
├──.Dockerignore
├──.env.example             # Archivo con variables de entorno
├──.eslintrc.js
├──.gitignore
├──.gitlab-ci.yml
├──.prettierc
├──Dockerfile
├──LICENSE
├──nest-cli.json
├──ormconfig.ts
├──package-lock.json
├──package.json
├──README.md
├──tsconfig.build.json
└──tsconfig.json

```
## Diagrama ERD
![Diagrama ERD](ERD.png "Diagrama")

## Estructura Modular