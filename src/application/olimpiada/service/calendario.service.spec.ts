import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, PreconditionFailedException } from '@nestjs/common';
import * as dayjs from 'dayjs';

import { CalendarioService } from './calendario.service';
import { EtapaService } from './etapa.service';
import { CalendarioRepository } from '../repository/calendario.repository';
import { EtapaRepository } from '../repository/etapa.repository';
import { OlimpiadaRepository } from '../olimpiada.repository';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { MedalleroPosicionRepository } from '../repository/medalleroPosicion.repository';
import { InscripcionRepository } from '../repository/inscripcion.repository';

import { Status } from '../../../common/constants';

let resultCalendario;
const idCalendario = '19b07dd5-07b2-4622-b721-177b2a4f7c8e';

describe('PreguntaService', () => {
  let calendarioService: CalendarioService;
  let etapaService: EtapaService;
  let calendarioRepository: CalendarioRepository;

  beforeEach(async () => {
    resultCalendario = {
      id: '19b07dd5-07b2-4622-b721-177b2a4f7c8e',
      tipoPrueba: 'OFFLINE',
      fechaHoraInicio: '2021-05-14T20:00:00.000Z',
      fechaHoraFin: '2021-05-15T00:00:00.000Z',
      estado: 'CREADO',
      idEtapaAreaGrado: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CalendarioService,
        EtapaService,
        CalendarioRepository,
        OlimpiadaRepository,
        EtapaRepository,
        EtapaAreaGradoRepository,
        MedalleroPosicionRepository,
        InscripcionRepository,
      ],
    }).compile();
    calendarioService = module.get<CalendarioService>(CalendarioService);
    etapaService = module.get<EtapaService>(EtapaService);
    calendarioRepository = module.get<CalendarioRepository>(
      CalendarioRepository,
    );
  });
  it('[validarFechasCalendario] deberia retornar error si la fecha fin es anterior a la fecha inicio', async () => {
    expect.assertions(2);
    try {
      await calendarioService.validarFechasCalendario({
        fechaHoraInicio: dayjs().add(10, 'm'),
        fechaHoraFin: new Date(),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(PreconditionFailedException);
      expect(error.message).toBe(
        'La fecha fin debe ser posterior a la fecha inicio',
      );
    }
  });
  it('[validarFechasCalendario] deberia retornar error si la fecha inicio es antes que la fecha actual', async () => {
    expect.assertions(2);
    try {
      await calendarioService.validarFechasCalendario({
        fechaHoraInicio: dayjs().subtract(10, 'm'),
        fechaHoraFin: dayjs(),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(PreconditionFailedException);
      expect(error.message).toBe(
        'La fecha incio del calendario no puede ser en el pasado',
      );
    }
  });
  it('[validarFechasCalendario] deberia retornar error si la fecha fin es antes que la fecha actual', async () => {
    expect.assertions(2);
    try {
      await calendarioService.validarFechasCalendario({
        fechaHoraInicio: dayjs().subtract(20, 'm'),
        fechaHoraFin: dayjs().subtract(10, 'm'),
      });
    } catch (error) {
      expect(error).toBeInstanceOf(PreconditionFailedException);
      expect(error.message).toBe(
        'La fecha incio del calendario no puede ser en el pasado',
      );
    }
  });
  it('[obtenerCalendarioPorId] deberia retornar error si no encuntra el calendrio', async () => {
    jest.spyOn(calendarioRepository, 'buscarPorId').mockImplementation(null);
    expect.assertions(2);
    try {
      await calendarioService.obtenerCalendarioPorId(idCalendario);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Not Found');
    }
  });
  it('[obtenerCalendarioPorId] deberia retornar error si el estado del calendario es ELIMINADO', async () => {
    resultCalendario.estado = Status.ELIMINADO;
    jest
      .spyOn(calendarioRepository, 'buscarPorId')
      .mockImplementation(() => Promise.resolve(resultCalendario));
    expect.assertions(2);
    try {
      await calendarioService.obtenerCalendarioPorId(idCalendario);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Not Found');
    }
  });
  it('[obtenerCalendarioPorId] deberia retornar un calendario si los datos son correctos', async () => {
    const spyBuscarPorId = jest
      .spyOn(calendarioRepository, 'buscarPorId')
      .mockImplementation(() => Promise.resolve(resultCalendario));
    await calendarioService.obtenerCalendarioPorId(idCalendario);
    expect(spyBuscarPorId).toHaveBeenCalledWith(idCalendario);
  });
  it('[validarActualizarDatos] deberia retornar error si el estado del calendario es diferente de CREADO', async () => {
    const hitos = [Status.CONFIGURACION_COMPETENCIA];
    resultCalendario.estado = Status.ACTIVE;
    jest
      .spyOn(calendarioService, 'obtenerCalendarioPorId')
      .mockImplementation(() => Promise.resolve(resultCalendario));
    expect.assertions(2);
    try {
      await calendarioService.validarActualizarDatos(idCalendario, {}, hitos);
    } catch (error) {
      expect(error).toBeInstanceOf(PreconditionFailedException);
      expect(error.message).toBe(
        `No se puede ejecutar la solicitud, el calendario se encuentra en estado: ${resultCalendario.estado}`,
      );
    }
  });
  it('[obtenerCalendarioPorId] no deberia retornar exepciones si los datos son correctos', async () => {
    const spyObtenerCalendarioPorId = jest
      .spyOn(calendarioService, 'obtenerCalendarioPorId')
      .mockImplementation(() => Promise.resolve(resultCalendario));
    const spyValidarVigenciaDeLaEtapa = jest
      .spyOn(etapaService, 'validarVigenciaDeLaEtapa')
      .mockImplementation(null);
    await calendarioService.obtenerCalendarioPorId(idCalendario);
    expect(spyObtenerCalendarioPorId).toHaveBeenCalledWith(idCalendario);
  });
  it('[eliminarCalendario] deberia eliminar un calendario si la solicitud es correcta', async () => {
    jest
      .spyOn(calendarioService, 'validarActualizarDatos')
      .mockImplementation(null);
    const spyActualizarEstado = jest
      .spyOn(calendarioRepository, 'actualizarEstado')
      .mockImplementation(() => Promise.resolve(null));
    const data = {
      id: idCalendario,
      estado: Status.ELIMINADO,
    };
    const result = await calendarioService.eliminarCalendario(idCalendario, {});
    expect(spyActualizarEstado).toHaveBeenCalledWith(data);
    expect(result).toEqual(null);
  });
});
