import { CanActivate } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard';
import { EstudianteController } from './estudiante.controller';
import { EstudianteService } from './estudiante.service';

describe('EstudianteController', () => {
  let controller: EstudianteController;

  beforeEach(async () => {
    const mock_ForceFailGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstudianteController],
      providers: [
        {
          provide: EstudianteService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(CasbinGuard)
      .useValue(mock_ForceFailGuard)
      .compile();

    controller = module.get<EstudianteController>(EstudianteController);
  });

  it('deberia estar definido', () => {
    expect(controller).toBeDefined();
  });
});
