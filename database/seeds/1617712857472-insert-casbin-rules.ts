import { CasbinRule } from 'src/core/authorization/entity/casbin.entity';
import { RolEnum } from 'src/core/authorization/rol.enum';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class insertCasbinRules1617712857472 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      // < --------------- FRONTEND ---------------------->

      // /configuraciones
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/configuraciones',
        v2: 'read',
        v3: 'frontend',
      },

      // /politicas
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/politicas',
        v2: 'create|update|read|delete',
        v3: 'frontend',
      },

      // /parametros
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/parametros',
        v2: 'read',
        v3: 'frontend',
      },

      // /home
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/home',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/home',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DISTRITO,
        v1: '/home',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/home',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/home',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.COMITE_DEPARTAMENTAL,
        v1: '/home',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_VERIFICADOR,
        v1: '/home',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.DIRECTOR,
        v1: '/home',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DEPARTAMENTAL,
        v1: '/home',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.ESTUDIANTE,
        v1: '/home',
        v2: 'read|update',
        v3: 'frontend',
      },

      // /perfil
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/perfil',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/perfil',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DISTRITO,
        v1: '/perfil',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/perfil',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/perfil',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.COMITE_DEPARTAMENTAL,
        v1: '/perfil',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_VERIFICADOR,
        v1: '/perfil',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.DIRECTOR,
        v1: '/perfil',
        v2: 'read|update',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DEPARTAMENTAL,
        v1: '/perfil',
        v2: 'read|update',
        v3: 'frontend',
      },

      // /usuarios
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/usuarios',
        v2: 'read|update|create|inactivate|activate|restore_password',
        v3: 'frontend',
      },

      // /areas
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/areas',
        v2: 'read|update|create|delete',
        v3: 'frontend',
      },

      // /grados-escolares
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/grados-escolares',
        v2: 'read|update|create|delete',
        v3: 'frontend',
      },

      // /distritos
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/distritos',
        v2: 'read|update|create|delete',
        v3: 'frontend',
      },

      // /unidades-educativas
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/unidades-educativas',
        v2: 'read|update|create|delete|batch_upload',
        v3: 'frontend',
      },

      // /olimpiadas
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/olimpiadas',
        v2: 'read|update|create|delete',
        v3: 'frontend',
      },

      // /etapas
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/etapas',
        v2: 'read|update|create|delete',
        v3: 'frontend',
      },

      // /etapa-areas-grados
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/etapas-areas-grados',
        v2: 'read|update|create|delete',
        v3: 'frontend',
      },

      // /banco-preguntas
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/banco-preguntas',
        v2: 'read|search',
        v3: 'frontend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/banco-preguntas',
        v2: 'read|update|create|delete|search|batch_upload|verify|correction',
        v3: 'frontend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_VERIFICADOR,
        v1: '/banco-preguntas',
        v2: 'read|review-and-approve',
        v3: 'frontend',
      },

      // /inscripciones
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/inscripciones',
        v2: 'read|update|create|search|inactivate|activate|batch_upload',
        v3: 'frontend',
      },

      // /examen-offline
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/examen-offline',
        v2: 'read|search|upload|download',
        v3: 'frontend',
      },
      {
        v0: RolEnum.DIRECTOR,
        v1: '/examen-offline',
        v2: 'read|search|download_exe|upload|download',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DEPARTAMENTAL,
        v1: '/examen-offline',
        v2: 'read|search|download_exe|upload|download',
        v3: 'frontend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DISTRITO,
        v1: '/examen-offline',
        v2: 'read|search|download_exe|upload|download',
        v3: 'frontend',
      },

      // /reiniciar-prueba
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/reinicio-pruebas-online',
        v2: 'read|search|restart',
        v3: 'frontend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/reinicio-pruebas-online',
        v2: 'read|search|restart',
        v3: 'frontend',
      },

      // /calificacion-publicacion
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/calificacion-publicacion',
        v2: 'read|search|download|publish',
        v3: 'frontend',
      },

      // /impugnacion
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/impugnacion',
        v2: 'read|update|search|anular',
        v3: 'frontend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/impugnacion',
        v2: 'read|update|search|anular',
        v3: 'frontend',
      },

      // /obtencion-clasificados
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/obtener-clasificados',
        v2: 'read|download|generate',
        v3: 'frontend',
      },

      // /gestion-competencias

      // /comite-departamental
      {
        v0: RolEnum.COMITE_DEPARTAMENTAL,
        v1: '/comite-departamental',
        v2: 'read|download|generate|assign',
        v3: 'frontend',
      },

      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/competencias',
        v2: 'read',
        v3: 'frontend',
      },
      // ESTUDIANTE
      {
        v0: RolEnum.ESTUDIANTE,
        v1: '/examen',
        v2: 'read|init',
        v3: 'frontend',
      },
      {
        v0: RolEnum.ESTUDIANTE,
        v1: '/respuestas',
        v2: 'read|init',
        v3: 'frontend',
      },

      // /clasificados
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/clasificados',
        v2: 'read|init',
        v3: 'frontend',
      },

      // /medalleros-generar
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/medalleros-generar',
        v2: 'generate|read|init',
        v3: 'frontend',
      },
      {
        v0: RolEnum.COMITE_DEPARTAMENTAL,
        v1: '/medalleros-generar',
        v2: 'read|init|update|acta',
        v3: 'frontend',
      },

      // /clasificados
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/clasificados',
        v2: 'read|init',
        v3: 'frontend',
      },

      // /ver-clasificados
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/ver-clasificados',
        v2: 'read|init',
        v3: 'frontend',
      },
      // /reportes
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/reportes',
        v2: 'read',
        v3: 'frontend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/reportes',
        v2: 'read',
        v3: 'frontend',
      },

      // /reprogramacion-rezagados
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/reprogramacion-rezagados',
        v2: 'read',
        v3: 'frontend',
      },

      // < --------------- BACKEND ---------------------->
      // EMPEZANDO
      // /*/usuarios
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/usuarios',
        v2: 'GET|POST',
        v3: 'backend',
      },

      // /*/usuarios/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/usuarios/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/usuarios/perfil
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/usuarios/perfil',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/usuarios/perfil',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DISTRITO,
        v1: '/*/usuarios/perfil',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/*/usuarios/perfil',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/*/usuarios/perfil',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DEPARTAMENTAL,
        v1: '/*/usuarios/perfil',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_VERIFICADOR,
        v1: '/*/usuarios/perfil',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.DIRECTOR,
        v1: '/*/usuarios/perfil',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DEPARTAMENTAL,
        v1: '/*/usuarios/perfil',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/usuarios/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/usuarios/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/usuarios/contrasena/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/usuarios/contrasena/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/usuarios/inactivacion/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/usuarios/inactivacion/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/usuarios/activacion/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/usuarios/activacion/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/roles
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/roles',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/authorization/politicas
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/autorizacion/politicas',
        v2: 'GET|POST|PATCH|DELETE',
        v3: 'backend',
      },

      // /autorizacion/politicas/roles
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/autorizacion/politicas/roles',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/autorizacion/politicas/roles',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/*/autorizacion/politicas/roles',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_VERIFICADOR,
        v1: '/*/autorizacion/politicas/roles',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.DIRECTOR,
        v1: '/*/autorizacion/politicas/roles',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DEPARTAMENTAL,
        v1: '/*/autorizacion/politicas/roles',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DISTRITO,
        v1: '/*/autorizacion/politicas/roles',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DEPARTAMENTAL,
        v1: '/*/autorizacion/politicas/roles',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/*/autorizacion/politicas/roles',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.ESTUDIANTE,
        v1: '/*/autorizacion/politicas/roles',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/usuarios
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/usuarios',
        v2: 'GET|POST',
        v3: 'backend',
      },

      // /*/usuarios/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/usuarios/:id',
        v2: 'GET|PATCH',
        v3: 'backend',
      },

      // /*/usuarios/inactivacion/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/usuarios/inactivacion/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/usuarios/activacion/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/usuarios/activacion/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/areas
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/areas',
        v2: 'GET|POST',
        v3: 'backend',
      },

      // /*/areas/listar
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/areas/listar',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/areas',
        v2: 'GET',
        v3: 'backend',
      },
      // /*/areas/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/areas/:id',
        v2: 'PATCH|DELETE',
        v3: 'backend',
      },

      // /*/areas/inactivacion/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/areas/inactivacion/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/areas/activacion/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/areas/activacion/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/grados-escolares
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/grados-escolares',
        v2: 'GET|POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/grados-escolares',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/*/grados-escolares',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_VERIFICADOR,
        v1: '/*/grados-escolares',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/*/grados-escolares',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/grados-escolares/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/grados-escolares/:id',
        v2: 'PATCH|DELETE|GET',
        v3: 'backend',
      },

      // /*/grados-escolares/inactivacion/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/grados-escolares/inactivacion/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/grados-escolares/activacion/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/grados-escolares/activacion/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/distritos
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/distritos',
        v2: 'GET|POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/distritos',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.DIRECTOR,
        v1: '/*/distritos',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DEPARTAMENTAL,
        v1: '/*/distritos',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DISTRITO,
        v1: '/*/distritos',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/*/distritos',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/distritos/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/distritos/:id',
        v2: 'PATCH|DELETE|GET',
        v3: 'backend',
      },

      // /*/distritos/inactivacion/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/distritos/inactivacion/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/distritos/activacion/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/distritos/activacion/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/unidades-educativas
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/unidades-educativas',
        v2: 'GET|POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/unidades-educativas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.DIRECTOR,
        v1: '/*/unidades-educativas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DEPARTAMENTAL,
        v1: '/*/unidades-educativas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DISTRITO,
        v1: '/*/unidades-educativas',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/unidades-educativas/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/unidades-educativas/:id',
        v2: 'PATCH|DELETE|GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/unidades-educativas/:id',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.DIRECTOR,
        v1: '/*/unidades-educativas/:id',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DISTRITO,
        v1: '/*/unidades-educativas/:id',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/unidades-educativas/inactivacion/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/unidades-educativas/inactivacion/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/unidades-educativas/activacion/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/unidades-educativas/activacion/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/olimpiadas
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/olimpiadas',
        v2: 'GET|POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/olimpiadas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/*/olimpiadas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_VERIFICADOR,
        v1: '/*/olimpiadas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.DIRECTOR,
        v1: '/*/olimpiadas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DEPARTAMENTAL,
        v1: '/*/olimpiadas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DISTRITO,
        v1: '/*/olimpiadas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.ESTUDIANTE,
        v1: '/*/olimpiadas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DEPARTAMENTAL,
        v1: '/*/olimpiadas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/*/olimpiadas',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/olimpiadas/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/olimpiadas/:id',
        v2: 'PATCH|DELETE',
        v3: 'backend',
      },

      // /*/olimpiadas
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/olimpiadas/listar',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/olimpiadas/:id/etapas
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/olimpiadas/:id/etapas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.DIRECTOR,
        v1: '/*/olimpiadas/:id/etapas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DEPARTAMENTAL,
        v1: '/*/olimpiadas/:id/etapas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DISTRITO,
        v1: '/*/olimpiadas/:id/etapas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DEPARTAMENTAL,
        v1: '/*/olimpiadas/:id/etapas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/*/olimpiadas/:id/etapas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.ESTUDIANTE,
        v1: '/*/olimpiadas/:id/etapas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/*/olimpiadas/:id/etapas',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/olimpiadas/inactivacion/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/olimpiadas/inactivacion/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/olimpiadas/activacion/:id
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/olimpiadas/activacion/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/olimpiadas/:id/etapas
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/olimpiadas/:id/etapas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/olimpiadas/:id/etapas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/*/olimpiadas/:id/etapas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_VERIFICADOR,
        v1: '/*/olimpiadas/:id/etapas',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/etapas
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapas',
        v2: 'GET|POST',
        v3: 'backend',
      },

      // /*/etapas/:id
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapas/:id',
        v2: 'PATCH|DELETE|GET',
        v3: 'backend',
      },

      // /*/etapas/:id/estados
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapas/:id/estados',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/etapas/:id/rezagados
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapas/:id/rezagados',
        v2: 'GET|POST',
        v3: 'backend',
      },
      // /*/etapas/:id/sorteoPreguntas/rezagados
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapas/:id/sorteoPreguntas/rezagados',
        v2: 'POST',
        v3: 'backend',
      },

      // /*/etapas/cerrar/:id
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapas/cerrar/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/etapas/:id/sorteoPreguntas
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapas/:id/sorteoPreguntas',
        v2: 'POST',
        v3: 'backend',
      },

      // /*/etapas/:id/etapaAreaGrados
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/etapas/:id/etapaAreaGrados',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapas/:id/etapaAreaGrados',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/*/etapas/:id/etapaAreaGrados',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_VERIFICADOR,
        v1: '/*/etapas/:id/etapaAreaGrados',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.DIRECTOR,
        v1: '/*/etapas/:id/etapaAreaGrados',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DEPARTAMENTAL,
        v1: '/*/etapas/:id/etapaAreaGrados',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DISTRITO,
        v1: '/*/etapas/:id/etapaAreaGrados',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DEPARTAMENTAL,
        v1: '/*/etapas/:id/etapaAreaGrados',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/*/etapas/:id/etapaAreaGrados',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.ESTUDIANTE,
        v1: '/*/etapas/:id/etapaAreaGrados',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/*/etapas/:id/etapaAreaGrados',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/etapas/:id/calendarios
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapas/:id/calendarios',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/etapas/:id/operaciones
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapas/:id/operaciones',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/etapas/:id/etapasAreaGrado
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapas/:id/etapasAreaGrado',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/etapa/:id/preguntas/resumenEstados
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapa/:id/preguntas/resumenEstados',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/departamentos
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/departamentos',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/departamentos',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.DIRECTOR,
        v1: '/*/departamentos',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DEPARTAMENTAL,
        v1: '/*/departamentos',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DISTRITO,
        v1: '/*/departamentos',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/*/departamentos',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/departamentos/secciones
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/departamentos/secciones',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/departamentos/localidades
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/departamentos/localidades',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/examenesAdministracion/offline
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/examenesAdministracion/offline',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.DIRECTOR,
        v1: '/*/examenesAdministracion/offline',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DEPARTAMENTAL,
        v1: '/*/examenesAdministracion/offline',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.TECNICO_SIE_DISTRITO,
        v1: '/*/examenesAdministracion/offline',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/calificaciones/etapas/:id
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/calificaciones/etapas/:id',
        v2: 'GET|PATCH',
        v3: 'backend',
      },

      // /*/calendarios/:id
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/calendarios/:id',
        v2: 'PUT|DELETE',
        v3: 'backend',
      },

      // /*/calendarios/tiposPlanificacion
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/calendarios/tiposPlanificacion',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/etapasAreaGrado
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapasAreaGrado',
        v2: 'GET|POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapasAreaGrado/:id',
        v2: 'PATCH|GET|DELETE',
        v3: 'backend',
      },

      // /*/etapasAreaGrado/inactivacion/:id
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapasAreaGrado/inactivacion/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/etapasAreaGrado/activacion/:id
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapasAreaGrado/activacion/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/etapasAreaGrado/:id/preguntas
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapasAreaGrado/:id/preguntas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/*/etapasAreaGrado/:id/preguntas',
        v2: 'GET|POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_VERIFICADOR,
        v1: '/*/etapasAreaGrado/:id/preguntas',
        v2: 'GET|POST',
        v3: 'backend',
      },

      // /*/etapasAreaGrado/:id/inscripciones
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapasAreaGrado/:id/inscripciones',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/etapasAreaGrado/:id/calendariosOnline
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapasAreaGrado/:id/calendariosOnline',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/etapasAreaGrado/:id/calendarios
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapasAreaGrado/:id/calendarios',
        v2: 'POST',
        v3: 'backend',
      },

      // /*/etapasAreaGrado/:id/preguntas/envioLotes
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/*/etapasAreaGrado/:id/preguntas/envioLotes',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/etapasAreaGrado/:id/medalleroPosiciones
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapasAreaGrado/:id/medalleroPosiciones',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/etapasAreaGrado/:id/medalleroPosicionesRurales
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/etapasAreaGrado/:id/medalleroPosicionesRurales',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/preguntas/:id
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/preguntas/:id',
        v2: 'PUT|DELETE',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/*/preguntas/:id',
        v2: 'PUT|DELETE',
        v3: 'backend',
      },

      // /*/preguntas/imagenes
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/*/preguntas/imagenes',
        v2: 'GET|POST',
        v3: 'backend',
      },
      // /*/preguntas/imagenes/carpetas
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/*/preguntas/imagenes/carpetas',
        v2: 'GET|POST',
        v3: 'backend',
      },
      // /*/preguntas/imagenes/archivos
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/*/preguntas/imagenes/archivos',
        v2: 'GET|POST',
        v3: 'backend',
      },

      // /*/preguntas/:id/estados
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/preguntas/:id/estados',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/*/preguntas/:id/estados',
        v2: 'PATCH',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_VERIFICADOR,
        v1: '/*/preguntas/:id/estados',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/preguntas/:id/estado
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/*/preguntas/:id/estado',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/preguntas/:id/estado',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/preguntas/tipoPreguntas
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/preguntas/tipoPreguntas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/*/preguntas/tipoPreguntas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_VERIFICADOR,
        v1: '/*/preguntas/tipoPreguntas',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/preguntas/tipoRespuestas
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/preguntas/tipoRespuestas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/*/preguntas/tipoRespuestas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_VERIFICADOR,
        v1: '/*/preguntas/tipoRespuestas',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/preguntas/nivelesDificultad
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/preguntas/nivelesDificultad',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/*/preguntas/nivelesDificultad',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_VERIFICADOR,
        v1: '/*/preguntas/nivelesDificultad',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/preguntas/descargarEjemplo
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/preguntas/descargarEjemplo',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/*/preguntas/descargarEjemplo',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/preguntas/subirFragmento
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/preguntas/subirFragmento',
        v2: 'GET|POST',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DOCENTE_CARGA,
        v1: '/*/preguntas/subirFragmento',
        v2: 'GET|POST',
        v3: 'backend',
      },

      // /*/preguntas/:id/impugnacion
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/preguntas/:id/impugnacion',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/inscripciones
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/inscripciones',
        v2: 'GET|POST',
        v3: 'backend',
      },

      // /*/inscripciones/:id
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/inscripciones/:id',
        v2: 'PATCH|GET|DELETE',
        v3: 'backend',
      },

      // /*/inscripciones/inactivacion/:id
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/inscripciones/inactivacion/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/inscripciones/activacion/:id
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/inscripciones/activacion/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/estudiantes
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/estudiantes',
        v2: 'GET|POST',
        v3: 'backend',
      },

      // /*/estudiantes/:id
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/estudiantes/:id',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/estudiantes/:id/olimpiadas
      {
        v0: RolEnum.ESTUDIANTE,
        v1: '/*/estudiantes/:id/olimpiadas',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/estudiantes/:id/detalles
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/estudiantes/:id/detalles',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.ESTUDIANTE,
        v1: '/*/estudiantes/:id/detalles',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/estudiantes/:id/examenes/calendarios
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/estudiantes/:id/examenes/calendarios',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.ESTUDIANTE,
        v1: '/*/estudiantes/:id/examenes/calendarios',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/estudiantes/:id/examenes/historicos
      {
        v0: RolEnum.ESTUDIANTE,
        v1: '/*/estudiantes/:id/examenes/historicos',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/estudiantes/:id/examenes
      {
        v0: RolEnum.ESTUDIANTE,
        v1: '/*/estudiantes/:id/examenes',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/examenes/:id
      {
        v0: RolEnum.ESTUDIANTE,
        v1: '/*/examenes/:id',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/examenes/:id/calificacion
      {
        v0: RolEnum.ESTUDIANTE,
        v1: '/*/examenes/:id/calificacion',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/examenes/detalle/:id
      {
        v0: RolEnum.ESTUDIANTE,
        v1: '/*/examenes/detalle/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/examenes/:id/iniciar
      {
        v0: RolEnum.ESTUDIANTE,
        v1: '/*/examenes/:id/iniciar',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/examenes/:id/finalizar
      {
        v0: RolEnum.ESTUDIANTE,
        v1: '/*/examenes/:id/finalizar',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/examenes/:id/reiniciar
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/examenes/:id/reiniciar',
        v2: 'GET|POST',
        v3: 'backend',
      },

      // /*/examenes/:id/comprobantes
      {
        v0: RolEnum.ESTUDIANTE,
        v1: '/*/examenes/:id/comprobantes',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/localidades
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/localidades',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/secciones
      {
        v0: RolEnum.SUPER_ADMIN,
        v1: '/*/secciones',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/medallero/etapa/:id
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/medallero/etapa/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/medallero/etapa/:id/listar
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/medallero/etapa/:id/listar',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DEPARTAMENTAL,
        v1: '/*/medallero/etapa/:id/listar',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/medallero/etapaAreaGrado/:id
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/medallero/etapaAreaGrado/:id',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.COMITE_DEPARTAMENTAL,
        v1: '/*/medallero/etapaAreaGrado/:id',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/medallero/comiteDepartamental
      {
        v0: RolEnum.COMITE_DEPARTAMENTAL,
        v1: '/*/medallero/comiteDepartamental',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/medallero/etapa/:idEtapa/acta
      {
        v0: RolEnum.COMITE_DEPARTAMENTAL,
        v1: '/*/medallero/etapa/:idEtapa/acta',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/medallero/verificar/etapa/:id
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/medallero/verificar/etapa/:id',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/clasificados/etapa/:id
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/clasificados/etapa/:id',
        v2: 'PATCH',
        v3: 'backend',
      },

      // /*/reporte/frecuencia-porcentaje
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/reporte/frecuencia-porcentaje',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/*/reporte/frecuencia-porcentaje',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/reporte/promedio/departamento-area
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/reporte/promedio/departamento-area',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/*/reporte/promedio/departamento-area',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/reporte/promedio/anio-escolaridad/departameto-area
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/reporte/promedio/anio-escolaridad/departamento-area',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/*/reporte/promedio/anio-escolaridad/departamento-area',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/reporte/preguntas
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/reporte/preguntas',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/*/reporte/preguntas',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/reporte/preguntas/area-grado
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/reporte/preguntas/area-grado',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/*/reporte/preguntas/area-grado',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/reporte/frecuencia-porcentaje
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/reporte/participacion',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/*/reporte/participacion',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/reporte/participacion/tipo-prueba
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/reporte/participacion/tipo-prueba',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/*/reporte/participacion/tipo-prueba',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/reporte/clasificados
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/reporte/clasificados',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/*/reporte/clasificados',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/reporte/medalleros/area
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/reporte/medalleros/area',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/*/reporte/medalleros/area',
        v2: 'GET',
        v3: 'backend',
      },

      // /*/reporte/medalleros/departamento
      {
        v0: RolEnum.ADMINISTRADOR,
        v1: '/*/reporte/medalleros/departamento',
        v2: 'GET',
        v3: 'backend',
      },
      {
        v0: RolEnum.CONSULTA,
        v1: '/*/reporte/medalleros/departamento',
        v2: 'GET',
        v3: 'backend',
      },
    ];
    const casbin = items.map((item) => {
      const c = new CasbinRule();
      c.ptype = 'p';
      c.v0 = item.v0;
      c.v1 = item.v1;
      c.v2 = item.v2;
      c.v3 = item.v3;
      return c;
    });
    await queryRunner.manager.save(casbin);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
