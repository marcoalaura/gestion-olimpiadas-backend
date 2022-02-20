import { MigrationInterface, QueryRunner, SimpleConsoleLogger} from 'typeorm';

// Utils
import { TextService } from 'src/common/lib/text.service';

// Faker functions
import {
  name as fkName,
  datatype as fkDatatype,
  company as fkCompany,
  lorem as fkLorem
} from 'faker';

// Entities
import { Usuario } from '../../src/application/usuario/usuario.entity';
import { UsuarioRol } from '../../src/core/authorization/entity/usuario-rol.entity';
import { Persona } from '../../src/application/persona/persona.entity';
import { Olimpiada } from '../../src/application/olimpiada/entity/Olimpiada.entity';
import { Etapa } from '../../src/application/olimpiada/entity/Etapa.entity';
import { Area } from '../../src/application/olimpiada/entity/Area.entity';
import { GradoEscolaridad } from '../../src/application/olimpiada/entity/GradoEscolaridad.entity';
import { EtapaAreaGrado } from '../../src/application/olimpiada/entity/EtapaAreaGrado.entity';
import { Calendario } from '../../src/application/olimpiada/entity/Calendario.entity';
import { Distrito } from '../../src/application/olimpiada/entity/Distrito.entity';
import { UnidadEducativa } from '../../src/application/olimpiada/entity/UnidadEducativa.entity';
import { Rol } from '../../src/core/authorization/entity/rol.entity';
import { Estudiante } from '../../src/application/olimpiada/entity/Estudiante.entity';
import { Inscripcion } from '../../src/application/olimpiada/entity/Inscripcion.entity';
import { MedalleroPosicion } from '../../src/application/olimpiada/entity/MedalleroPosicion.entity';
import { MedalleroPosicionRural } from '../../src/application/olimpiada/entity/MedalleroPosicionRural.entity';
import { Pregunta } from '../../src/application/olimpiada/entity/Pregunta.entity';
import { v4 } from 'uuid';
import { EstudianteExamenDetalle } from '../../src/application/olimpiada/entity/EstudianteExamenDetalle.entity';
import { EstudianteExamen } from '../../src/application/olimpiada/entity/EstudianteExamen.entity';
// Types and constants
import {
  tiposEtapa,
  Status,
  TipoRespuesta,
  NivelDificultad,
  TipoPregunta,
  TipoPlanificacion,
  // tiposAreasGeograficas,
  // tiposUnidadesEducativas
} from '../../src/common/constants';
import { RolEnum } from 'src/core/authorization/rol.enum';
export class fakePreguntasTextoImagen1627667477306 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const INITIAL = parseInt(process.env.CARGA_INDICE_INICIAL) || 1500;
    const NRO_UNIDADES_EDUCATIVAS = parseInt(process.env.NRO_UNIDADES_EDUCATIVAS) || 100;
    const NRO_ESTUDIANTES = parseInt(process.env.NRO_ESTUDIANTES_X_UE) || 100;
    const NRO_PREGUNTAS = parseInt(process.env.NRO_PREGUNTAS_X_EXM) || 20;

    // Datos base para imagenes
    const NRO_IMAGENES = parseInt(process.env.NRO_IMAGENES) || 200;
    const INDICE_IMAGENES = parseInt(process.env.INDICE_IMAGENES) || 5000;
    const INICIALES_IMG = process.env.INICIALES_IMG || 'AAGCS2021';
    const NOMBRE_CARPETA_IMG = process.env.NOMBRE_CARPETA_CARGA || 'olimpiada-carga-aagcs';


    const fecha = new Date();
    const DEFAULT_PASS = '123';
    const pass = await TextService.encrypt(DEFAULT_PASS);
    const _olimpiada = new Olimpiada();
    _olimpiada.id = TextService.textToUuid(`olimpiada-carga-${INITIAL}`);


    /**
     * Preguntas - EAG
     * 
     */
    let preguntas: Pregunta[] = [];

    const tam = parseInt(process.env.NRO_PREGUNTAS) || 20;;
    // PREGUNTAS NIVEL BASICO
      for (let idx = 0; idx < tam; idx++) {
        //PREGUNTA CURRICULA FALSO VERDADERO
        let _pregunta = new Pregunta();
        _pregunta.id = TextService.generateUuid();
        _pregunta.tipoRespuesta = TipoRespuesta.FALSO_VERDADERO;
        _pregunta.tipoPregunta = TipoPregunta.CURRICULA;
        _pregunta.nivelDificultad = NivelDificultad.BAJA;
        _pregunta.textoPregunta = `PREGUNTA CURRICULA BAJA FV - ${idx}`;
        _pregunta.respuestas = ['FALSO'];
        _pregunta.opciones = null;
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-fisica-${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
        _pregunta.imagenPregunta = Math.random() < 0.2 ? `/${NOMBRE_CARPETA_IMG}/${INICIALES_IMG}-${Math.floor(Math.random() * ((INDICE_IMAGENES + NRO_IMAGENES - 1) - INDICE_IMAGENES + 1)) + INDICE_IMAGENES}.jpg` : null;
  
        await queryRunner.manager.save(_pregunta);  
        console.log(_pregunta);
  
        //PREGUNTA CURRICULA SELECCION SIMPLE
        _pregunta = new Pregunta();
        _pregunta.id = TextService.generateUuid();
        _pregunta.tipoRespuesta = TipoRespuesta.SELECCION_SIMPLE;
        _pregunta.tipoPregunta = TipoPregunta.CURRICULA;
        _pregunta.nivelDificultad = NivelDificultad.BAJA;
        _pregunta.textoPregunta = `PREGUNTA CURRICULA BAJA SS - ${idx}`;
        _pregunta.respuestas = ['b'];
        _pregunta.opciones = {
          a: 'Respuesta a',
          b: 'Respuesta b',
          c: 'Respuesta c',
          d: 'Respuesta d',
          e: 'Respuesta e',
        };
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-fisica-${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
        _pregunta.imagenPregunta = Math.random() < 0.2 ? `/${NOMBRE_CARPETA_IMG}/${INICIALES_IMG}-${Math.floor(Math.random() * ((INDICE_IMAGENES + NRO_IMAGENES - 1) - INDICE_IMAGENES + 1)) + INDICE_IMAGENES}.jpg` : null;
  
        await queryRunner.manager.save(_pregunta);  
        console.log(_pregunta);
        //PREGUNTA CURRICULA SELECCION MULTIPLE
        _pregunta = new Pregunta();
        _pregunta.id = TextService.generateUuid();
        _pregunta.tipoRespuesta = TipoRespuesta.SELECCION_MULTIPLE;
        _pregunta.tipoPregunta = TipoPregunta.CURRICULA;
        _pregunta.nivelDificultad = NivelDificultad.BAJA;
        _pregunta.textoPregunta = `PREGUNTA CURRICULA BAJA SM - ${idx}`;
        _pregunta.respuestas = ['b', 'c'];
        _pregunta.opciones = {
          a: 'Respuesta a',
          b: 'Respuesta b',
          c: 'Respuesta c',
          d: 'Respuesta d',
          e: 'Respuesta e',
        };
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-fisica-${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
        _pregunta.imagenPregunta = Math.random() < 0.2 ? `/${NOMBRE_CARPETA_IMG}/${INICIALES_IMG}-${Math.floor(Math.random() * ((INDICE_IMAGENES + NRO_IMAGENES - 1) - INDICE_IMAGENES + 1)) + INDICE_IMAGENES}.jpg` : null;

        await queryRunner.manager.save(_pregunta);  
  
        //PREGUNTAS OLIMPIADA
        //PREGUNTA OLIMPIADA FALSO VERDADERO
        _pregunta = new Pregunta();
        _pregunta.id = TextService.generateUuid();
        _pregunta.tipoRespuesta = TipoRespuesta.FALSO_VERDADERO;
        _pregunta.tipoPregunta = TipoPregunta.OLIMPIADA;
        _pregunta.nivelDificultad = NivelDificultad.BAJA;
        _pregunta.textoPregunta = `PREGUNTA CURRICULA BAJA FV - ${idx}`;
        _pregunta.respuestas = ['FALSO'];
        _pregunta.opciones = null;
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-fisica-${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
        _pregunta.imagenPregunta = Math.random() < 0.2 ? `/${NOMBRE_CARPETA_IMG}/${INICIALES_IMG}-${Math.floor(Math.random() * ((INDICE_IMAGENES + NRO_IMAGENES - 1) - INDICE_IMAGENES + 1)) + INDICE_IMAGENES}.jpg` : null;

        await queryRunner.manager.save(_pregunta);  
        console.log(_pregunta);

        //PREGUNTA CURRICULA SELECCION SIMPLE
        _pregunta = new Pregunta();
        _pregunta.id = TextService.generateUuid();
        _pregunta.tipoRespuesta = TipoRespuesta.SELECCION_SIMPLE;
        _pregunta.tipoPregunta = TipoPregunta.OLIMPIADA;
        _pregunta.nivelDificultad = NivelDificultad.BAJA;
        _pregunta.textoPregunta = `PREGUNTA CURRICULA BAJA SS - ${idx}`;
        _pregunta.respuestas = ['b'];
        _pregunta.opciones = {
          a: 'Respuesta a',
          b: 'Respuesta b',
          c: 'Respuesta c',
          d: 'Respuesta d',
          e: 'Respuesta e',
        };
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-fisica-${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
        _pregunta.imagenPregunta = Math.random() < 0.2 ? `/${NOMBRE_CARPETA_IMG}/${INICIALES_IMG}-${Math.floor(Math.random() * ((INDICE_IMAGENES + NRO_IMAGENES - 1) - INDICE_IMAGENES + 1)) + INDICE_IMAGENES}.jpg` : null;

        await queryRunner.manager.save(_pregunta);  
        console.log(_pregunta);
        //PREGUNTA CURRICULA SELECCION MULTIPLE
        _pregunta = new Pregunta();
        _pregunta.id = TextService.generateUuid();
        _pregunta.tipoRespuesta = TipoRespuesta.SELECCION_MULTIPLE;
        _pregunta.tipoPregunta = TipoPregunta.OLIMPIADA;
        _pregunta.nivelDificultad = NivelDificultad.BAJA;
        _pregunta.textoPregunta = `PREGUNTA CURRICULA BAJA SM - ${idx}`;
        _pregunta.respuestas = ['b', 'c'];
        _pregunta.opciones = {
          a: 'Respuesta a',
          b: 'Respuesta b',
          c: 'Respuesta c',
          d: 'Respuesta d',
          e: 'Respuesta e',
        };
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-fisica-${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
        _pregunta.imagenPregunta = Math.random() < 0.2 ? `/${NOMBRE_CARPETA_IMG}/${INICIALES_IMG}-${Math.floor(Math.random() * ((INDICE_IMAGENES + NRO_IMAGENES - 1) - INDICE_IMAGENES + 1)) + INDICE_IMAGENES}.jpg` : null;

        await queryRunner.manager.save(_pregunta);  
        console.log(_pregunta);
      }
 
      // PREGUNTAS NIVEL MEDIO
    for (let idx = 0; idx < tam; idx++) {
        //PREGUNTA CURRICULA FALSO VERDADERO
        let _pregunta = new Pregunta();
        _pregunta.id = TextService.generateUuid();
        _pregunta.tipoRespuesta = TipoRespuesta.FALSO_VERDADERO;
        _pregunta.tipoPregunta = TipoPregunta.CURRICULA;
        _pregunta.nivelDificultad = NivelDificultad.MEDIA;
        _pregunta.textoPregunta = `PREGUNTA CURRICULA MEDIA SS - ${idx}`;
        _pregunta.respuestas = ['FALSO'];
        _pregunta.opciones = null;
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-fisica-${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
        _pregunta.imagenPregunta = Math.random() < 0.2 ? `/${NOMBRE_CARPETA_IMG}/${INICIALES_IMG}-${Math.floor(Math.random() * ((INDICE_IMAGENES + NRO_IMAGENES - 1) - INDICE_IMAGENES + 1)) + INDICE_IMAGENES}.jpg` : null;
        
        await queryRunner.manager.save(_pregunta);  
        console.log(_pregunta);
 
        //PREGUNTA CURRICULA SELECCION SIMPLE
        _pregunta = new Pregunta();
        _pregunta.id = TextService.generateUuid();
        _pregunta.tipoRespuesta = TipoRespuesta.SELECCION_SIMPLE;
        _pregunta.tipoPregunta = TipoPregunta.CURRICULA;
        _pregunta.nivelDificultad = NivelDificultad.MEDIA;
        _pregunta.textoPregunta = `PREGUNTA CURRICULA MEDIA SS - ${idx}`;
        _pregunta.respuestas = ['b'];
        _pregunta.opciones = {
          a: 'Respuesta a',
          b: 'Respuesta b',
          c: 'Respuesta c',
          d: 'Respuesta d',
          e: 'Respuesta e',
        };
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-fisica-${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
        _pregunta.imagenPregunta = Math.random() < 0.2 ? `/${NOMBRE_CARPETA_IMG}/${INICIALES_IMG}-${Math.floor(Math.random() * ((INDICE_IMAGENES + NRO_IMAGENES - 1) - INDICE_IMAGENES + 1)) + INDICE_IMAGENES}.jpg` : null;
       
        await queryRunner.manager.save(_pregunta);  
        console.log(_pregunta);
        //PREGUNTA CURRICULA SELECCION MULTIPLE
        _pregunta = new Pregunta();
        _pregunta.id = TextService.generateUuid();
        _pregunta.tipoRespuesta = TipoRespuesta.SELECCION_MULTIPLE;
        _pregunta.tipoPregunta = TipoPregunta.CURRICULA;
        _pregunta.nivelDificultad = NivelDificultad.MEDIA;
        _pregunta.textoPregunta = `PREGUNTA CURRICULA MEDIA SM - ${idx}`;
        _pregunta.respuestas = ['b', 'c'];
        _pregunta.opciones = {
          a: 'Respuesta a',
          b: 'Respuesta b',
          c: 'Respuesta c',
          d: 'Respuesta d',
          e: 'Respuesta e',
        };
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-fisica-${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
        _pregunta.imagenPregunta = Math.random() < 0.2 ? `/${NOMBRE_CARPETA_IMG}/${INICIALES_IMG}-${Math.floor(Math.random() * ((INDICE_IMAGENES + NRO_IMAGENES - 1) - INDICE_IMAGENES + 1)) + INDICE_IMAGENES}.jpg` : null;
       
        await queryRunner.manager.save(_pregunta);  
        console.log(_pregunta);
 
        //PREGUNTAS OLIMPIADA
        //PREGUNTA OLIMPIADA FALSO VERDADERO
        _pregunta = new Pregunta();
        _pregunta.id = TextService.generateUuid();
        _pregunta.tipoRespuesta = TipoRespuesta.FALSO_VERDADERO;
        _pregunta.tipoPregunta = TipoPregunta.OLIMPIADA;
        _pregunta.nivelDificultad = NivelDificultad.MEDIA;
        _pregunta.textoPregunta = `PREGUNTA CURRICULA MEDIA SS - ${idx}`;
        _pregunta.respuestas = ['FALSO'];
        _pregunta.opciones = null;
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-fisica-${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
        _pregunta.imagenPregunta = Math.random() < 0.2 ? `/${NOMBRE_CARPETA_IMG}/${INICIALES_IMG}-${Math.floor(Math.random() * ((INDICE_IMAGENES + NRO_IMAGENES - 1) - INDICE_IMAGENES + 1)) + INDICE_IMAGENES}.jpg` : null;
       
        await queryRunner.manager.save(_pregunta);  
        console.log(_pregunta);
       
        //PREGUNTA CURRICULA SELECCION SIMPLE
        _pregunta = new Pregunta();
        _pregunta.id = TextService.generateUuid();
        _pregunta.tipoRespuesta = TipoRespuesta.SELECCION_SIMPLE;
        _pregunta.tipoPregunta = TipoPregunta.OLIMPIADA;
        _pregunta.nivelDificultad = NivelDificultad.MEDIA;
        _pregunta.textoPregunta = `PREGUNTA CURRICULA MEDIA SS - ${idx}`;
        _pregunta.respuestas = ['b'];
        _pregunta.opciones = {
          a: 'Respuesta a',
          b: 'Respuesta b',
          c: 'Respuesta c',
          d: 'Respuesta d',
          e: 'Respuesta e',
        };
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-fisica-${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
        _pregunta.imagenPregunta = Math.random() < 0.2 ? `/${NOMBRE_CARPETA_IMG}/${INICIALES_IMG}-${Math.floor(Math.random() * ((INDICE_IMAGENES + NRO_IMAGENES - 1) - INDICE_IMAGENES + 1)) + INDICE_IMAGENES}.jpg` : null;

        await queryRunner.manager.save(_pregunta);  
        console.log(_pregunta);
        //PREGUNTA CURRICULA SELECCION MULTIPLE
        _pregunta = new Pregunta();
        _pregunta.id = TextService.generateUuid();
        _pregunta.tipoRespuesta = TipoRespuesta.SELECCION_MULTIPLE;
        _pregunta.tipoPregunta = TipoPregunta.OLIMPIADA;
        _pregunta.nivelDificultad = NivelDificultad.MEDIA;
        _pregunta.textoPregunta = `PREGUNTA CURRICULA MEDIA SM - ${idx}`;
        _pregunta.respuestas = ['b', 'c'];
        _pregunta.opciones = {
          a: 'Respuesta a',
          b: 'Respuesta b',
          c: 'Respuesta c',
          d: 'Respuesta d',
          e: 'Respuesta e',
        };
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-fisica-${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
        _pregunta.imagenPregunta = Math.random() < 0.2 ? `/${NOMBRE_CARPETA_IMG}/${INICIALES_IMG}-${Math.floor(Math.random() * ((INDICE_IMAGENES + NRO_IMAGENES - 1) - INDICE_IMAGENES + 1)) + INDICE_IMAGENES}.jpg` : null;
 
        await queryRunner.manager.save(_pregunta);  
        console.log(_pregunta);
      }
      // PREGUNTAS NIVEL COMPLEJO
      for (let idx = 0; idx < tam; idx++) {
        //PREGUNTA CURRICULA FALSO VERDADERO
        let _pregunta = new Pregunta();
        _pregunta.id = TextService.generateUuid();
        _pregunta.tipoRespuesta = TipoRespuesta.FALSO_VERDADERO;
        _pregunta.tipoPregunta = TipoPregunta.CURRICULA;
        _pregunta.nivelDificultad = NivelDificultad.ALTA;
        _pregunta.textoPregunta = `PREGUNTA CURRICULA ALTA FV - ${idx}`;
        _pregunta.respuestas = ['FALSO'];
        _pregunta.opciones = null;
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-fisica-${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
        _pregunta.imagenPregunta = Math.random() < 0.2 ? `/${NOMBRE_CARPETA_IMG}/${INICIALES_IMG}-${Math.floor(Math.random() * ((INDICE_IMAGENES + NRO_IMAGENES - 1) - INDICE_IMAGENES + 1)) + INDICE_IMAGENES}.jpg` : null;
      
        await queryRunner.manager.save(_pregunta);  
        console.log(_pregunta);
      
        //PREGUNTA CURRICULA SELECCION SIMPLE
        _pregunta = new Pregunta();
        _pregunta.id = TextService.generateUuid();
        _pregunta.tipoRespuesta = TipoRespuesta.SELECCION_SIMPLE;
        _pregunta.tipoPregunta = TipoPregunta.CURRICULA;
        _pregunta.nivelDificultad = NivelDificultad.ALTA;
        _pregunta.textoPregunta = `PREGUNTA CURRICULA ALTA SS - ${idx}`;
        _pregunta.respuestas = ['b'];
        _pregunta.opciones = {
          a: 'Respuesta a',
          b: 'Respuesta b',
          c: 'Respuesta c',
          d: 'Respuesta d',
          e: 'Respuesta e',
        };
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-fisica-${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
        _pregunta.imagenPregunta = Math.random() < 0.2 ? `/${NOMBRE_CARPETA_IMG}/${INICIALES_IMG}-${Math.floor(Math.random() * ((INDICE_IMAGENES + NRO_IMAGENES - 1) - INDICE_IMAGENES + 1)) + INDICE_IMAGENES}.jpg` : null;
       
        await queryRunner.manager.save(_pregunta);  
        console.log(_pregunta);
        //PREGUNTA CURRICULA SELECCION MULTIPLE
        _pregunta = new Pregunta();
        _pregunta.id = TextService.generateUuid();
        _pregunta.tipoRespuesta = TipoRespuesta.SELECCION_MULTIPLE;
        _pregunta.tipoPregunta = TipoPregunta.CURRICULA;
        _pregunta.nivelDificultad = NivelDificultad.ALTA;
        _pregunta.textoPregunta = `PREGUNTA CURRICULA ALTA SM - ${idx}`;
        _pregunta.respuestas = ['b', 'c'];
        _pregunta.opciones = {
          a: 'Respuesta a',
          b: 'Respuesta b',
          c: 'Respuesta c',
          d: 'Respuesta d',
          e: 'Respuesta e',
        };
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-fisica-${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
        _pregunta.imagenPregunta = Math.random() < 0.2 ? `/${NOMBRE_CARPETA_IMG}/${INICIALES_IMG}-${Math.floor(Math.random() * ((INDICE_IMAGENES + NRO_IMAGENES - 1) - INDICE_IMAGENES + 1)) + INDICE_IMAGENES}.jpg` : null;
 
        await queryRunner.manager.save(_pregunta);  
        console.log(_pregunta);
        //PREGUNTAS OLIMPIADA
        //PREGUNTA OLIMPIADA FALSO VERDADERO
        _pregunta = new Pregunta();
        _pregunta.id = TextService.generateUuid();
        _pregunta.tipoRespuesta = TipoRespuesta.FALSO_VERDADERO;
        _pregunta.tipoPregunta = TipoPregunta.OLIMPIADA;
        _pregunta.nivelDificultad = NivelDificultad.ALTA;
        _pregunta.textoPregunta = `PREGUNTA CURRICULA ALTA FV - ${idx}`;
        _pregunta.respuestas = ['FALSO'];
        _pregunta.opciones = null;
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-fisica-${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
        _pregunta.imagenPregunta = Math.random() < 0.2 ? `/${NOMBRE_CARPETA_IMG}/${INICIALES_IMG}-${Math.floor(Math.random() * ((INDICE_IMAGENES + NRO_IMAGENES - 1) - INDICE_IMAGENES + 1)) + INDICE_IMAGENES}.jpg` : null;
 
        await queryRunner.manager.save(_pregunta);  
        // console.log(_pregunta);
 
       //PREGUNTA CURRICULA SELECCION SIMPLE
        _pregunta = new Pregunta();
        _pregunta.id = TextService.generateUuid();
        _pregunta.tipoRespuesta = TipoRespuesta.SELECCION_SIMPLE;
        _pregunta.tipoPregunta = TipoPregunta.OLIMPIADA;
        _pregunta.nivelDificultad = NivelDificultad.ALTA;
        _pregunta.textoPregunta = `PREGUNTA CURRICULA ALTA SS - ${idx}`;
        _pregunta.respuestas = ['b'];
        _pregunta.opciones = {
          a: 'Respuesta a',
          b: 'Respuesta b',
          c: 'Respuesta c',
          d: 'Respuesta d',
          e: 'Respuesta e',
        };
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-fisica-${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
        _pregunta.imagenPregunta = Math.random() < 0.2 ? `/${NOMBRE_CARPETA_IMG}/${INICIALES_IMG}-${Math.floor(Math.random() * ((INDICE_IMAGENES + NRO_IMAGENES - 1) - INDICE_IMAGENES + 1)) + INDICE_IMAGENES}.jpg` : null;
 
        await queryRunner.manager.save(_pregunta);  
        // console.log(_pregunta);
        //PREGUNTA CURRICULA SELECCION MULTIPLE
        _pregunta = new Pregunta();
        _pregunta.id = TextService.generateUuid();
        _pregunta.tipoRespuesta = TipoRespuesta.SELECCION_MULTIPLE;
        _pregunta.tipoPregunta = TipoPregunta.OLIMPIADA;
        _pregunta.nivelDificultad = NivelDificultad.ALTA;
        _pregunta.textoPregunta = `PREGUNTA CURRICULA ALTA SM - ${idx}`;
        _pregunta.respuestas = ['b', 'c'];
        _pregunta.opciones = {
          a: 'Respuesta a',
          b: 'Respuesta b',
          c: 'Respuesta c',
          d: 'Respuesta d',
          e: 'Respuesta e',
        };
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-fisica-${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
        _pregunta.imagenPregunta = Math.random() < 0.2 ? `/${NOMBRE_CARPETA_IMG}/${INICIALES_IMG}-${Math.floor(Math.random() * ((INDICE_IMAGENES + NRO_IMAGENES - 1) - INDICE_IMAGENES + 1)) + INDICE_IMAGENES}.jpg` : null;
 
        await queryRunner.manager.save(_pregunta);  
        console.log(_pregunta);
      }
  
    // await queryRunner.manager.save(preguntas);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {}

}