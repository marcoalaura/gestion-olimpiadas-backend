import { Test, TestingModule } from '@nestjs/testing';
import { PreguntaService } from './pregunta.service';
import { PreguntaRepository } from '../../olimpiada/repository/pregunta.repository';
import { EtapaAreaGradoRepository } from '../../olimpiada/repository/etapaAreaGrado.repository';

describe('PreguntaService', () => {
  let service: PreguntaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreguntaService,
        PreguntaRepository,
        EtapaAreaGradoRepository,
      ],
    }).compile();

    service = module.get<PreguntaService>(PreguntaService);
  });

  it('deberia estar definido', () => {
    expect(service).toBeDefined();
  });
});
