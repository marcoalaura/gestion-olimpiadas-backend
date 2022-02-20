import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';
import { EstudianteRepository } from '../../olimpiada/repository/estudiante.repository';
import { EtapaAreaGradoRepository } from '../../olimpiada/repository/etapaAreaGrado.repository';
import { UnidadEducativaRepository } from '../../../application/olimpiada/repository/unidadEducativa.repository';
import { InscripcionRepository } from '../../../application/olimpiada/repository/inscripcion.repository';
import { PreguntaService } from '../../../application/olimpiada/service/pregunta.service';

describe('EstudianteService', () => {
  let service: EstudianteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstudianteService,
        {
          provide: PreguntaService,
          useValue: {
            validarDatosFragmento: jest.fn(() => ({ finalizado: true })),
          },
        },
        EstudianteRepository,
        EtapaAreaGradoRepository,
        UnidadEducativaRepository,
        InscripcionRepository,
      ],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
  });

  it('deberia estar definido', () => {
    expect(service).toBeDefined();
  });
});
