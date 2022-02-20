import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { EstudianteExamenDetalle } from '../../src/application/olimpiada/entity/EstudianteExamenDetalle.entity';
import { EstudianteExamen } from '../../src/application/olimpiada/entity/EstudianteExamen.entity';
import { Pregunta } from '../../src/application/olimpiada/entity/Pregunta.entity';

export class estudianteExamenDetalle1618597433815
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const preguntas = [
      'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      '954c7fdb-f54d-47ef-97d0-10464b244652',
      '97974c41-9964-4b2a-989e-1061fdfb22fd',
      '87974c41-9964-4b2a-989e-1061fdfb22f1',
      '87984c41-9964-4b2a-989e-1061fdfb22f1',
      '87984c41-9964-4b2a-989e-1001fdfb22f1',
      '87984c41-9964-4b2a-989e-2071fdfb22f1',
      '87984c41-9964-4b2a-989e-2081fdfb22f1',
      '87984c41-9964-4b2a-989e-2091fdfb22f1',
      '87984c41-9964-4b2a-989e-2101fdfb22f1',
    ];
    const items = [
      {
        id: '4821b320-0531-41c8-8d63-67c85e2851ed',
        respuestas: null,
        puntaje: null,
        estado: 'ACTIVO',
        idEstudianteExamen: '1194425e-ffe8-485f-b42c-cacf32ed70d1',
        idPregunta: null,
      },
      {
        id: '1aa266fb-6bf2-4339-b02d-58b9f3ca2dce',
        respuestas: null,
        puntaje: null,
        estado: 'ACTIVO',
        idEstudianteExamen: 'aadacc5e-c9ec-4ff8-9ee2-847e4ed502f8',
        idPregunta: null,
      },
      {
        id: 'b0cf4728-b02a-4daa-a75a-ca515b40a496',
        respuestas: null,
        puntaje: null,
        estado: 'ACTIVO',
        idEstudianteExamen: '2f40a360-8895-42be-bba3-e7db46bff46f',
        idPregunta: null,
      },
      {
        id: 'ddde4654-3bd0-4fd6-99d9-26582e393653',
        respuestas: null,
        puntaje: null,
        estado: 'ACTIVO',
        idEstudianteExamen: '9fbba8ae-d856-42bd-a7b5-fd91f715db3b',
        idPregunta: null,
      },
      {
        id: 'd8a9add0-7d3f-4747-80ab-ede143980bc6',
        respuestas: null,
        puntaje: null,
        estado: 'ACTIVO',
        idEstudianteExamen: '5fba1cf3-ab62-48dc-99e2-dfff9e97f923',
        idPregunta: null,
      },
    ];
    const data = [];
    for (const item of items) {
      for (const idPregunta of preguntas) {
        const ee = new EstudianteExamen();
        ee.id = item.idEstudianteExamen;
        const p = new Pregunta();
        p.id = idPregunta;
        const e = new EstudianteExamenDetalle();
        e.id = uuidv4(); // item.id;
        e.respuestas = item.respuestas;
        e.puntaje = item.puntaje;
        e.estado = item.estado;
        e.estudianteExamen = ee;
        e.pregunta = p;
        e.usuarioCreacion = 'seeders';
        data.push(e);
      }
    }
    await queryRunner.manager.save(data);
  }
  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
