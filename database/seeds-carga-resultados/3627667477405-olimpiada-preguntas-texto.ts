import { MigrationInterface, QueryRunner, SimpleConsoleLogger} from 'typeorm';

// Utils
import { TextService } from 'src/common/lib/text.service';

// Entities
import { Olimpiada } from '../../src/application/olimpiada/entity/Olimpiada.entity';
import { Rol } from '../../src/core/authorization/entity/rol.entity';
import { Pregunta } from '../../src/application/olimpiada/entity/Pregunta.entity';
// Types and constants
import {
  TipoRespuesta,
  NivelDificultad,
  TipoPregunta,
} from '../../src/common/constants';

import { RolEnum } from 'src/core/authorization/rol.enum';


export class fakePreguntasTexto3627667477405 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const INITIAL = parseInt(process.env.CARGA_INDICE_INICIAL) || 1500;
    const NRO_UNIDADES_EDUCATIVAS = parseInt(process.env.NRO_UNIDADES_EDUCATIVAS) || 100;
    const NRO_ESTUDIANTES = parseInt(process.env.NRO_ESTUDIANTES_X_UE) || 100;
    const NRO_PREGUNTAS = parseInt(process.env.NRO_PREGUNTAS_X_EXM) || 20;

    const _rolDirector = new Rol();
    _rolDirector.id = TextService.textToUuid(RolEnum.DIRECTOR);

    const _olimpiada = new Olimpiada();
    _olimpiada.id = TextService.textToUuid(`olimpiada-carga-resultados-${INITIAL}`);

    /**
     * Preguntas - EAG - tipo_texto
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
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-matematicas-resultados${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
  
        await queryRunner.manager.save(_pregunta);
      
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
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-matematicas-resultados${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
  
        await queryRunner.manager.save(_pregunta);
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
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-matematicas-resultados${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';

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
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-matematicas-resultados${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';

        await queryRunner.manager.save(_pregunta);

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
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-matematicas-resultados${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';

        await queryRunner.manager.save(_pregunta);
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
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-matematicas-resultados${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';

        await queryRunner.manager.save(_pregunta);
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
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-matematicas-resultados${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';

        await queryRunner.manager.save(_pregunta);
   
 
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
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-matematicas-resultados${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
   
        await queryRunner.manager.save(_pregunta);
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
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-matematicas-resultados${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
       
        await queryRunner.manager.save(_pregunta);
 
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
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-matematicas-resultados${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
       
        await queryRunner.manager.save(_pregunta);
       
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
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-matematicas-resultados${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';

        await queryRunner.manager.save(_pregunta);
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
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-matematicas-resultados${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
 
        await queryRunner.manager.save(_pregunta);
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
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-matematicas-resultados${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
      
        await queryRunner.manager.save(_pregunta);
      
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
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-matematicas-resultados${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
        await queryRunner.manager.save(_pregunta);
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
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-matematicas-resultados${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
        await queryRunner.manager.save(_pregunta);
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
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-matematicas-resultados${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
        await queryRunner.manager.save(_pregunta);
 
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
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-matematicas-resultados${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
 
        await queryRunner.manager.save(_pregunta);
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
        _pregunta.idEtapaAreaGrado = TextService.textToUuid(`eag-carga-matematicas-resultados${INITIAL}`); //'793e2227-770d-5692-8852-d9efdcc6a4d7';
        _pregunta.estado = 'APROBADO';
        _pregunta.usuarioCreacion = 'd5de12df-3cc3-5a58-a742-be24030482d8';
 
        await queryRunner.manager.save(_pregunta);
      }
  

  }
  public async down(queryRunner: QueryRunner): Promise<void> {}

}