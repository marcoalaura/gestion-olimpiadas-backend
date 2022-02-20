import { MigrationInterface, QueryRunner } from 'typeorm';
import { Etapa } from '../../src/application/olimpiada/entity/Etapa.entity';
import { Olimpiada } from '../../src/application/olimpiada/entity/Olimpiada.entity';
import { tiposEtapa, Status } from '../../src/common/constants';
export class etapa1618432392581 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        id: '66b7d7aa-ea70-49c7-8263-906a07668fc1',
        nombre: 'Uno',
        tipo: tiposEtapa.DISTRITAL,
        estado: Status.ACTIVE,
        estadoSorteoPreguntas: Status.PENDING,
        jerarquia: 1,
        comiteDesempate: false,
        fechaInicio: Date.now() - 10 * 24 * 3600 * 1000,
        fechaFin: Date.now() + 10 * 24 * 3600 * 1000,
        fechaInicioImpugnacion: Date.now() + 10 * 24 * 3600 * 1000,
        fechaFinImpugnacion: Date.now() + 12 * 24 * 3600 * 1000,
        idOlimpiada: '97303a51-8570-453f-9e67-1a06537c0744',
      },
      {
        id: '88bdc57a-4ba2-41c4-98b0-23d719c5c999',
        nombre: 'Dos',
        tipo: tiposEtapa.DEPARTAMENTAL,
        estado: Status.ACTIVE,
        estadoSorteoPreguntas: Status.PENDING,
        jerarquia: 2,
        comiteDesempate: true,
        fechaInicio: Date.now() + 12 * 24 * 3600 * 1000,
        fechaFin: Date.now() + 22 * 24 * 3600 * 1000,
        fechaInicioImpugnacion: Date.now() + 22 * 24 * 3600 * 1000,
        fechaFinImpugnacion: Date.now() + 24 * 24 * 3600 * 1000,
        idOlimpiada: '97303a51-8570-453f-9e67-1a06537c0744',
      },
      {
        id: 'be14c70a-27fd-4bbe-963c-4a648b64226b',
        nombre: 'Tres',
        tipo: tiposEtapa.NACIONAL,
        estado: Status.ACTIVE,
        estadoSorteoPreguntas: Status.PENDING,
        jerarquia: 3,
        comiteDesempate: true,
        fechaInicio: Date.now() + 24 * 24 * 3600 * 1000,
        fechaFin: Date.now() + 34 * 24 * 3600 * 1000,
        fechaInicioImpugnacion: Date.now() + 34 * 24 * 3600 * 1000,
        fechaFinImpugnacion: Date.now() + 36 * 24 * 3600 * 1000,
        idOlimpiada: '97303a51-8570-453f-9e67-1a06537c0744',
      },
      {
        id: 'dad0ccb6-d8e2-11eb-b8bc-0242ac130003',
        nombre: 'Etapa 1',
        tipo: tiposEtapa.DISTRITAL,
        estado: Status.PUBLICACION_RESULTADOS,
        estadoSorteoPreguntas: Status.FINALIZADO,
        estadoPosicionamiento: Status.CLASIFICACION_PROCESO,
        jerarquia: 1,
        comiteDesempate: false,
        fechaInicio: Date.now() - 10 * 24 * 3600 * 1000,
        fechaFin: Date.now() + 10 * 24 * 3600 * 1000,
        fechaInicioImpugnacion: Date.now() + 10 * 24 * 3600 * 1000,
        fechaFinImpugnacion: Date.now() + 12 * 24 * 3600 * 1000,
        idOlimpiada: '719e52b4-d8e1-11eb-b8bc-0242ac130003',
      },
      {
        id: '487fd6cb-5b19-421c-af3a-d2e8413e7b73',
        nombre: 'Etapa 2',
        tipo: tiposEtapa.DEPARTAMENTAL,
        estado: Status.ACTIVE,
        estadoSorteoPreguntas: Status.PENDING,
        jerarquia: 2,
        comiteDesempate: true,
        fechaInicio: Date.now() + 13 * 24 * 3600 * 1000,
        fechaFin: Date.now() + 20 * 24 * 3600 * 1000,
        fechaInicioImpugnacion: Date.now() + 20 * 24 * 3600 * 1000,
        fechaFinImpugnacion: Date.now() + 22 * 24 * 3600 * 1000,
        idOlimpiada: '719e52b4-d8e1-11eb-b8bc-0242ac130003',
      },
      {
        id: '123fd6cb-5b19-421c-af3a-d2e8413e7b12',
        nombre: 'Etapa',
        tipo: tiposEtapa.DEPARTAMENTAL,
        estado: Status.OBTENCION_MEDALLERO,
        estadoSorteoPreguntas: Status.FINALIZADO,
        jerarquia: 1,
        comiteDesempate: true,
        fechaInicio: Date.now(),
        fechaFin: Date.now() + 23 * 24 * 3600 * 1000,
        fechaInicioImpugnacion: Date.now() + 24 * 24 * 3600 * 1000,
        fechaFinImpugnacion: Date.now() + 24 * 24 * 3600 * 1000,
        idOlimpiada: '203ea483-f326-4019-85fa-4938a3326547',
      },
    ];
    const data = items.map((item) => {
      const o = new Olimpiada();
      o.id = item.idOlimpiada;
      const e = new Etapa();
      e.id = item.id;
      e.nombre = item.nombre;
      e.tipo = item.tipo;
      e.estado = item.estado;
      e.estadoSorteoPreguntas = item.estadoSorteoPreguntas;
      e.estadoPosicionamiento = item.estadoPosicionamiento;
      e.jerarquia = item.jerarquia;
      e.comiteDesempate = item.comiteDesempate;
      e.fechaInicio = new Date(item.fechaInicio);
      e.fechaFin = new Date(item.fechaFin);
      e.fechaInicioImpugnacion = new Date(item.fechaInicioImpugnacion);
      e.fechaFinImpugnacion = new Date(item.fechaFinImpugnacion);
      e.fechaCreacion = new Date();
      e.usuarioCreacion = '1';
      e.olimpiada = o;
      return e;
    });
    await queryRunner.manager.save(data);
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
