import { Test, TestingModule } from '@nestjs/testing';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { InscripcionRepository } from '../repository/inscripcion.repository';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { GradoEscolaridadRepository } from '../repository/gradoEscolaridad.repository';
import { EstudianteRepository } from '../repository/estudiante.repository';
import { UnidadEducativaRepository } from '../repository/unidadEducativa.repository';
import { AreaRepository } from '../repository/area.repository';
import { InscripcionService } from './inscripcion.service';
import { InscripcionCreacionDto } from '../dto/inscripcion.dto';
import { TextService } from '../../../common/lib/text.service';

const resInscripcion = {
  id: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
  idImportacion: '80730602JZ',
  estado: 'INACTIVO',
  etapaAreaGrado: {
    id: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
    gradoEscolar: {
      nombre: 'Primero de secundaria',
    },
  },
  etapa: {
    id: '66b7d7aa-ea70-49c7-8263-906a07668fc1',
    nombre: 'Uno',
    estado: 'CONFIGURACION_COMPETENCIA',
    tipo: 'DISTRITAL',
  },
  estudiante: {
    id: '19eacbcc-3519-45ce-9de7-1ac2eee0aab7',
    rude: 'RUDE0001',
    persona: {
      id: 'df882bc3-a839-4205-87e6-a8cf36c2927f',
      nombres: 'JUANCITO',
      primerApellido: 'PINTO',
      segundoApellido: 'ESCOBAR',
      tipoDocumento: 'CI',
      nroDocumento: '7894545',
      fechaNacimiento: '2010-01-01',
      genero: '',
    },
  },
};

const inscripcionCreacion = {
  idImportacion: '8073060A2E',
  idEtapaAreaGrado: '66b7d7aa-ea70-49c7-8263-906a07668fc1',
  idUnidadEducativa: 'd277ed90-d730-583b-bb24-aca999f2edcb',
  estudiante: {
    rude: 'RUEEiE9087q',
    persona: {
      nombres: 'testing',
      primerApellido: 'testing',
      segundoApellido: 'ESCOBAR',
      tipoDocumento: 'CI',
      nroDocumento: '7894545otros1',
      fechaNacimiento: '2010-01-01',
      genero: '',
      telefono: '',
      correoElectronico: '',
    },
  },
};

const etaAreaGrado = {
  id: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
  totalPreguntas: 10,
  preguntasCurricula: 6,
  preguntasOlimpiada: 4,
  puntosPreguntaCurricula: '10.00',
  puntosPreguntaOlimpiada: '10.00',
  duracionMinutos: 10,
  preguntasCurriculaBaja: 2,
  puntajeCurriculaBaja: '5.00',
  preguntasCurriculaMedia: 2,
  puntajeCurriculaMedia: '5.00',
  preguntasCurriculaAlta: 2,
  puntajeCurriculaAlta: '10.00',
  preguntasOlimpiadaBaja: 2,
  puntajeOlimpiadaBaja: '5.00',
  preguntasOlimpiadaMedia: 2,
  puntajeOlimpiadaMedia: '5.00',
  preguntasOlimpiadaAlta: 2,
  puntajeOlimpiadaAlta: '10.00',
  nroPosicionesTotal: 8,
  puntajeMinimoClasificacion: '51.00',
  estado: 'ACTIVO',
  etapa: {
    id: '66b7d7aa-ea70-49c7-8263-906a07668fc1',
    nombre: 'Uno',
    estado: 'CONFIGURACION_COMPETENCIA',
    tipo: 'DISTRITAL',
  },
  area: {
    id: '0a55e851-622e-4465-8d72-c7ba2cf79c79',
    nombre: 'Matemáticas',
  },
  gradoEscolar: {
    id: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
    nombre: 'Primero de secundaria',
  },
};

const unidadEducativa = {
  id: 'd277ed90-d730-583b-bb24-aca999f2edcb',
  codigoSie: 80730628,
  nombre: 'SAGRADOS CORAZONES B ',
  tipoUnidadEducativa: 'CONVENIO',
  areaGeografica: 'URBANO',
  seccion: 'TERCERA SECCIÓN (VILLA TUNARI)',
  localidad: 'ETERAZAMA',
  estado: 'ACTIVO',
  distrito: {
    id: '4049f17f-9760-42c7-bee9-7afb3f0865ae',
    nombre: 'Cotahuma',
  },
};

describe('InscripcionService', () => {
  let service: InscripcionService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InscripcionService,
        {
          provide: InscripcionRepository,
          useValue: {
            listar: jest.fn(() => [[resInscripcion], 1]),
            buscarPorId: jest.fn(() => resInscripcion),
            crearActualizar: jest.fn(() => resInscripcion),
            actualizarEstado: jest.fn(() => resInscripcion),
            eliminar: jest.fn(() => resInscripcion),
            buscarPorIdImportacion: jest.fn(() => resInscripcion),
            buscarPorEtapaGrado: jest.fn(() => resInscripcion),
            buscarPorEtapa: jest.fn(() => resInscripcion),
          },
        },
        {
          provide: EtapaAreaGradoRepository,
          useValue: {
            buscarPorIds: jest.fn(() => {
              id: '2cb50146-b8da-419b-960a-91fc293ffbcf';
            }),
            buscarPorId: jest.fn(() => etaAreaGrado),
          },
        },
        {
          provide: UnidadEducativaRepository,
          useValue: {
            buscarPorId: jest.fn(() => unidadEducativa),
          },
        },
        {
          provide: EstudianteRepository,
          useValue: {
            crearActualizar: jest.fn(() => resInscripcion.estudiante),
            buscarEstudianteConDistintoRude: jest.fn(() => 0),
            buscarRudeConDistintoEstudiante: jest.fn(() => 0),
          },
        },
        AreaRepository,
        GradoEscolaridadRepository,
      ],
    }).compile();

    service = module.get<InscripcionService>(InscripcionService);
  });

  it('[listar] Deberia obtener la lista de etapas', async () => {
    const paginacion = new PaginacionQueryDto();
    const idEtapaAreaGrado = TextService.generateUuid();
    const inscripciones = await service.listar(idEtapaAreaGrado, paginacion);
    expect(inscripciones).toHaveProperty('filas');
    expect(inscripciones).toHaveProperty('total');
    expect(inscripciones.filas).toBeInstanceOf(Array);
    expect(inscripciones.total).toBeDefined();
  });
  it('[listarPorGrupo] Deberia obtener etapa por ID', async () => {
    const inscripcion = await service.buscarPorId('idEtapa');
    expect(inscripcion).toHaveProperty('idImportacion');
    expect(inscripcion).toHaveProperty('id');
    expect(inscripcion).toHaveProperty('etapaAreaGrado');
    expect(inscripcion).toHaveProperty('estudiante');
  });

  it('[crear] Deberia crear un nueva etapa', async () => {
    const inscripcion = new InscripcionCreacionDto();
    inscripcion.estudiante = inscripcionCreacion.estudiante;
    inscripcion.idEtapaAreaGrado = inscripcionCreacion.idEtapaAreaGrado;
    inscripcion.idUnidadEducativa = inscripcionCreacion.idUnidadEducativa;
    const result = await service.crearActualizar(inscripcion, '1');
    expect(result).toBeDefined();
  });

  it('[eliminar] Deberia eliminar una etapa', async () => {
    const id = TextService.generateUuid();
    const usuarioAudi = TextService.generateUuid();
    const result = await service.eliminar(id, usuarioAudi);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });
});
