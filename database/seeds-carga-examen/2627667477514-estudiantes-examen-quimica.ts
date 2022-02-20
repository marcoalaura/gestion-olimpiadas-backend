import { MigrationInterface, QueryRunner, SimpleConsoleLogger} from 'typeorm';

// Utils
import { TextService } from 'src/common/lib/text.service';

// Entities
import { Persona } from '../../src/application/persona/persona.entity';
import { Olimpiada } from '../../src/application/olimpiada/entity/Olimpiada.entity';
import { EtapaAreaGrado } from '../../src/application/olimpiada/entity/EtapaAreaGrado.entity';
import { Estudiante } from '../../src/application/olimpiada/entity/Estudiante.entity';
import { Inscripcion } from '../../src/application/olimpiada/entity/Inscripcion.entity';
import { v4 } from 'uuid';
import { EstudianteExamen } from '../../src/application/olimpiada/entity/EstudianteExamen.entity';

// Types and constants
import {
  Status,
  TipoPlanificacion,
} from '../../src/common/constants';


export class estudianteExamenQuimica2627667477514 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const INITIAL = parseInt(process.env.CARGA_INDICE_INICIAL) || 1500;
    const NRO_UNIDADES_EDUCATIVAS = parseInt(process.env.NRO_UNIDADES_EDUCATIVAS) || 100;
    const NRO_ESTUDIANTES = parseInt(process.env.NRO_ESTUDIANTES_X_UE) || 100;
    const NRO_PREGUNTAS = parseInt(process.env.NRO_PREGUNTAS_X_EXM) || 20;

    const _olimpiada = new Olimpiada();
    _olimpiada.id = TextService.textToUuid(`olimpiada-carga-examen${INITIAL}`);

    const _eag = new EtapaAreaGrado();
    _eag.id = TextService.textToUuid(`eag-carga-quimica-examen${INITIAL}`);


    const preguntas = await queryRunner.query(`SELECT * FROM pregunta WHERE id_etapa_area_grado = '${_eag.id}';`);


    /**
     * 
     * Estudiantes - Examen - Inscripcion
     */
    const estudiante_examen=[];
    const estudiante_examen_offline = [];
    for (let iue = INITIAL; iue < INITIAL + NRO_UNIDADES_EDUCATIVAS; iue++) {
      // console.log('*** Inscribiendo estudiantes en unidades educativas ***');
      for (let idx = INITIAL; idx < INITIAL + NRO_ESTUDIANTES; idx++) {

        // Inscribiendo estudiantes
        const _inscripcion = new Inscripcion();
        _inscripcion.id = TextService.textToUuid(`inscripcion-quimica-examen${iue}-${idx}`);


        const _examen = new EstudianteExamen();
        _examen.id = TextService.textToUuid(`estex-online-quimica-examen${iue}-${idx}`);
        // _examen.fechaInicio = new Date('2021-08-05 08:00:00');
        // _examen.fechaFin = new Date('2021-08-30 08:00:00');
        // _examen.fechaConclusion = new Date('2021-08-30 08:00:00');
        _examen.estadoCargadoOffline = 'PENDIENTE';
        _examen.fechaCargadoOffline = null;
        _examen.estado = Status.ACTIVE;
        _examen.hashExamen = null;
        _examen.tipoPrueba = 'ONLINE';
        _examen.tipoPlanificacion = TipoPlanificacion.CRONOGRAMA;
        _examen.data = {
          olimpiada: 'Olimpiadas CARGA 2021',
          rude: _inscripcion.id,
          distritoEducativo: 'Distrito educativo test',
          gradoEscolar: 'Primero de secundaria',
          estudiante: 'JUAN PINTO ESCOBAR',
        };

        _examen.puntaje = 0;
        _examen.idInscripcion = _inscripcion.id;
        _examen.usuarioCreacion = 'seeders-carga-fake';
        await queryRunner.manager.save(_examen);
        estudiante_examen.push(_examen);


        /**
         * Sorteo preguntas para examen online
         */
        // const preguntasExamen = 
        const bancoPreguntas = [...preguntas];
        for (let index = 0; index < NRO_PREGUNTAS; index++) {
          let nro_pregunta = Math.floor(Math.random() * ((bancoPreguntas.length - 1) - 0 + 1)) + 0;
          console.log(nro_pregunta, bancoPreguntas.length);
          await queryRunner.query(`
            INSERT INTO estudiante_examen_detalle (id, respuestas, puntaje, estado, id_estudiante_examen, id_pregunta, fecha_creacion, usuario_creacion)
            VALUES ('${TextService.textToUuid(`estexdet-online-quimica-examen-${iue}-${idx}-${index}`)}', null, null, 'ACTIVO', '${TextService.textToUuid(`estex-online-quimica-examen${iue}-${idx}`)}', '${bancoPreguntas[nro_pregunta].id}', DEFAULT, 'seeders-fake') RETURNING id;
          `);

          bancoPreguntas.splice(nro_pregunta, 1);
        }



        // const _examenOffline = new EstudianteExamen();
        // _examenOffline.id = TextService.textToUuid(`estex-offline-quimica-examen${iue}-${idx}`);;
        // _examenOffline.fechaInicio = new Date('2021-08-10');
        // _examenOffline.estadoCargadoOffline = 'PENDIENTE';
        // _examenOffline.estado = 'ACTIVO';
        // _examenOffline.hashExamen = null;
        // _examenOffline.tipoPrueba = 'OFFLINE';
        // _examenOffline.tipoPlanificacion = TipoPlanificacion.CRONOGRAMA;
        // _examenOffline.data = {
        //   olimpiada: 'Olimpiadas CARGA 2021',
        //   rude: _inscripcion.id,
        //   distritoEducativo: 'Distrito educativo test',
        //   gradoEscolar: 'Primero de secundaria',
        //   estudiante: 'JUAN PINTO ESCOBAR',
        // };

        // _examenOffline.puntaje = null;
        // _examenOffline.idInscripcion = _inscripcion.id;
        // _examenOffline.usuarioCreacion = 'seeders-carga-fake';
        // await queryRunner.manager.save(_examenOffline);
        // estudiante_examen_offline.push(_examenOffline);


        // /**
        //  * Sorteo de preguntas para examen offline
        //  * */
        //  const bancoPreguntasOffline = [...preguntas];
        //  for (let index = 1; index < NRO_PREGUNTAS; index++) {
        //    let nro_pregunta_offline = Math.floor(Math.random() * ((bancoPreguntasOffline.length - 1) - 0 + 1)) + 0;
        //    await queryRunner.query(`
        //      INSERT INTO estudiante_examen_detalle (id, respuestas, puntaje, estado, id_estudiante_examen, id_pregunta, fecha_creacion, usuario_creacion)
        //      VALUES ('${v4()}', null, null, 'ACTIVO', '${TextService.textToUuid(`estex-offline-quimica-examen${iue}-${idx}`)}', '${bancoPreguntasOffline[nro_pregunta_offline].id}', DEFAULT, 'seeders-fake') RETURNING id;
        //    `);
 
        //    bancoPreguntasOffline.splice(nro_pregunta_offline, 1);
        //  }

        

      }
    }

  }
  public async down(queryRunner: QueryRunner): Promise<void> {}

}
