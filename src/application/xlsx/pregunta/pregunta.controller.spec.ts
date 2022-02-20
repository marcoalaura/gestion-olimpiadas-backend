import { Test, TestingModule } from '@nestjs/testing';
import { PreguntaController } from './pregunta.controller';
import { PreguntaService } from './pregunta.service';
import { AUTHZ_ENFORCER } from 'nest-authz';

describe('PreguntaController', () => {
  let controller: PreguntaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreguntaController],
      providers: [
        {
          provide: PreguntaService,
          useValue: {},
        },
        {
          provide: AUTHZ_ENFORCER,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PreguntaController>(PreguntaController);
  });

  it('deberia estar definido', () => {
    expect(controller).toBeDefined();
  });
});
