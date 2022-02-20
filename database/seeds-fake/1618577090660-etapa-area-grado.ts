import { MigrationInterface, QueryRunner } from 'typeorm';
import { EtapaAreaGrado } from '../../src/application/olimpiada/entity/EtapaAreaGrado.entity';
import { Area } from '../../src/application/olimpiada/entity/Area.entity';
import { GradoEscolaridad } from '../../src/application/olimpiada/entity/GradoEscolaridad.entity';
import { Etapa } from '../../src/application/olimpiada/entity/Etapa.entity';
import { Color } from 'src/common/constants';

export class etapaAreaGrado1618577090660 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        id: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        total_preguntas: 5,
        preguntas_curricula: 3,
        preguntas_olimpiada: 2,
        puntos_pregunta_curricula: 50,
        puntos_pregunta_olimpiada: 50,
        duracion_minutos: 10,
        preguntas_curricula_baja: 1,
        puntaje_curricula_baja: 10,
        preguntas_curricula_media: 1,
        puntaje_curricula_media: 15,
        preguntas_curricula_alta: 1,
        puntaje_curricula_alta: 25,
        preguntas_olimpiada_baja: 1,
        puntaje_olimpiada_baja: 25,
        preguntas_olimpiada_media: 0,
        puntaje_olimpiada_media: 0,
        preguntas_olimpiada_alta: 1,
        puntaje_olimpiada_alta: 25,
        nro_posiciones_total: 3,
        nro_posiciones_rural: 1,
        criterio_calificacion: true,
        criterio_medallero: false,
        puntaje_minimo_clasificacion: 10,
        cantidad_maxima_clasificados: 10,
        puntaje_minimo_medallero: 51,
        id_area: '0a55e851-622e-4465-8d72-c7ba2cf79c79',
        id_etapa: '66b7d7aa-ea70-49c7-8263-906a07668fc1',
        id_grado_escolar: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: 'c9930379-5dc1-556f-847c-802dd9d1d9b7',
        total_preguntas: 14,
        preguntas_curricula: 6,
        preguntas_olimpiada: 8,
        puntos_pregunta_curricula: 40,
        puntos_pregunta_olimpiada: 60,
        duracion_minutos: 10,
        preguntas_curricula_baja: 2,
        puntaje_curricula_baja: 5,
        preguntas_curricula_media: 2,
        puntaje_curricula_media: 5,
        preguntas_curricula_alta: 2,
        puntaje_curricula_alta: 10,
        preguntas_olimpiada_baja: 2,
        puntaje_olimpiada_baja: 10,
        preguntas_olimpiada_media: 2,
        puntaje_olimpiada_media: 10,
        preguntas_olimpiada_alta: 4,
        puntaje_olimpiada_alta: 5,
        nro_posiciones_total: 1,
        nro_posiciones_rural: 1,
        criterio_calificacion: true,
        criterio_medallero: false,
        puntaje_minimo_clasificacion: 51,
        cantidad_maxima_clasificados: 10,
        puntaje_minimo_medallero: 51,
        id_area: '297cd53f-d950-401d-912a-f9deb66550b9',
        id_etapa: '66b7d7aa-ea70-49c7-8263-906a07668fc1',
        id_grado_escolar: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: 'c9930379-5dc1-556f-847c-802dd9d1d9b8',
        total_preguntas: 14,
        preguntas_curricula: 6,
        preguntas_olimpiada: 8,
        puntos_pregunta_curricula: 40,
        puntos_pregunta_olimpiada: 60,
        duracion_minutos: 10,
        preguntas_curricula_baja: 2,
        puntaje_curricula_baja: 5,
        preguntas_curricula_media: 2,
        puntaje_curricula_media: 5,
        preguntas_curricula_alta: 2,
        puntaje_curricula_alta: 10,
        preguntas_olimpiada_baja: 2,
        puntaje_olimpiada_baja: 10,
        preguntas_olimpiada_media: 2,
        puntaje_olimpiada_media: 10,
        preguntas_olimpiada_alta: 4,
        puntaje_olimpiada_alta: 5,
        nro_posiciones_total: 1,
        nro_posiciones_rural: 1,
        criterio_calificacion: true,
        criterio_medallero: false,
        puntaje_minimo_clasificacion: 51,
        cantidad_maxima_clasificados: 10,
        puntaje_minimo_medallero: 51,
        id_area: '52720f8a-2c0d-49fe-beaf-811dc6b08e6b',
        id_etapa: '66b7d7aa-ea70-49c7-8263-906a07668fc1',
        id_grado_escolar: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },

      {
        id: '793e2227-770d-5692-8852-d9efdcc6a4d7',
        total_preguntas: 10,
        preguntas_curricula: 4,
        preguntas_olimpiada: 6,
        puntos_pregunta_curricula: 40,
        puntos_pregunta_olimpiada: 60,
        duracion_minutos: 10,
        preguntas_curricula_baja: 1,
        puntaje_curricula_baja: 10,
        preguntas_curricula_media: 1,
        puntaje_curricula_media: 10,
        preguntas_curricula_alta: 2,
        puntaje_curricula_alta: 10,
        preguntas_olimpiada_baja: 2,
        puntaje_olimpiada_baja: 10,
        preguntas_olimpiada_media: 2,
        puntaje_olimpiada_media: 10,
        preguntas_olimpiada_alta: 2,
        puntaje_olimpiada_alta: 10,
        nro_posiciones_total: 3,
        nro_posiciones_rural: 2,
        criterio_calificacion: true,
        criterio_medallero: false,
        puntaje_minimo_clasificacion: 65,
        cantidad_maxima_clasificados: 10,
        puntaje_minimo_medallero: 60,
        id_area: 'f6b02355-e60f-4464-a1a2-52e784b1717f',
        id_etapa: '88bdc57a-4ba2-41c4-98b0-23d719c5c999',
        id_grado_escolar: '248f063b-5ae3-5824-8bf3-d445f93d37aa',
      },
      {
        id: '2bc7bbdd-c62d-51d1-88c2-9a91bbd5b231',
        total_preguntas: 14,
        preguntas_curricula: 6,
        preguntas_olimpiada: 8,
        puntos_pregunta_curricula: 40,
        puntos_pregunta_olimpiada: 60,
        duracion_minutos: 10,
        preguntas_curricula_baja: 2,
        puntaje_curricula_baja: 5,
        preguntas_curricula_media: 2,
        puntaje_curricula_media: 5,
        preguntas_curricula_alta: 2,
        puntaje_curricula_alta: 10,
        preguntas_olimpiada_baja: 2,
        puntaje_olimpiada_baja: 10,
        preguntas_olimpiada_media: 2,
        puntaje_olimpiada_media: 10,
        preguntas_olimpiada_alta: 4,
        puntaje_olimpiada_alta: 5,
        nro_posiciones_total: 1,
        nro_posiciones_rural: 1,
        criterio_calificacion: true,
        criterio_medallero: false,
        puntaje_minimo_clasificacion: 51,
        cantidad_maxima_clasificados: 10,
        puntaje_minimo_medallero: 51,
        id_area: '795f761d-2764-408e-94ea-7d5020bc30ac',
        id_etapa: '88bdc57a-4ba2-41c4-98b0-23d719c5c999',
        id_grado_escolar: '248f063b-5ae3-5824-8bf3-d445f93d37aa',
      },
      {
        id: 'bf57d2c4-d8e5-11eb-b8bc-0242ac130003',
        total_preguntas: 5,
        preguntas_curricula: 3,
        preguntas_olimpiada: 2,
        puntos_pregunta_curricula: 50,
        puntos_pregunta_olimpiada: 50,
        duracion_minutos: 10,
        preguntas_curricula_baja: 1,
        puntaje_curricula_baja: 10,
        preguntas_curricula_media: 1,
        puntaje_curricula_media: 15,
        preguntas_curricula_alta: 1,
        puntaje_curricula_alta: 25,
        preguntas_olimpiada_baja: 1,
        puntaje_olimpiada_baja: 25,
        preguntas_olimpiada_media: 0,
        puntaje_olimpiada_media: 0,
        preguntas_olimpiada_alta: 1,
        puntaje_olimpiada_alta: 25,
        nro_posiciones_total: 3,
        nro_posiciones_rural: 1,
        criterio_calificacion: true,
        criterio_medallero: false,
        puntaje_minimo_clasificacion: 10,
        cantidad_maxima_clasificados: 10,
        puntaje_minimo_medallero: 51,
        id_area: '0a55e851-622e-4465-8d72-c7ba2cf79c79',
        id_etapa: 'dad0ccb6-d8e2-11eb-b8bc-0242ac130003',
        id_grado_escolar: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: '1dd0edfd-52fd-4883-a90b-1f97563c8892',
        total_preguntas: 5,
        preguntas_curricula: 3,
        preguntas_olimpiada: 2,
        puntos_pregunta_curricula: 50,
        puntos_pregunta_olimpiada: 50,
        duracion_minutos: 10,
        preguntas_curricula_baja: 1,
        puntaje_curricula_baja: 10,
        preguntas_curricula_media: 1,
        puntaje_curricula_media: 15,
        preguntas_curricula_alta: 1,
        puntaje_curricula_alta: 25,
        preguntas_olimpiada_baja: 1,
        puntaje_olimpiada_baja: 25,
        preguntas_olimpiada_media: 0,
        puntaje_olimpiada_media: 0,
        preguntas_olimpiada_alta: 1,
        puntaje_olimpiada_alta: 25,
        nro_posiciones_total: 3,
        nro_posiciones_rural: 1,
        criterio_calificacion: true,
        criterio_medallero: false,
        puntaje_minimo_clasificacion: 10,
        cantidad_maxima_clasificados: 10,
        puntaje_minimo_medallero: 51,
        id_area: '0a55e851-622e-4465-8d72-c7ba2cf79c79',
        id_etapa: '487fd6cb-5b19-421c-af3a-d2e8413e7b73',
        id_grado_escolar: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: '123fd6cb-5b19-421c-af3a-d2e8413e7b12',
        total_preguntas: 5,
        preguntas_curricula: 3,
        preguntas_olimpiada: 2,
        puntos_pregunta_curricula: 50,
        puntos_pregunta_olimpiada: 50,
        duracion_minutos: 10,
        preguntas_curricula_baja: 1,
        puntaje_curricula_baja: 10,
        preguntas_curricula_media: 1,
        puntaje_curricula_media: 15,
        preguntas_curricula_alta: 1,
        puntaje_curricula_alta: 25,
        preguntas_olimpiada_baja: 1,
        puntaje_olimpiada_baja: 25,
        preguntas_olimpiada_media: 0,
        puntaje_olimpiada_media: 0,
        preguntas_olimpiada_alta: 1,
        puntaje_olimpiada_alta: 25,
        nro_posiciones_total: 5,
        nro_posiciones_rural: 1,
        criterio_calificacion: true,
        criterio_medallero: false,
        puntaje_minimo_clasificacion: 10,
        cantidad_maxima_clasificados: 10,
        puntaje_minimo_medallero: 51,
        id_area: '0a55e851-622e-4465-8d72-c7ba2cf79c79',
        id_etapa: '123fd6cb-5b19-421c-af3a-d2e8413e7b12',
        id_grado_escolar: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      },
      {
        id: '0734d1c0-3760-441e-b3bb-783ee9c7ee7c',
        total_preguntas: 5,
        preguntas_curricula: 3,
        preguntas_olimpiada: 2,
        puntos_pregunta_curricula: 50,
        puntos_pregunta_olimpiada: 50,
        duracion_minutos: 10,
        preguntas_curricula_baja: 1,
        puntaje_curricula_baja: 10,
        preguntas_curricula_media: 1,
        puntaje_curricula_media: 15,
        preguntas_curricula_alta: 1,
        puntaje_curricula_alta: 25,
        preguntas_olimpiada_baja: 1,
        puntaje_olimpiada_baja: 25,
        preguntas_olimpiada_media: 0,
        puntaje_olimpiada_media: 0,
        preguntas_olimpiada_alta: 1,
        puntaje_olimpiada_alta: 25,
        nro_posiciones_total: 3,
        nro_posiciones_rural: 1,
        criterio_calificacion: true,
        criterio_medallero: false,
        puntaje_minimo_clasificacion: 10,
        cantidad_maxima_clasificados: 10,
        puntaje_minimo_medallero: 51,
        id_area: '0a55e851-622e-4465-8d72-c7ba2cf79c79',
        id_etapa: 'dad0ccb6-d8e2-11eb-b8bc-0242ac130003',
        id_grado_escolar: '248f063b-5ae3-5824-8bf3-d445f93d37aa',
      },
      {
        id: '2b34eda8-aed5-4d36-978b-128cb10dea65',
        total_preguntas: 5,
        preguntas_curricula: 3,
        preguntas_olimpiada: 2,
        puntos_pregunta_curricula: 50,
        puntos_pregunta_olimpiada: 50,
        duracion_minutos: 10,
        preguntas_curricula_baja: 1,
        puntaje_curricula_baja: 10,
        preguntas_curricula_media: 1,
        puntaje_curricula_media: 15,
        preguntas_curricula_alta: 1,
        puntaje_curricula_alta: 25,
        preguntas_olimpiada_baja: 1,
        puntaje_olimpiada_baja: 25,
        preguntas_olimpiada_media: 0,
        puntaje_olimpiada_media: 0,
        preguntas_olimpiada_alta: 1,
        puntaje_olimpiada_alta: 25,
        nro_posiciones_total: 3,
        nro_posiciones_rural: 1,
        criterio_calificacion: true,
        criterio_medallero: false,
        puntaje_minimo_clasificacion: 10,
        cantidad_maxima_clasificados: 10,
        puntaje_minimo_medallero: 51,
        id_area: '0a55e851-622e-4465-8d72-c7ba2cf79c79',
        id_etapa: '487fd6cb-5b19-421c-af3a-d2e8413e7b73',
        id_grado_escolar: '248f063b-5ae3-5824-8bf3-d445f93d37aa',
      },
      {
        id: '007a50d0-4334-4423-b77f-2ce5d26b4bda',
        total_preguntas: 5,
        preguntas_curricula: 3,
        preguntas_olimpiada: 2,
        puntos_pregunta_curricula: 50,
        puntos_pregunta_olimpiada: 50,
        duracion_minutos: 10,
        preguntas_curricula_baja: 1,
        puntaje_curricula_baja: 10,
        preguntas_curricula_media: 1,
        puntaje_curricula_media: 15,
        preguntas_curricula_alta: 1,
        puntaje_curricula_alta: 25,
        preguntas_olimpiada_baja: 1,
        puntaje_olimpiada_baja: 25,
        preguntas_olimpiada_media: 0,
        puntaje_olimpiada_media: 0,
        preguntas_olimpiada_alta: 1,
        puntaje_olimpiada_alta: 25,
        nro_posiciones_total: 3,
        nro_posiciones_rural: 1,
        criterio_calificacion: true,
        criterio_medallero: false,
        puntaje_minimo_clasificacion: 10,
        cantidad_maxima_clasificados: 10,
        puntaje_minimo_medallero: 51,
        id_area: 'f6b02355-e60f-4464-a1a2-52e784b1717f',
        id_etapa: 'dad0ccb6-d8e2-11eb-b8bc-0242ac130003',
        id_grado_escolar: '248f063b-5ae3-5824-8bf3-d445f93d37aa',
      },
      {
        id: '53d8dca9-3b0f-4b17-a261-e8a5be6e82a7',
        total_preguntas: 5,
        preguntas_curricula: 3,
        preguntas_olimpiada: 2,
        puntos_pregunta_curricula: 50,
        puntos_pregunta_olimpiada: 50,
        duracion_minutos: 10,
        preguntas_curricula_baja: 1,
        puntaje_curricula_baja: 10,
        preguntas_curricula_media: 1,
        puntaje_curricula_media: 15,
        preguntas_curricula_alta: 1,
        puntaje_curricula_alta: 25,
        preguntas_olimpiada_baja: 1,
        puntaje_olimpiada_baja: 25,
        preguntas_olimpiada_media: 0,
        puntaje_olimpiada_media: 0,
        preguntas_olimpiada_alta: 1,
        puntaje_olimpiada_alta: 25,
        nro_posiciones_total: 3,
        nro_posiciones_rural: 1,
        criterio_calificacion: true,
        criterio_medallero: false,
        puntaje_minimo_clasificacion: 10,
        cantidad_maxima_clasificados: 10,
        puntaje_minimo_medallero: 51,
        id_area: 'f6b02355-e60f-4464-a1a2-52e784b1717f',
        id_etapa: '487fd6cb-5b19-421c-af3a-d2e8413e7b73',
        id_grado_escolar: '248f063b-5ae3-5824-8bf3-d445f93d37aa',
      },
      {
        id: 'c6fcdfc1-a587-4b76-a892-bd241ee914fd',
        total_preguntas: 5,
        preguntas_curricula: 3,
        preguntas_olimpiada: 2,
        puntos_pregunta_curricula: 50,
        puntos_pregunta_olimpiada: 50,
        duracion_minutos: 10,
        preguntas_curricula_baja: 1,
        puntaje_curricula_baja: 10,
        preguntas_curricula_media: 1,
        puntaje_curricula_media: 15,
        preguntas_curricula_alta: 1,
        puntaje_curricula_alta: 25,
        preguntas_olimpiada_baja: 1,
        puntaje_olimpiada_baja: 25,
        preguntas_olimpiada_media: 0,
        puntaje_olimpiada_media: 0,
        preguntas_olimpiada_alta: 1,
        puntaje_olimpiada_alta: 25,
        nro_posiciones_total: 3,
        nro_posiciones_rural: 1,
        criterio_calificacion: true,
        criterio_medallero: false,
        puntaje_minimo_clasificacion: 10,
        cantidad_maxima_clasificados: 10,
        puntaje_minimo_medallero: 51,
        id_area: '795f761d-2764-408e-94ea-7d5020bc30ac',
        id_etapa: 'dad0ccb6-d8e2-11eb-b8bc-0242ac130003',
        id_grado_escolar: '3bf6c70d-1ae6-47f9-9782-7fb863d89101',
      },
      {
        id: 'f1d878f4-5bd0-4026-892a-023871d1d69b',
        total_preguntas: 5,
        preguntas_curricula: 3,
        preguntas_olimpiada: 2,
        puntos_pregunta_curricula: 50,
        puntos_pregunta_olimpiada: 50,
        duracion_minutos: 10,
        preguntas_curricula_baja: 1,
        puntaje_curricula_baja: 10,
        preguntas_curricula_media: 1,
        puntaje_curricula_media: 15,
        preguntas_curricula_alta: 1,
        puntaje_curricula_alta: 25,
        preguntas_olimpiada_baja: 1,
        puntaje_olimpiada_baja: 25,
        preguntas_olimpiada_media: 0,
        puntaje_olimpiada_media: 0,
        preguntas_olimpiada_alta: 1,
        puntaje_olimpiada_alta: 25,
        nro_posiciones_total: 3,
        nro_posiciones_rural: 1,
        criterio_calificacion: true,
        criterio_medallero: false,
        puntaje_minimo_clasificacion: 10,
        cantidad_maxima_clasificados: 10,
        puntaje_minimo_medallero: 51,
        id_area: '795f761d-2764-408e-94ea-7d5020bc30ac',
        id_etapa: '487fd6cb-5b19-421c-af3a-d2e8413e7b73',
        id_grado_escolar: '3bf6c70d-1ae6-47f9-9782-7fb863d89101',
      },
    ];
    const data = items.map((item) => {
      const e = new EtapaAreaGrado();
      e.id = item.id;
      e.totalPreguntas = item.total_preguntas;
      e.preguntasCurricula = item.preguntas_curricula;
      e.preguntasOlimpiada = item.preguntas_olimpiada;
      e.puntosPreguntaCurricula = item.puntos_pregunta_curricula;
      e.puntosPreguntaOlimpiada = item.puntos_pregunta_olimpiada;
      e.duracionMinutos = item.duracion_minutos;
      e.preguntasCurriculaBaja = item.preguntas_curricula_baja;
      e.puntajeCurriculaBaja = item.puntaje_curricula_baja;
      e.preguntasCurriculaMedia = item.preguntas_curricula_media;
      e.puntajeCurriculaMedia = item.puntaje_curricula_media;
      e.preguntasCurriculaAlta = item.preguntas_curricula_alta;
      e.puntajeCurriculaAlta = item.puntaje_curricula_alta;
      e.preguntasOlimpiadaBaja = item.preguntas_olimpiada_baja;
      e.puntajeOlimpiadaBaja = item.puntaje_olimpiada_baja;
      e.preguntasOlimpiadaMedia = item.preguntas_olimpiada_media;
      e.puntajeOlimpiadaMedia = item.puntaje_olimpiada_media;
      e.preguntasOlimpiadaAlta = item.preguntas_olimpiada_alta;
      e.puntajeOlimpiadaAlta = item.puntaje_olimpiada_alta;
      e.nroPosicionesTotal = item.nro_posiciones_total;
      e.nroPosicionesRural = item.nro_posiciones_rural;
      e.criterioCalificacion = item.criterio_calificacion;
      e.criterioMedallero = item.criterio_medallero;
      e.puntajeMinimoClasificacion = item.puntaje_minimo_clasificacion;
      e.cantidadMaximaClasificados = item.cantidad_maxima_clasificados;
      e.puntajeMinimoMedallero = item.puntaje_minimo_medallero;
      e.color = Color[parseInt(`${Math.random() * Color.length}`)];
      e.usuarioCreacion = '1';
      const etapa = new Etapa();
      etapa.id = item.id_etapa;
      const area = new Area();
      area.id = item.id_area;
      const grado = new GradoEscolaridad();
      grado.id = item.id_grado_escolar;
      e.area = area;
      e.etapa = etapa;
      e.gradoEscolar = grado;
      return e;
    });
    await queryRunner.manager.save(data);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
