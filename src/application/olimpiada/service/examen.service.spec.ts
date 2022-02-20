import { Test, TestingModule } from '@nestjs/testing';
import * as dayjs from 'dayjs';

import { ExamenService } from './examen.service';
import { EstudianteExamenRepository } from '../repository/estudianteExamen.repository';
import { EstudianteExamenDetalleRepository } from '../repository/estudianteExamenDetalle.repository';
import { CalendarioRepository } from '../repository/calendario.repository';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { NotFoundException, PreconditionFailedException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Status } from '../../../common/constants';

let resultEstudianteExamen, resultCalendario, resultEstudianteExamenDetalle;
// realDateNow, // dateNowStub;
const idExamen = '66bc95e7-20bd-4c90-b286-d16fec33a144';
// const literallyJustDateNow = () => Date.now();

describe('ExamenService', () => {
  let examenService: ExamenService;
  let estudianteExamenRepository: EstudianteExamenRepository;
  let estudianteExamenDetalleRepository: EstudianteExamenDetalleRepository;
  let calendarioRepository: CalendarioRepository;
  let etapaAreaGradoRepository: EtapaAreaGradoRepository;
  beforeEach(async () => {
    // realDateNow = Date.now.bind(global.Date);
    // dateNowStub = jest.fn(() => 1530518207007);
    resultEstudianteExamen = {
      idExamen: 'aadacc5e-c9ec-4ff8-9ee2-847e4ed502f8',
      fechaHoraInicio: null,
      fechaHoraFin: null,
      duracionMinutos: 60,
      tipoPrueba: 'ONLINE',
      estado: 'ACTIVO',
      idEtapaAreaGrado: '793e2227-770d-5692-8852-d9efdcc6a4d7',
      idEstudiante: '954c7fdb-f54d-47ef-97d0-10464b244652',
    };
    resultCalendario = {
      id: '7eba1568-ffc6-49e8-9926-dbd0ef1346c4',
      tipoPrueba: 'ONLINE',
      fechaHoraInicio: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
      fechaHoraFin: dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    };
    resultEstudianteExamenDetalle = [
      {
        id: '8f93a1af-0a01-4081-aadf-2a27b0ab3ec6',
        tipoPregunta: 'SELECCCION_MULTIPLE',
        textoPregunta:
          'Un bloque de madera flota primeramente en agua y luego en un líquido de densidad relativa 0.6 (respecto al agua). La relación entre el volumen sumergido en el líquido al sumergido en el aguatiene un valor de:',
        imagenPregunta: 'https://i.ibb.co/5rDFxv4/velocidad-mru.jpg',
        opciones: {
          a: '3/5',
          b: '5/3',
          c: '1.6',
          d: 'Ninguna respuesta anterior es correcta.',
        },
        respuestas: ['a'],
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamenService,
        EstudianteExamenRepository,
        EstudianteExamenDetalleRepository,
        CalendarioRepository,
        SchedulerRegistry,
        EtapaAreaGradoRepository,
      ],
    }).compile();
    examenService = module.get<ExamenService>(ExamenService);
    estudianteExamenRepository = module.get<EstudianteExamenRepository>(
      EstudianteExamenRepository,
    );
    estudianteExamenDetalleRepository = module.get<EstudianteExamenDetalleRepository>(
      EstudianteExamenDetalleRepository,
    );
    calendarioRepository = module.get<CalendarioRepository>(
      CalendarioRepository,
    );
    etapaAreaGradoRepository = module.get<EtapaAreaGradoRepository>(
      EtapaAreaGradoRepository,
    );
  });

  // afterEach(async () => {
  //   global.Date.now = realDateNow;
  // });

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2020, 3, 1));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('[validarInciarExamen] deberia retornar error si no encuntra el examen', async () => {
    jest
      .spyOn(estudianteExamenRepository, 'obtenerExamenPorId')
      .mockImplementation(null);
    expect.assertions(2);
    try {
      await examenService.validarInciarExamen(idExamen);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Not Found');
    }
  });

  it('[validarInciarExamen] deberia retornar error si el tipoExamen es OFFLINE', async () => {
    resultEstudianteExamen.tipoPrueba = 'OFFLINE';
    jest
      .spyOn(estudianteExamenRepository, 'obtenerExamenPorId')
      .mockImplementation(() => Promise.resolve(resultEstudianteExamen));
    expect.assertions(2);
    try {
      await examenService.validarInciarExamen(idExamen);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('No se encontro la prueba para modo ONLINE');
    }
  });

  it('[validarInciarExamen] deberia retornar error si el estado del examen es diferente a ACTIVO', async () => {
    resultEstudianteExamen.estado = 'EN_PROCESO';
    jest
      .spyOn(estudianteExamenRepository, 'obtenerExamenPorId')
      .mockImplementation(() => Promise.resolve(resultEstudianteExamen));
    expect.assertions(2);
    try {
      await examenService.validarInciarExamen(idExamen);
    } catch (error) {
      expect(error).toBeInstanceOf(PreconditionFailedException);
      expect(error.message).toBe(
        'No se puede iniciar la prueba, este se encuentra en estado EN_PROCESO',
      );
    }
  });

  it('[validarInciarExamen] deberia retornar error si no se encuentra en el periodo habilitado', async () => {
    resultCalendario.fechaHoraFin = resultCalendario.fechaHoraInicio;
    jest
      .spyOn(estudianteExamenRepository, 'obtenerExamenPorId')
      .mockImplementation(() => Promise.resolve(resultEstudianteExamen));
    jest
      .spyOn(calendarioRepository, 'obtenerCalendarioOnlinePorIdEtapaAreaGrado')
      .mockImplementation(() => Promise.resolve(resultCalendario));
    expect.assertions(2);
    try {
      await examenService.validarInciarExamen(idExamen);
    } catch (error) {
      expect(error).toBeInstanceOf(PreconditionFailedException);
      expect(error.message).toBe(
        'No se puede iniciar la prueba, debe esperar a el horario habilidato',
      );
    }
  });

  it('[validarInciarExamen] deberia retornar un objeto examenEstudiante (validacion exitosa)', async () => {
    jest
      .spyOn(estudianteExamenRepository, 'obtenerExamenPorId')
      .mockImplementation(() => Promise.resolve(resultEstudianteExamen));
    jest
      .spyOn(calendarioRepository, 'obtenerCalendarioOnlinePorIdEtapaAreaGrado')
      .mockImplementation(() => Promise.resolve(resultCalendario));
    const result = await examenService.validarInciarExamen(idExamen);
    const examen = { ...resultEstudianteExamen };
    expect(result).toEqual(examen);
  });

  it('[validarExamenEnCurso] deberia retornar error si no encuntra el examen', async () => {
    jest
      .spyOn(estudianteExamenRepository, 'obtenerExamenPorId')
      .mockImplementation(null);
    expect.assertions(2);
    try {
      await examenService.validarExamenEnCurso(idExamen);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Not Found');
    }
  });

  it('[validarExamenEnCurso] deberia retornar error si no encuntra el examen', async () => {
    jest
      .spyOn(estudianteExamenRepository, 'obtenerExamenPorId')
      .mockImplementation(null);
    expect.assertions(2);
    try {
      await examenService.validarExamenEnCurso(idExamen);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Not Found');
    }
  });

  it('[validarExamenEnCurso] deberia retornar error si el estado del examen es diferente de EN_PROCESO', async () => {
    jest
      .spyOn(estudianteExamenRepository, 'obtenerExamenPorId')
      .mockImplementation(() => Promise.resolve(resultEstudianteExamen));
    expect.assertions(2);
    try {
      await examenService.validarExamenEnCurso(idExamen);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(
        'No se encontró la prueba o este no está en curso',
      );
    }
  });

  it('[validarExamenEnCurso] deberia retornar error si el examen no este en el periodo', async () => {
    (resultEstudianteExamen.fechaHoraInicio = dayjs()
      .subtract(70, 'm')
      .format('YYYY-MM-DD HH:mm:ss')),
      (resultEstudianteExamen.fechaHoraFin = dayjs()
        .subtract(10, 'm')
        .format('YYYY-MM-DD HH:mm:ss')),
      (resultEstudianteExamen.estado = 'EN_PROCESO');
    jest
      .spyOn(estudianteExamenRepository, 'obtenerExamenPorId')
      .mockImplementation(() => Promise.resolve(resultEstudianteExamen));
    expect.assertions(2);
    try {
      await examenService.validarExamenEnCurso(idExamen);
    } catch (error) {
      expect(error).toBeInstanceOf(PreconditionFailedException);
      expect(error.message).toBe('El tiempo de la prueba a concluido');
    }
  });

  it('[validarExamenEnCurso] deberia retornar un objeto estudianteExamen (validacion exitosa)', async () => {
    (resultEstudianteExamen.fechaHoraInicio = dayjs()
      .subtract(15, 'm')
      .format('YYYY-MM-DD HH:mm:ss')),
      (resultEstudianteExamen.fechaHoraFin = dayjs()
        .add(60, 'm')
        .format('YYYY-MM-DD HH:mm:ss')),
      (resultEstudianteExamen.estado = 'EN_PROCESO');
    jest
      .spyOn(estudianteExamenRepository, 'obtenerExamenPorId')
      .mockImplementation(() => Promise.resolve(resultEstudianteExamen));
    const result = await examenService.validarExamenEnCurso(idExamen);
    const examen = { ...resultEstudianteExamen };
    expect(result).toEqual(examen);
  });

  it('[construirObjetoExamen] deberia retornar un objeto examen', async () => {
    // global.Date.now = dateNowStub;
    resultEstudianteExamen.estado = 'EN_PROCESO';
    jest
      .spyOn(estudianteExamenRepository, 'obtenerExamenPorId')
      .mockImplementation(() => Promise.resolve(resultEstudianteExamen));
    jest
      .spyOn(estudianteExamenDetalleRepository, 'listarPreguntasPorIdExamen')
      .mockImplementation(() => Promise.resolve(resultEstudianteExamenDetalle));
    const examen = { ...resultEstudianteExamen };
    examen.fechaHoraInicio = 0;
    examen.fechaHoraFin = 0;
    delete examen.idEtapaAreaGrado;
    examen.preguntas = resultEstudianteExamenDetalle;
    const result = await examenService.construirObjetoExamen(
      resultEstudianteExamen,
    );
    examen.fechaHoraServidor = new Date().getTime();
    expect(result).toEqual(examen);
  });

  it('[finalizarExamen] deberia finalizar un examen estado en curso', async () => {
    const data = {
      area: 'Matemáticas',
      rude: '86768762058118',
      olimpiada: 'Olimpiadas científicas',
      estudiante: 'XXXX YYYY ZZZZ',
      departamento: 'LA PAZ',
      gradoEscolar: 'Primero de secundaria',
      distritoEducativo: 'Distrito educativo test',
    };

    resultEstudianteExamen.fechaInicio = new Date();
    resultEstudianteExamen.fechaFin = new Date();
    resultEstudianteExamen.data = data;
    jest.spyOn(examenService, 'validarFinalizarExamen').mockImplementation(() =>
      Promise.resolve({
        examen: resultEstudianteExamen,
        estado: Status.FINALIZADO,
      }),
    );
    // global.Date.now = dateNowStub;
    const spy = jest
      .spyOn(estudianteExamenRepository, 'finalizarExamen')
      .mockImplementation(() => Promise.resolve(null));
    jest.spyOn(examenService, 'eliminarTimeoutExamen').mockImplementation(null);
    const result = await examenService.finalizarExamen(idExamen, {
      metadata: {},
      usuarioAuditoria: 'test',
    });

    const fechaActual = new Date();
    const expectedResult: any = { ...data };
    expectedResult.fechaInicio = resultEstudianteExamen.fechaInicio.getTime();
    expectedResult.fechaFinalizacion = fechaActual.getTime();

    expect(spy).toHaveBeenCalledWith(idExamen, {
      fechaConclusion: fechaActual,
      metadata: {},
      usuarioAuditoria: 'test',
    });
    expect(result).toEqual(expectedResult);
  });

  it('[finalizarExamen] deberia finalizar un examen estado timeout', async () => {
    // global.Date.now = dateNowStub;
    const data = {
      area: 'Matemáticas',
      rude: '86768762058118',
      olimpiada: 'Olimpiadas científicas',
      estudiante: 'XXXX YYYY ZZZZ',
      departamento: 'LA PAZ',
      gradoEscolar: 'Primero de secundaria',
      distritoEducativo: 'Distrito educativo test',
    };

    resultEstudianteExamen.fechaInicio = new Date();
    resultEstudianteExamen.fechaFin = new Date();
    resultEstudianteExamen.data = data;
    jest.spyOn(examenService, 'validarFinalizarExamen').mockImplementation(() =>
      Promise.resolve({
        examen: resultEstudianteExamen,
        estado: Status.TIMEOUT,
      }),
    );
    jest.spyOn(examenService, 'eliminarTimeoutExamen').mockImplementation(null);
    const spy = jest
      .spyOn(estudianteExamenRepository, 'timeoutExamen')
      .mockImplementation(() => Promise.resolve(null));
    const result = await examenService.finalizarExamen(idExamen, {
      metadata: {},
      usuarioAuditoria: 'test',
    });

    const expectedResult: any = { ...data };
    expectedResult.fechaInicio = resultEstudianteExamen.fechaInicio.getTime();
    expectedResult.fechaFinalizacion = resultEstudianteExamen.fechaFin.getTime();

    expect(spy).toHaveBeenCalledWith(idExamen, {
      fechaFin: resultEstudianteExamen.fechaFin,
      metadata: {},
      usuarioAuditoria: 'test',
    });
    expect(result).toEqual(expectedResult);
  });

  it('[recuperarExamen] deberia recuperar un examen en curso (retorna el objeto examen)', async () => {
    const spyValidarExamenEnCurso = jest
      .spyOn(examenService, 'validarExamenEnCurso')
      .mockImplementation(() => Promise.resolve(resultEstudianteExamen));
    const spyConstruirObjetoExamen = jest
      .spyOn(examenService, 'construirObjetoExamen')
      .mockImplementation(() => Promise.resolve({}));
    await examenService.recuperarExamen(idExamen, {});
    expect(spyValidarExamenEnCurso).toHaveBeenCalledWith(idExamen);
    expect(spyConstruirObjetoExamen).toHaveBeenCalledWith(
      resultEstudianteExamen,
    );
  });

  it('[iniciarExamen] deberia iniciar un examen (retorna el objeto examen)', async () => {
    // global.Date.now = dateNowStub;

    const spyValidarInciarExamen = jest
      .spyOn(examenService, 'validarInciarExamen')
      .mockImplementation(() => Promise.resolve(resultEstudianteExamen));
    const spyIniciarExamen = jest
      .spyOn(estudianteExamenRepository, 'iniciarExamen')
      .mockImplementation(() => Promise.resolve(null));
    const spyConstruirObjetoExamen = jest
      .spyOn(examenService, 'construirObjetoExamen')
      .mockImplementation(() => Promise.resolve({}));
    jest
      .spyOn(examenService, 'programarTimeoutExamen')
      .mockImplementation(null);

    await examenService.iniciarExamen(idExamen, {
      metadata: {},
      usuarioAuditoria: 'test',
    });

    const fechaInicio = new Date();
    const fechaFin = new Date(
      fechaInicio.getTime() +
        resultEstudianteExamen.duracionMinutos * 60 * 1000,
    );

    resultEstudianteExamen.fechaHoraInicio = fechaInicio;
    resultEstudianteExamen.fechaHoraFin = fechaFin;

    expect(spyValidarInciarExamen).toHaveBeenCalledWith(idExamen);
    expect(spyIniciarExamen).toHaveBeenCalledWith(idExamen, {
      fechaInicio,
      fechaFin,
      metadata: {},
      usuarioAuditoria: 'test',
    });
    expect(spyConstruirObjetoExamen).toHaveBeenCalledWith(
      resultEstudianteExamen,
    );
  });
});
