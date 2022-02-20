import { Test, TestingModule } from '@nestjs/testing';
import { InscripcionRepository } from '../repository/inscripcion.repository';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { EstudianteExamenDetalleRepository } from '../repository/estudianteExamenDetalle.repository';
import { EstudianteExamenRepository } from '../repository/estudianteExamen.repository';
import { EtapaRepository } from '../repository/etapa.repository';
import { ResultadosRepository } from '../repository/resultados.repository';
import { CalificacionService } from './calificacion.service';

const resPreguntas = [
  {
    id: '96090d7a-0b06-4f8f-942b-c93bf9cc8d63',
    respuestas: {
      r1: 'a',
    },
    pregunta: {
      tipoPregunta: 'CURRICULA',
      nivelDificultad: 'BASICA',
      textoPregunta:
        '\n                Un cañón dispara un proyectil con una velocidad inicial de 400 m/seg que forma un ángulo de 30° con la horizontal. Calcular:\n                Las ecuaciones del movimiento y la ecuación de la trayectoria.\n                La altura máxima y el alcance.\n                El ángulo qué forma la velocidad horizontal al pasar por la posición xx ( figura adjunta)\n                tiro parábolico\n                ',
      imagenPregunta: null,
      tipoRespuesta: 'SELECCION_SIMPLE',
      opciones: {
        a: '30 grados',
        b: '70 grados',
        c: '45 grados',
        d: 'Ninguna respuesta anterior es correcta.',
      },
      respuestas: ['a'],
      estado: 'CREADO',
      etapaAreaGrado: {
        fechaCreacion: '2021-07-09T13:59:38.334Z',
        usuarioCreacion: '1',
        fechaActualizacion: '2021-07-09T13:59:38.334Z',
        usuarioActualizacion: null,
        id: '793e2227-770d-5692-8852-d9efdcc6a4d7',
        totalPreguntas: 10,
        preguntasCurricula: 4,
        preguntasOlimpiada: 6,
        puntosPreguntaCurricula: '40.00',
        puntosPreguntaOlimpiada: '60.00',
        duracionMinutos: 10,
        preguntasCurriculaBaja: 1,
        puntajeCurriculaBaja: '10.00',
        preguntasCurriculaMedia: 1,
        puntajeCurriculaMedia: '10.00',
        preguntasCurriculaAlta: 2,
        puntajeCurriculaAlta: '10.00',
        preguntasOlimpiadaBaja: 2,
        puntajeOlimpiadaBaja: '10.00',
        preguntasOlimpiadaMedia: 2,
        puntajeOlimpiadaMedia: '10.00',
        preguntasOlimpiadaAlta: 2,
        puntajeOlimpiadaAlta: '10.00',
        nroPosicionesTotal: 3,
        nroPosicionesRural: 2,
        puntajeMinimoMedallero: '60.00',
        criterioCalificacion: true,
        puntajeMinimoClasificacion: '65.00',
        criterioMedallero: false,
        cantidadMaximaClasificados: 10,
        estado: 'ACTIVO',
        color: '#7a2048',
        idEtapa: '88bdc57a-4ba2-41c4-98b0-23d719c5c999',
        idGradoEscolar: '248f063b-5ae3-5824-8bf3-d445f93d37aa',
        idArea: 'f6b02355-e60f-4464-a1a2-52e784b1717f',
      },
    },
  },
  {
    id: 'b7a520eb-fb77-438f-ad36-80d6487e6173',
    respuestas: {
      r1: 'a',
    },
    pregunta: {
      tipoPregunta: 'CURRICULA',
      nivelDificultad: 'INTERMEDIA',
      textoPregunta:
        '\n              La longitud de los minutos en un reloj es de 4.5 cm. Encuentre la longitud del arco trazada al final de la manecilla de minutos entre 11:10 pm e 11:50 pm.\n                ',
      imagenPregunta: null,
      tipoRespuesta: 'SELECCION_SIMPLE',
      opciones: {
        a: 'R θ = 4.5 cm 250 × π / 110',
        b: 'R θ = 4.5 cm 240 × π / 180',
        c: 'R θ = 4.5 cm 240 × π / 180',
        d: 'R θ = 4.5 cm 260 × π / 130',
      },
      respuestas: ['b'],
      estado: 'CREADO',
      etapaAreaGrado: {
        fechaCreacion: '2021-07-09T13:59:38.334Z',
        usuarioCreacion: '1',
        fechaActualizacion: '2021-07-09T13:59:38.334Z',
        usuarioActualizacion: null,
        id: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        totalPreguntas: 5,
        preguntasCurricula: 3,
        preguntasOlimpiada: 2,
        puntosPreguntaCurricula: '50.00',
        puntosPreguntaOlimpiada: '50.00',
        duracionMinutos: 10,
        preguntasCurriculaBaja: 1,
        puntajeCurriculaBaja: '10.00',
        preguntasCurriculaMedia: 1,
        puntajeCurriculaMedia: '15.00',
        preguntasCurriculaAlta: 1,
        puntajeCurriculaAlta: '25.00',
        preguntasOlimpiadaBaja: 1,
        puntajeOlimpiadaBaja: '25.00',
        preguntasOlimpiadaMedia: 0,
        puntajeOlimpiadaMedia: '0.00',
        preguntasOlimpiadaAlta: 1,
        puntajeOlimpiadaAlta: '25.00',
        nroPosicionesTotal: 3,
        nroPosicionesRural: 1,
        puntajeMinimoMedallero: '51.00',
        criterioCalificacion: true,
        puntajeMinimoClasificacion: '10.00',
        criterioMedallero: false,
        cantidadMaximaClasificados: 10,
        estado: 'ACTIVO',
        color: '#322e2f',
        idEtapa: '66b7d7aa-ea70-49c7-8263-906a07668fc1',
        idGradoEscolar: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        idArea: '0a55e851-622e-4465-8d72-c7ba2cf79c79',
      },
    },
  },
  {
    id: '9f44f439-2cf7-4946-af30-02f1aa22701c',
    respuestas: {
      r1: 'FALSO',
    },
    pregunta: {
      tipoPregunta: 'CURRICULA',
      nivelDificultad: 'INTERMEDIA',
      textoPregunta:
        '\n                Si el limx→∞f(x)=∞ylimx→∞g(x)=−∞ entonces limx→∞[f(x)+g(x)]=0\n                ',
      imagenPregunta: null,
      tipoRespuesta: 'FALSO_VERDADERO',
      opciones: null,
      respuestas: ['FALSO'],
      estado: 'CREADO',
      etapaAreaGrado: {
        fechaCreacion: '2021-07-09T13:59:38.334Z',
        usuarioCreacion: '1',
        fechaActualizacion: '2021-07-09T13:59:38.334Z',
        usuarioActualizacion: null,
        id: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        totalPreguntas: 5,
        preguntasCurricula: 3,
        preguntasOlimpiada: 2,
        puntosPreguntaCurricula: '50.00',
        puntosPreguntaOlimpiada: '50.00',
        duracionMinutos: 10,
        preguntasCurriculaBaja: 1,
        puntajeCurriculaBaja: '10.00',
        preguntasCurriculaMedia: 1,
        puntajeCurriculaMedia: '15.00',
        preguntasCurriculaAlta: 1,
        puntajeCurriculaAlta: '25.00',
        preguntasOlimpiadaBaja: 1,
        puntajeOlimpiadaBaja: '25.00',
        preguntasOlimpiadaMedia: 0,
        puntajeOlimpiadaMedia: '0.00',
        preguntasOlimpiadaAlta: 1,
        puntajeOlimpiadaAlta: '25.00',
        nroPosicionesTotal: 3,
        nroPosicionesRural: 1,
        puntajeMinimoMedallero: '51.00',
        criterioCalificacion: true,
        puntajeMinimoClasificacion: '10.00',
        criterioMedallero: false,
        cantidadMaximaClasificados: 10,
        estado: 'ACTIVO',
        color: '#322e2f',
        idEtapa: '66b7d7aa-ea70-49c7-8263-906a07668fc1',
        idGradoEscolar: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
        idArea: '0a55e851-622e-4465-8d72-c7ba2cf79c79',
      },
    },
  },
  {
    id: '382c367c-e219-47fa-9ff9-c08778b991d7',
    respuestas: {
      r1: 'a',
      r2: 'b',
      r3: 'd',
    },
    pregunta: {
      tipoPregunta: 'CURRICULA',
      nivelDificultad: 'COMPLEJA',
      textoPregunta:
        '\n              Afirmacion(es) sobre energía potencial y mecánica:\n                ',
      imagenPregunta: null,
      tipoRespuesta: 'SELECCION_MULTIPLE',
      opciones: {
        a:
          'La energía mecánica del cuerpo permanece constante durante toda la caída',
        b: 'La energía potencial varía linealmente con la altura',
        c:
          ' Supuesto el suelo como nivel de energía potencial nula, la energía potencial iguala a la cinética a la mitad del camino entre el nivel inicial y el suelo ',
        d: 'Ninguna respuesta anterior es correcta.',
      },
      respuestas: ['a', 'b', 'c'],
      estado: 'CREADO',
      etapaAreaGrado: {
        fechaCreacion: '2021-07-09T13:59:38.334Z',
        usuarioCreacion: '1',
        fechaActualizacion: '2021-07-09T13:59:38.334Z',
        usuarioActualizacion: null,
        id: '793e2227-770d-5692-8852-d9efdcc6a4d7',
        totalPreguntas: 10,
        preguntasCurricula: 4,
        preguntasOlimpiada: 6,
        puntosPreguntaCurricula: '40.00',
        puntosPreguntaOlimpiada: '60.00',
        duracionMinutos: 10,
        preguntasCurriculaBaja: 1,
        puntajeCurriculaBaja: '10.00',
        preguntasCurriculaMedia: 1,
        puntajeCurriculaMedia: '10.00',
        preguntasCurriculaAlta: 2,
        puntajeCurriculaAlta: '10.00',
        preguntasOlimpiadaBaja: 2,
        puntajeOlimpiadaBaja: '10.00',
        preguntasOlimpiadaMedia: 2,
        puntajeOlimpiadaMedia: '10.00',
        preguntasOlimpiadaAlta: 2,
        puntajeOlimpiadaAlta: '10.00',
        nroPosicionesTotal: 3,
        nroPosicionesRural: 2,
        puntajeMinimoMedallero: '60.00',
        criterioCalificacion: true,
        puntajeMinimoClasificacion: '65.00',
        criterioMedallero: false,
        cantidadMaximaClasificados: 10,
        estado: 'ACTIVO',
        color: '#7a2048',
        idEtapa: '88bdc57a-4ba2-41c4-98b0-23d719c5c999',
        idGradoEscolar: '248f063b-5ae3-5824-8bf3-d445f93d37aa',
        idArea: 'f6b02355-e60f-4464-a1a2-52e784b1717f',
      },
    },
  },
];

const fakeInscripciones = [
  {
    idInscripcion: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
    idEtapaAreaGrado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
    idUnidadEducativa: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
    unidadEducativa: 'ROSA GATTORNO',
    codigoSie: 80730390,
    idEstudianteExamen: '1194425e-ffe8-485f-b42c-cacf32ed70d1',
    fechaInicio: null,
    fechaFin: null,
    fechaConclusion: null,
    examenEstado: 'FINALIZADO',
    tipoPrueba: 'ONLINE',
  },
];
describe('CalificacionService', () => {
  let service: CalificacionService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalificacionService,
        {
          provide: EstudianteExamenDetalleRepository,
          useValue: {
            listarPreguntasPorIdExamenParaCalificar: jest.fn(
              () => resPreguntas,
            ),
            save: jest.fn(() => []),
            update: jest.fn(() => []),
          },
        },
        {
          provide: EtapaAreaGradoRepository,
          useValue: {
            listarPreguntasPorIdExamenParaCalificar: jest.fn(
              () => resPreguntas,
            ),
          },
        },
        EtapaRepository,
        InscripcionRepository,
        {
          provide: EstudianteExamenRepository,
          useValue: {
            save: jest.fn(() => []),
            calcularPuntajeTotal: jest.fn(() => []),
          },
        },
        ResultadosRepository,
        {
          provide: ResultadosRepository,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CalificacionService>(CalificacionService);
  });

  it('[Calificació] Debería calificar las preguntas de un 1 examen - 1 inscripción', async () => {
    const inscripcionesCalificadas = await service.calificarInscripciones(
      fakeInscripciones,
      1,
    );
    expect(inscripcionesCalificadas).toBeDefined();
    expect(inscripcionesCalificadas[0]).toContainEqual({
      id: '96090d7a-0b06-4f8f-942b-c93bf9cc8d63',
      estado: 'FINALIZADO',
      puntaje: '10.00',
      usuarioCreacion: 1,
    });
    expect(inscripcionesCalificadas[0]).toContainEqual({
      id: 'b7a520eb-fb77-438f-ad36-80d6487e6173',
      estado: 'FINALIZADO',
      puntaje: '0',
      usuarioCreacion: 1,
    });
    expect(inscripcionesCalificadas[0]).toContainEqual({
      id: '9f44f439-2cf7-4946-af30-02f1aa22701c',
      estado: 'FINALIZADO',
      puntaje: '15.00',
      usuarioCreacion: 1,
    });
    expect(inscripcionesCalificadas[0]).toContainEqual({
      id: '382c367c-e219-47fa-9ff9-c08778b991d7',
      estado: 'FINALIZADO',
      puntaje: '6.666666666666666',
      usuarioCreacion: 1,
    });
  });
});
