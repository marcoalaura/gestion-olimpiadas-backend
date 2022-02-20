import { Test, TestingModule } from '@nestjs/testing';

import { EstudianteController } from '../controller/estudiante.controller';
import { EstudianteService } from './estudiante.service';
import { EstudianteRepository } from '../repository/estudiante.repository';
import { EstudianteExamenDetalleRepository } from '../repository/estudianteExamenDetalle.repository';
import { AUTHZ_ENFORCER } from 'nest-authz';

const idEstudiante = '19eacbcc-3519-45ce-9de7-1ac2eee0aab7';

const resExamenes = {
  idExamen: '1194425e-ffe8-485f-b42c-cacf32ed70d1',
  estado: 'ACTIVO',
  calendarioFechaHoraInicio: 1618401600000,
  calendarioFechaHoraFin: 1618405200000,
  duracionMinutos: 10,
  area: 'Matemáticas',
  etapa: 'Uno',
  gradoEscolar: 'Primero de secundaria',
  olimpiada: 'Olimpiadas científicas',
};

const resEstudiante = {
  id: '1234567',
  rude: 'RUDE0001',
  persona: {
    nombres: 'JUANCITO',
    primerApellido: 'PINTO',
    segundoApellido: 'ESCOBAR',
    nroDocumento: '7894545',
  },
};

describe('EstudianteController - EstudianteService', () => {
  let estudianteController: EstudianteController;
  let estudianteService: EstudianteService;
  let estudianteRepository: EstudianteRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstudianteController],
      providers: [
        EstudianteService,
        {
          provide: EstudianteRepository,
          useValue: {
            encontrarExamenes: jest.fn(() => resEstudiante),
            obtenerEstudiantes: jest.fn(() => [resEstudiante]),
            encontrarPorId: jest.fn(() => resEstudiante),
            encontrarEstudiantePorCiRude: jest.fn(() => resEstudiante),
          },
        },
        {
          provide: EstudianteExamenDetalleRepository,
          useValue: {},
        },
        {
          provide: AUTHZ_ENFORCER,
          useValue: {},
        },
      ],
    }).compile();
    estudianteController = module.get<EstudianteController>(
      EstudianteController,
    );
    estudianteService = module.get<EstudianteService>(EstudianteService);
    estudianteRepository = module.get<EstudianteRepository>(
      EstudianteRepository,
    );

    jest
      .spyOn(estudianteRepository, 'encontrarExamenes')
      .mockImplementation((id) => {
        if (id !== idEstudiante) {
          return Promise.resolve([]);
        }
        return Promise.resolve([
          Object.assign(resExamenes, {
            fechaHoraInicio: new Date(1618401600000),
            fechaHoraFin: new Date(1618405200000),
          }),
        ]);
      });
    jest
      .spyOn(estudianteRepository, 'obtenerEstudiantes')
      .mockImplementation(() => Promise.resolve([[], 0]));
    jest
      .spyOn(estudianteRepository, 'encontrarPorId')
      .mockImplementation(() => Promise.resolve(undefined));
    jest
      .spyOn(estudianteRepository, 'encontrarEstudiantePorCiRude')
      .mockImplementation((ci, rude) => {
        let resp = undefined;
        if (ci === '1234567' && rude === 'RUDE0001') {
          resp = resEstudiante;
        }
        return Promise.resolve(resp);
      });
  });

  it('[EstudianteController] deberia devolver una array vacio', async () => {
    const examenes = await estudianteService.encontrarExamenes(
      'idEstudiante',
      'idOlimpiada',
    );
    expect(examenes).toEqual([]);
    const lista = await estudianteController.obtenerEstudianteExamenes(
      { query: { idOlimpiada: 'idOlimpiada' } },
      { id: 'idEstudiante' },
    );
    expect(lista).toHaveProperty('finalizado', true);
    expect(lista).toHaveProperty('mensaje');
    expect(lista).toHaveProperty('datos');
    expect(lista.datos.filas).toEqual([]);
    expect.assertions(5);
  });

  it('[EstudianteService] deberia devolver un array con un elemento', async () => {
    const examenes = await estudianteService.encontrarExamenes(
      idEstudiante,
      'idOlimpiada',
    );
    expect(examenes).toEqual([resExamenes]);
    const lista = await estudianteController.obtenerEstudianteExamenes(
      { query: { idOlimpiada: 'idOlimpiada' } },
      { id: idEstudiante },
    );
    expect(lista).toHaveProperty('finalizado', true);
    expect(lista).toHaveProperty('mensaje');
    expect(lista).toHaveProperty('datos');
    expect(lista.datos.filas).toEqual([resExamenes]);
    expect.assertions(5);
  });

  it('[EstudianteController] debería devolver un array vacio', async () => {
    const lista = await estudianteController.obtenerEstudiantes({
      saltar: 0,
      limite: 1,
      orden: null,
    });
    expect(lista).toHaveProperty('finalizado', true);
    expect(lista).toHaveProperty('mensaje');
    expect(lista).toHaveProperty('datos');
    expect(lista.datos).toEqual({
      total: 0,
      filas: [],
    });
  });

  it('[EstudianteControlller] debería devolver datos = undefined', async () => {
    const lista = await estudianteController.ObtenerEstudianteId({
      id: idEstudiante,
    });
    expect(lista).toHaveProperty('finalizado', true);
    expect(lista).toHaveProperty('mensaje');
    expect(lista).toHaveProperty('datos', undefined);
  });

  it('[EstudianteService] debería devolver datos del estudiante', async () => {
    let datos = await estudianteService.encontrarEstudiantePorCiRude(
      '1234567malo',
      'RUDEmalo',
    );
    expect(datos).toEqual(undefined);
    datos = await estudianteService.encontrarEstudiantePorCiRude(
      '1234567',
      'RUDE0001',
    );
    expect(datos).toHaveProperty('id');
    expect(datos).toHaveProperty('rude');
    expect(datos).toHaveProperty('persona');
  });
});
