import { Test, TestingModule } from '@nestjs/testing';
import { ReporteController } from './reporte.controller';
import { ReporteService } from './reporte.service';
import { PinoLogger } from 'nestjs-pino';
import { AUTHZ_ENFORCER } from 'nest-authz';

describe('ReporteController', () => {
  let controller: ReporteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReporteController],
      providers: [
        {
          provide: ReporteService,
          useValue: {},
        },
        {
          provide: PinoLogger,
          useValue: {},
        },
        {
          provide: AUTHZ_ENFORCER,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ReporteController>(ReporteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
