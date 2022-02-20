import { Test, TestingModule } from '@nestjs/testing';
import { ReporteService } from './reporte.service';
import { ReporteRepository } from './reporte.repository';
import { OlimpiadaService } from '../olimpiada/olimpiada.service';
import { EtapaRepository } from '../olimpiada/repository/etapa.repository';
import { AreaRepository } from '../olimpiada/repository/area.repository';
import { DistritoRepository } from '../olimpiada/repository/distrito.repository';
import { DepartamentoRepository } from '../olimpiada/repository/departamento.repository';
import { GradoEscolaridadRepository } from '../olimpiada/repository/gradoEscolaridad.repository';
import { OlimpiadaRepository } from '../olimpiada/olimpiada.repository';
import { EtapaAreaGradoRepository } from '../olimpiada/repository/etapaAreaGrado.repository';
import { EtapaService } from '../olimpiada/service/etapa.service';
import { CarboneService } from '../../../libs/carbone/src';
import { FileService } from '../../../libs/file/src';
import { LoggerModule, PinoLogger } from 'nestjs-pino';

describe('ReporteService', () => {
  let service: ReporteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      providers: [
        ReporteService,
        {
          provide: ReporteRepository,
          useValue: {},
        },
        OlimpiadaService,
        {
          provide: OlimpiadaRepository,
          useValue: {},
        },
        EtapaService,
        {
          provide: EtapaRepository,
          useValue: {},
        },
        {
          provide: AreaRepository,
          useValue: {},
        },
        {
          provide: DistritoRepository,
          useValue: {},
        },
        {
          provide: DepartamentoRepository,
          useValue: {},
        },
        {
          provide: GradoEscolaridadRepository,
          useValue: {},
        },
        {
          provide: EtapaAreaGradoRepository,
          useValue: {},
        },
        CarboneService,
        FileService,
        PinoLogger,
      ],
    }).compile();

    service = module.get<ReporteService>(ReporteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
