import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, PreconditionFailedException } from '@nestjs/common';

jest.mock('uuid');
import * as uuid from 'uuid';

import { PreguntaService } from './pregunta.service';
import { EtapaService } from './etapa.service';
import { PreguntaRepository } from '../repository/pregunta.repository';
import { EtapaRepository } from '../repository/etapa.repository';
import { OlimpiadaRepository } from '../olimpiada.repository';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { MedalleroPosicionRepository } from '../repository/medalleroPosicion.repository';
import { EstudianteExamenRepository } from '../repository/estudianteExamen.repository';
import { EstudianteExamenDetalleRepository } from '../repository/estudianteExamenDetalle.repository';
import { InscripcionRepository } from '../repository/inscripcion.repository';

import {
  Transition,
  Status,
  TipoRespuesta,
  Rol,
} from '../../../common/constants';
import { EtapaAreaGrado } from '../entity/EtapaAreaGrado.entity';

import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { totalRowsResponse } from '../../../common/lib/http.module';

let resultPregunta;
const idPregunta = 'c9930379-5dc1-556f-847c-802dd9d1d9b6';
const hitos = [Status.CONFIGURACION_COMPETENCIA];

describe('PreguntaService', () => {
  let preguntaService: PreguntaService;
  let etapaService: EtapaService;
  let preguntaRepository: PreguntaRepository;

  beforeEach(async () => {
    resultPregunta = {
      id: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
      tipoPregunta: 'CURRICULA',
      nivelDificultad: 'MEDIA',
      textoPregunta:
        'Un bloque de madera flota primeramente en agua y luego en un líquido de densidad relativa 0.6 (respecto al agua). La relación entre el volumen sumergido en el líquido al sumergido en el aguatiene un valor de:',
      imagenPregunta: null,
      tipoRespuesta: 'SELECCCION_MULTIPLE',
      opciones: {
        a: '3/5',
        b: '5/3',
        c: '1.6',
        d: 'Ninguna',
      },
      respuestas: ['b', 'a'],
      estado: Status.CREATE,
      idEtapaAreaGrado: '793e2227-770d-5692-8852-d9efdcc6a4d7',
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreguntaService,
        EtapaService,
        PreguntaRepository,
        OlimpiadaRepository,
        EtapaRepository,
        EtapaAreaGradoRepository,
        MedalleroPosicionRepository,
        EstudianteExamenRepository,
        EstudianteExamenDetalleRepository,
        InscripcionRepository,
      ],
    }).compile();
    preguntaService = module.get<PreguntaService>(PreguntaService);
    etapaService = module.get<EtapaService>(EtapaService);
    preguntaRepository = module.get<PreguntaRepository>(PreguntaRepository);
  });
  it('[obtenerPreguntaPorId] deberia retornar error si no encuntra la pregunta', async () => {
    jest.spyOn(preguntaRepository, 'buscarPorId').mockImplementation(null);
    expect.assertions(2);
    try {
      await preguntaService.obtenerPreguntaPorId(idPregunta);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Not Found');
    }
  });
  it('[obtenerPreguntaPorId] deberia retornar error si el estado de la pregunta es ELIMINADO', async () => {
    resultPregunta.estado = Status.ELIMINADO;
    jest
      .spyOn(preguntaRepository, 'buscarPorId')
      .mockImplementation(() => Promise.resolve(resultPregunta));
    expect.assertions(2);
    try {
      await preguntaService.obtenerPreguntaPorId(idPregunta);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('Not Found');
    }
  });
  it('[validarActualizarEstado] deberia retornar el nuevo estado si la transision es correcta', async () => {
    jest
      .spyOn(preguntaService, 'obtenerPreguntaPorId')
      .mockImplementation(() => Promise.resolve(resultPregunta));
    const spyValidarVigenciaDeLaEtapa = jest
      .spyOn(etapaService, 'validarVigenciaDeLaEtapa')
      .mockImplementation(null);
    const result = await preguntaService.validarActualizarEstado(
      idPregunta,
      Transition.ENVIAR,
    );
    expect(spyValidarVigenciaDeLaEtapa).toHaveBeenCalledWith(
      resultPregunta.idEtapaAreaGrado,
      hitos,
    );
    expect(result).toBe(Status.ENVIADO);
  });
  it('[validarActualizarDatos] deberia retornar error si el estado es diferente de CREADO o OBSERVADO', async () => {
    resultPregunta.estado = Status.APROBADO;
    jest
      .spyOn(preguntaService, 'obtenerPreguntaPorId')
      .mockImplementation(() => Promise.resolve(resultPregunta));
    expect.assertions(2);
    try {
      await preguntaService.validarActualizarDatos(idPregunta);
    } catch (error) {
      expect(error).toBeInstanceOf(PreconditionFailedException);
      expect(error.message).toBe(
        'No se puede ejecutar la solicitud, la pregunta se encuentra en estado: APROBADO',
      );
    }
  });
  it('[validarActualizarEstado] deberia retornar null si la solitud es correcta', async () => {
    jest
      .spyOn(preguntaService, 'obtenerPreguntaPorId')
      .mockImplementation(() => Promise.resolve(resultPregunta));
    const spyValidarVigenciaDeLaEtapa = jest
      .spyOn(etapaService, 'validarVigenciaDeLaEtapa')
      .mockImplementation(null);
    const result = await preguntaService.validarActualizarDatos(idPregunta);
    expect(spyValidarVigenciaDeLaEtapa).toHaveBeenCalledWith(
      resultPregunta.idEtapaAreaGrado,
      hitos,
    );
    expect(result).toBe(null);
  });
  it('[eliminarPregunta] deberia eliminar una pregunta si la solicitud es correcta', async () => {
    jest
      .spyOn(preguntaService, 'validarActualizarEstado')
      .mockImplementation(() => Promise.resolve(Status.ELIMINADO));
    const spyActualizarEstado = jest
      .spyOn(preguntaRepository, 'actualizarEstado')
      .mockImplementation(() => Promise.resolve(null));
    const data = {
      id: idPregunta,
      estado: Status.ELIMINADO,
    };
    const result = await preguntaService.eliminarPregunta(idPregunta, {});
    expect(spyActualizarEstado).toHaveBeenCalledWith(data);
    expect(result).toEqual(null);
  });
  it('[actualizarEstado] deberia actualizar el estado de una pregunta si la solicitud es correcta', async () => {
    jest
      .spyOn(preguntaService, 'validarActualizarEstado')
      .mockImplementation(() => Promise.resolve(Status.ENVIADO));
    const spyActualizarEstado = jest
      .spyOn(preguntaRepository, 'actualizarEstado')
      .mockImplementation(() => Promise.resolve(null));
    const data = {
      id: idPregunta,
      estado: Status.ENVIADO,
    };
    const result = await preguntaService.actualizarEstado({
      idPregunta,
      operacion: Transition.ENVIAR,
    });
    expect(spyActualizarEstado).toHaveBeenCalledWith(data);
    expect(result).toEqual({ id: idPregunta });
  });
  it('[actualizarPregunta] deberia retornar error si no se tiene texto o imagen', async () => {
    jest
      .spyOn(preguntaService, 'validarActualizarDatos')
      .mockImplementation(null);
    expect.assertions(2);
    try {
      await preguntaService.actualizarPregunta({});
    } catch (error) {
      expect(error).toBeInstanceOf(PreconditionFailedException);
      expect(error.message).toBe('La pregunta debe contener un texto o imagen');
    }
  });
  it('[actualizarPregunta] deberia actualizar los datos de una pregunta si la solicitud es correcta', async () => {
    jest
      .spyOn(preguntaService, 'validarActualizarDatos')
      .mockImplementation(null);
    const spyActualizarPregunta = jest
      .spyOn(preguntaRepository, 'actualizarPregunta')
      .mockImplementation(() => Promise.resolve(null));
    const params = {
      tipoPregunta: 'CURRICULA',
      nivelDificultad: 'MEDIA',
      textoPregunta:
        'Un bloque de madera flota primeramente en agua y luego en un líquido de densidad relativa 0.6 (respecto al agua). La relación entre el volumen sumergido en el líquido al sumergido en el aguatiene un valor de:',
      imagenPregunta: null,
      tipoRespuesta: 'SELECCCION_MULTIPLE',
      opciones: {
        a: '3/5',
        b: '5/3',
        c: '1.6',
        d: 'Ninguna',
      },
      respuestas: ['b', 'a'],
    };
    const data = {
      idPregunta,
      ...params,
    };
    const result = await preguntaService.actualizarPregunta(data);
    expect(spyActualizarPregunta).toHaveBeenCalledWith(idPregunta, params);
    expect(result).toEqual({ id: idPregunta });
  });
  it('[crearPregunta] deberia retornar error si tipo respuesta es de seleccion y no se envia opciones', async () => {
    jest
      .spyOn(etapaService, 'validarVigenciaDeLaEtapa')
      .mockImplementation(null);
    expect.assertions(2);
    const data = {
      textoPregunta: 'alguna pregunta',
      tipoRespuesta: TipoRespuesta.SELECCION_MULTIPLE,
    };
    try {
      await preguntaService.crearPregunta(data);
    } catch (error) {
      expect(error).toBeInstanceOf(PreconditionFailedException);
      expect(error.message).toBe(
        'El campo opciones no puede ser null para preguntas de selección',
      );
    }
  });
  it('[crearPregunta] deberia crear una pregunta si los datos son correctos', async () => {
    jest.spyOn(uuid, 'v4').mockReturnValue(idPregunta);
    jest
      .spyOn(etapaService, 'validarVigenciaDeLaEtapa')
      .mockImplementation(null);
    const spyCrear = jest
      .spyOn(preguntaRepository, 'crear')
      .mockImplementation(() => Promise.resolve(null));
    const data = {
      tipoPregunta: 'CURRICULA',
      nivelDificultad: 'MEDIA',
      textoPregunta:
        'Un bloque de madera flota primeramente en agua y luego en un líquido de densidad relativa 0.6 (respecto al agua). La relación entre el volumen sumergido en el líquido al sumergido en el aguatiene un valor de:',
      imagenPregunta: null,
      tipoRespuesta: 'SELECCCION_MULTIPLE',
      opciones: {
        a: '3/5',
        b: '5/3',
        c: '1.6',
        d: 'Ninguna',
      },
      respuestas: ['b', 'c'],
      idEtapaAreaGrado: '793e2227-770d-5692-8852-d9efdcc6a4d7',
    };
    const id = uuid.v4();
    const eag = new EtapaAreaGrado();
    const expectData: any = { ...data };
    expectData.id = id;
    expectData.estado = Status.CREATE;
    eag.id = expectData.idEtapaAreaGrado;
    expectData.etapaAreaGrado = eag;
    delete expectData.idEtapaAreaGrado;
    const result = await preguntaService.crearPregunta(data);
    expect(spyCrear).toHaveBeenCalledWith(expectData);
    expect(result).toEqual({ id });
  });
  it('[listarPreguntas] deberia una lista de preguntas', async () => {
    const spyListarPorEtapaAreaGrado = jest
      .spyOn(preguntaRepository, 'listarPorEtapaAreaGrado')
      .mockImplementation(() => Promise.resolve([[resultPregunta], 1]));
    const idEtapaAreaGrado = 'c9930379-5dc1-556f-847c-802dd9d1d9b6';
    const paginacionQueryDto = new PaginacionQueryDto();
    const result = await preguntaService.listarPreguntas(
      idEtapaAreaGrado,
      Rol.COMITE_DOCENTE_CARGA,
      'usuario_test',
      paginacionQueryDto,
    );
    expect(spyListarPorEtapaAreaGrado).toHaveBeenCalledWith(
      idEtapaAreaGrado,
      Rol.COMITE_DOCENTE_CARGA,
      'usuario_test',
      paginacionQueryDto,
    );
    expect(result).toEqual(totalRowsResponse([[resultPregunta], 1]));
  });
});
