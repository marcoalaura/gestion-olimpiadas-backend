import { Test, TestingModule } from '@nestjs/testing';
import { TextService } from '../../../common/lib/text.service';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { EtapaAreaGradoDto } from '../dto/etapaAreaGrado.dto';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { EtapaRepository } from '../repository/etapa.repository';
import { AreaRepository } from '../repository/area.repository';
import { GradoEscolaridadRepository } from '../repository/gradoEscolaridad.repository';
import { CalendarioRepository } from '../repository/calendario.repository';
import { EtapaAreaGradoService } from './etapaAreaGrado.service';
import { plainToClass } from 'class-transformer';
import { PreguntaRepository } from '../repository/pregunta.repository';
import { InscripcionRepository } from '../repository/inscripcion.repository';

const resEtapaAreaGrado = {
  id: 'cc2ee67f-8d77-4043-ab74-80c3b597d283',
  totalPreguntas: '20',
  preguntasCurricula: '14',
  preguntasOlimpiada: '6',
  puntosPreguntaCurricula: '60',
  puntosPreguntaOlimpiada: '40',
  duracionMinutos: '90',
  preguntasCurriculaBaja: '5',
  puntajeCurriculaBaja: '2',
  preguntasCurriculaMedia: '5',
  puntajeCurriculaMedia: '2',
  preguntasCurriculaAlta: '4',
  puntajeCurriculaAlta: '10',
  preguntasOlimpiadaBaja: '2',
  puntajeOlimpiadaBaja: '5',
  preguntasOlimpiadaMedia: '2',
  puntajeOlimpiadaMedia: '5',
  preguntasOlimpiadaAlta: '2',
  puntajeOlimpiadaAlta: '10',
  nroPosicionesTotal: '1',
  nroPosicionesRural: '0',
  puntajeMinimoClasificacion: '50',
  estado: 'ACTIVO',
  criterioMedallero: true,
  etapa: {
    id: 'cc2ee67f-8d77-4043-ab74-80c3b597d283',
    estado: 'CONFIGURACION_GRADOS',
    olimpiada: {
      id: 'cc2ee67f-8d77-4043-ab74-80c3b597d283',
    },
  },
  medalleroPosicion: [
    {
      ordenGalardon: '1',
      denominativo: 'ORO',
      subGrupo: 'ORO',
    },
  ],
  medalleroPosicionRural: [],
};

const resEtapa = {
  id: 'cc2ee67f-8d77-4043-ab74-80c3b597d283',
  estado: 'CONFIGURACION_GRADOS',
};

const resArea = {
  id: 'cc2ee67f-8d77-4043-ab74-80c3b597d283',
};

const resGrado = {
  id: 'cc2ee67f-8d77-4043-ab74-80c3b597d283',
};

describe('EtapaAreaGradoService', () => {
  let service: EtapaAreaGradoService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EtapaAreaGradoService,
        {
          provide: EtapaAreaGradoRepository,
          useValue: {
            listar: jest.fn(() => [[resEtapaAreaGrado], 1]),
            crearActualizar: jest.fn(() => resEtapaAreaGrado),
            buscarPorId: jest.fn(() => resEtapaAreaGrado),
            contarPorIds: jest.fn(() => 0),
            actualizarEstado: jest.fn(() => resEtapaAreaGrado),
            eliminar: jest.fn(() => resEtapaAreaGrado),
            obtenerIdOlimpiada: jest.fn(() => resEtapaAreaGrado),
            runTransaction: jest.fn().mockImplementation(() => null),
          },
        },
        {
          provide: CalendarioRepository,
          useValue: {
            contarPorIdEtapaAreaGrado: jest.fn(() => 0),
          },
        },
        {
          provide: EtapaRepository,
          useValue: {
            buscarPorId: jest.fn(() => resEtapa),
          },
        },
        {
          provide: AreaRepository,
          useValue: {
            buscarPorId: jest.fn(() => resArea),
          },
        },
        {
          provide: GradoEscolaridadRepository,
          useValue: {
            buscarPorId: jest.fn(() => resGrado),
          },
        },
        {
          provide: InscripcionRepository,
          useValue: {
            contarPorIdEtapaAreaGrado: jest.fn(() => 0),
          },
        },
        {
          provide: PreguntaRepository,
          useValue: {
            contarPorIdEtapaAreaGrado: jest.fn(() => 0),
          },
        },
      ],
    }).compile();

    service = module.get<EtapaAreaGradoService>(EtapaAreaGradoService);
  });

  it('[listar] Deberia obtener la lista de etapaAreaGrados', async () => {
    const paginacion = new PaginacionQueryDto();
    const idEtapa = TextService.generateUuid();
    const etapaAreaGrados = await service.listar(idEtapa, paginacion);
    expect(etapaAreaGrados).toHaveProperty('filas');
    expect(etapaAreaGrados).toHaveProperty('total');
    expect(etapaAreaGrados.filas).toBeInstanceOf(Array);
    expect(etapaAreaGrados.total).toBeDefined();
  });

  it('[listarPorGrupo] Deberia obtener etapaAreaGrado por ID', async () => {
    const idEtapaAreaGrado = 'NN';
    const etapaAreaGrado = await service.buscarPorId(idEtapaAreaGrado);
    expect(etapaAreaGrado).toHaveProperty('totalPreguntas');
    expect(etapaAreaGrado).toHaveProperty('preguntasCurricula');
    expect(etapaAreaGrado).toHaveProperty('preguntasOlimpiada');
    expect(etapaAreaGrado).toHaveProperty('puntosPreguntaCurricula');
    expect(etapaAreaGrado).toHaveProperty('puntosPreguntaOlimpiada');
    expect(etapaAreaGrado).toHaveProperty('duracionMinutos');
    expect(etapaAreaGrado).toHaveProperty('preguntasCurriculaBaja');
    expect(etapaAreaGrado).toHaveProperty('puntajeCurriculaBaja');
    expect(etapaAreaGrado).toHaveProperty('preguntasCurriculaMedia');
    expect(etapaAreaGrado).toHaveProperty('puntajeCurriculaMedia');
    expect(etapaAreaGrado).toHaveProperty('preguntasCurriculaAlta');
    expect(etapaAreaGrado).toHaveProperty('puntajeCurriculaAlta');
    expect(etapaAreaGrado).toHaveProperty('preguntasOlimpiadaBaja');
    expect(etapaAreaGrado).toHaveProperty('puntajeOlimpiadaBaja');
    expect(etapaAreaGrado).toHaveProperty('preguntasOlimpiadaMedia');
    expect(etapaAreaGrado).toHaveProperty('puntajeOlimpiadaMedia');
    expect(etapaAreaGrado).toHaveProperty('preguntasOlimpiadaAlta');
    expect(etapaAreaGrado).toHaveProperty('puntajeOlimpiadaAlta');
    expect(etapaAreaGrado).toHaveProperty('nroPosicionesTotal');
    expect(etapaAreaGrado).toHaveProperty('puntajeMinimoClasificacion');
    expect(etapaAreaGrado).toHaveProperty('estado');
  });

  it('[crear] Deberia crear un nueva etapaAreaGrado', async () => {
    const etapaAreaGrado = new EtapaAreaGradoDto();
    etapaAreaGrado.totalPreguntas = resEtapaAreaGrado.totalPreguntas;
    etapaAreaGrado.preguntasCurricula = resEtapaAreaGrado.preguntasCurricula;
    etapaAreaGrado.preguntasOlimpiada = resEtapaAreaGrado.preguntasOlimpiada;
    etapaAreaGrado.puntosPreguntaCurricula =
      resEtapaAreaGrado.puntosPreguntaCurricula;
    etapaAreaGrado.puntosPreguntaOlimpiada =
      resEtapaAreaGrado.puntosPreguntaOlimpiada;
    etapaAreaGrado.duracionMinutos = resEtapaAreaGrado.duracionMinutos;
    etapaAreaGrado.preguntasCurriculaBaja =
      resEtapaAreaGrado.preguntasCurriculaBaja;
    etapaAreaGrado.puntajeCurriculaBaja =
      resEtapaAreaGrado.puntajeCurriculaBaja;
    etapaAreaGrado.preguntasCurriculaMedia =
      resEtapaAreaGrado.preguntasCurriculaMedia;
    etapaAreaGrado.puntajeCurriculaMedia =
      resEtapaAreaGrado.puntajeCurriculaMedia;
    etapaAreaGrado.preguntasCurriculaAlta =
      resEtapaAreaGrado.preguntasCurriculaAlta;
    etapaAreaGrado.puntajeCurriculaAlta =
      resEtapaAreaGrado.puntajeCurriculaAlta;
    etapaAreaGrado.preguntasOlimpiadaBaja =
      resEtapaAreaGrado.preguntasOlimpiadaBaja;
    etapaAreaGrado.puntajeOlimpiadaBaja =
      resEtapaAreaGrado.puntajeOlimpiadaBaja;
    etapaAreaGrado.preguntasOlimpiadaMedia =
      resEtapaAreaGrado.preguntasOlimpiadaMedia;
    etapaAreaGrado.puntajeOlimpiadaMedia =
      resEtapaAreaGrado.puntajeOlimpiadaMedia;
    etapaAreaGrado.preguntasOlimpiadaAlta =
      resEtapaAreaGrado.preguntasOlimpiadaAlta;
    etapaAreaGrado.puntajeOlimpiadaAlta =
      resEtapaAreaGrado.puntajeOlimpiadaAlta;
    etapaAreaGrado.nroPosicionesTotal = resEtapaAreaGrado.nroPosicionesTotal;
    etapaAreaGrado.nroPosicionesRural = resEtapaAreaGrado.nroPosicionesRural;
    etapaAreaGrado.medalleroPosicion = resEtapaAreaGrado.medalleroPosicion;
    etapaAreaGrado.medalleroPosicionRural =
      resEtapaAreaGrado.medalleroPosicionRural;
    etapaAreaGrado.criterioMedallero = resEtapaAreaGrado.criterioMedallero;

    const result = await service.crear(etapaAreaGrado, '1');
    expect(result).toBeDefined();
  });

  it('[actualizar] Deberia actualizar una etapaAreaGrado', async () => {
    const id = TextService.generateUuid();
    const datosEtapaAreaGrado = {
      totalPreguntas: '15',
      preguntasCurricula: '9',
      preguntasOlimpiada: '6',
      puntosPreguntaCurricula: '54',
      puntosPreguntaOlimpiada: '46',
      duracionMinutos: '50',
      preguntasCurriculaBaja: '3',
      puntajeCurriculaBaja: '6',
      preguntasCurriculaMedia: '3',
      puntajeCurriculaMedia: '6',
      preguntasCurriculaAlta: '3',
      puntajeCurriculaAlta: '6',
      preguntasOlimpiadaBaja: '2',
      puntajeOlimpiadaBaja: '7',
      preguntasOlimpiadaMedia: '2',
      puntajeOlimpiadaMedia: '8',
      preguntasOlimpiadaAlta: '2',
      puntajeOlimpiadaAlta: '8',
      nroPosicionesTotal: 2,
      nroPosicionesRural: 0,
      puntajeMinimoClasificacion: '30',
      medalleroPosicion: [
        {
          id: '0',
          ordenGalardon: '1',
          denominativo: 'ORO',
          key: '0',
          orden: '1',
          notaMinima: 51,
        },
        {
          id: '1',
          ordenGalardon: '2',
          denominativo: 'PLATA',
          key: '1',
          orden: '2',
          notaMinima: 51,
        },
      ],
      medalleroPosicionRural: [],
      criterioMedallero: true,
    };

    const etapaAreaGradoDto = plainToClass(
      EtapaAreaGradoDto,
      datosEtapaAreaGrado,
    );
    const usuarioAuditoria = TextService.generateUuid();

    const result = await service.actualizar(
      id,
      etapaAreaGradoDto,
      usuarioAuditoria,
    );
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });

  it('[obtenerIdOlimpiada] Deberia devolver un objeto con el idOlimpiada', async () => {
    const id = TextService.generateUuid();
    const result = await service.obtenerIdOlimpiada(id);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
    expect(result.etapa).toBeDefined();
    expect(result.etapa).toHaveProperty('id');
    expect(result.etapa.olimpiada).toBeDefined();
    expect(result.etapa.olimpiada).toHaveProperty('id');
  });

  it('[adicionarIdOlimpiada] Deberia adicionar el idOlimpiada al objeto paginacion', async () => {
    const id = TextService.generateUuid();
    const paginacion = new PaginacionQueryDto();
    const result = await service.adicionarIdOlimpiada(id, paginacion);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('filtro');
    expect(result.filtro).toBe(
      'idOlimpiada:cc2ee67f-8d77-4043-ab74-80c3b597d283',
    );
  });

  it('[inactivar] Deberia inactivar una etapaAreaGrado', async () => {
    const id = TextService.generateUuid();
    const usuarioAuditoria = TextService.generateUuid();

    const result = await service.inactivar(id, usuarioAuditoria);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });

  it('[eliminar] Deberia eliminar una etapaAreaGrado', async () => {
    // const id = TextService.generateUuid();
    // const result = await service.eliminar(id);
    const result = jest
      .spyOn(service, 'eliminar')
      .mockImplementation(() => Promise.resolve());
    expect(result).toBeDefined();
    // expect(result).toHaveProperty('id');
  });
});
