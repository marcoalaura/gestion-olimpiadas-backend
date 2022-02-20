import { Test, TestingModule } from '@nestjs/testing';
import { TextService } from '../../../common/lib/text.service';
import { EtapaRepository } from '../repository/etapa.repository';
import { OlimpiadaRepository } from '../../olimpiada/olimpiada.repository';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { MedalleroPosicionRepository } from '../repository/medalleroPosicion.repository';
import { MedalleroPosicionRuralRepository } from '../repository/medalleroPosicionRural.repository';
import { PreguntaRepository } from '../repository/pregunta.repository';
import { InscripcionRepository } from '../repository/inscripcion.repository';
import { EstudianteExamenRepository } from '../repository/estudianteExamen.repository';
import { EstudianteExamenDetalleRepository } from '../repository/estudianteExamenDetalle.repository';
import { CalendarioRepository } from '../repository/calendario.repository';
import { AreaRepository } from '../repository/area.repository';
import { GradoEscolaridadRepository } from '../repository/gradoEscolaridad.repository';
import { ObtencionMedalleroRepository } from '../repository/obtencionMedallero.repository';
import { DepartamentoRepository } from '../repository/departamento.repository';
import { ResultadosRepository } from '../repository/resultados.repository';
import { ObtencionClasificadosRepository } from '../repository/obtencionClasificados.repository';
import { DistritoRepository } from '../repository/distrito.repository';
import { Connection } from 'typeorm';
import { GestionEtapaService } from './gestionEtapa.service';
import { EtapaService } from './etapa.service';
import { SorteoPreguntaService } from './sorteoPregunta.service';
import { EtapaAreaGradoService } from './etapaAreaGrado.service';
import { CalendarioService } from './calendario.service';
import { ObtencionMedalleroService } from './obtencion-medallero.service';
import { ObtenerClasificadosService } from './obtencion-clasificados.service';
import { PublicacionResultadoService } from './publicacionResultado.service';
import { ExamenService } from './examen.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { LoggerModule, PinoLogger } from 'nestjs-pino';
import { Status } from '../../../common/constants';

const resEtapa = {
  id: '38c82d7e-325e-4e8e-b5d4-94b0084077e7',
  nombre: 'Final',
  tipo: 'NACIONAL',
  fechaInicio: new Date(),
  fechaFin: new Date(),
  fechaInicioImpugnacion: new Date(),
  fechaFinImpugnacion: new Date(),
  estado: 'ACTIVO',
  jerarquia: 1,
  olimpiada: {
    id: '97303a51-8570-453f-9e67-1a06537c0744',
    estado: Status.ACTIVE,
  },
};

const resOlimpiada = {
  id: '97303a51-8570-453f-9e67-1a06537c0744',
  nombre: 'Olimpiada 2020',
  estado: Status.ACTIVE,
  fechaInicio: new Date(),
  fechaFin: new Date(),
  fechaInicioImpugnacion: new Date(),
  fechaFinImpugnacion: new Date(),
};

describe('GestionEtapaService', () => {
  let service: GestionEtapaService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      providers: [
        GestionEtapaService,
        {
          provide: Connection,
          useValue: {
            name: jest.fn().mockImplementation(() => null),
          },
        },
        EtapaService,
        {
          provide: EtapaRepository,
          useValue: {
            buscarPorId: jest.fn(() => resEtapa),
            contarConfiguracionMinimaPorEtapa: jest.fn(() => 0),
            contarPorTipo: jest.fn(() => 0),
            contarEtapasCruzadas: jest.fn(() => 0),
            contarEtapasAnteriores: jest.fn(() => 0),
            contarEtapasPosteriores: jest.fn(() => 0),
            contarEtapasRompenOrden: jest.fn(() => 0),
          },
        },
        SorteoPreguntaService,
        CalendarioService,
        {
          provide: OlimpiadaRepository,
          useValue: {
            buscarPorId: jest.fn(() => resOlimpiada),
          },
        },
        EtapaAreaGradoService,
        {
          provide: EtapaAreaGradoRepository,
          useValue: {},
        },
        {
          provide: MedalleroPosicionRepository,
          useValue: {
            contarConfiguracionPorEtapa: jest.fn(() => 1),
          },
        },
        {
          provide: MedalleroPosicionRuralRepository,
          useValue: {
            contarConfiguracionPorEtapa: jest.fn(() => 1),
          },
        },
        {
          provide: PreguntaRepository,
          useValue: {},
        },
        {
          provide: InscripcionRepository,
          useValue: {},
        },
        {
          provide: EstudianteExamenRepository,
          useValue: {},
        },
        {
          provide: EstudianteExamenDetalleRepository,
          useValue: {},
        },
        {
          provide: CalendarioRepository,
          useValue: {},
        },
        {
          provide: AreaRepository,
          useValue: {},
        },
        {
          provide: GradoEscolaridadRepository,
          useValue: {},
        },
        {
          provide: DistritoRepository,
          useValue: {},
        },
        ObtencionMedalleroService,
        {
          provide: ObtencionMedalleroRepository,
          useValue: {},
        },
        {
          provide: DepartamentoRepository,
          useValue: {},
        },
        ObtenerClasificadosService,
        {
          provide: ObtencionClasificadosRepository,
          useValue: {},
        },
        PublicacionResultadoService,
        {
          provide: ResultadosRepository,
          useValue: {},
        },
        ExamenService,
        {
          provide: SchedulerRegistry,
          useValue: {},
        },
        PinoLogger,
      ],
    }).compile();

    service = module.get<GestionEtapaService>(GestionEtapaService);
  });

  it('[actualizar] Deberia actualizar el estada de una etapa', async () => {
    const id = TextService.generateUuid();
    const operacion = 'grados';

    const usuarioAuditoria = TextService.generateUuid();

    const result = await service.validarActualizarEstado(
      id,
      operacion,
      usuarioAuditoria,
      null,
    );
    expect(result).toBeDefined();
  });
});
