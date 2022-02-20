import { Test, TestingModule } from '@nestjs/testing';
import { AuthZManagementService } from 'nest-authz';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { CanActivate } from '@nestjs/common';
import { CasbinGuard } from '../guards/casbin.guard';

const resPolitica = {
  sujeto: 'ADMINISTRADOR',
  objeto: '/usuarios',
  accion: 'GET',
  app: 'backend',
};

const resListar = {
  total: 1,
  filas: [resPolitica],
};

const resListarCasbin = ['ADMINISTRADOR', '/usuarios', 'GET', 'backend'];
describe('AuthorizationController', () => {
  let controller: AuthorizationController;
  beforeEach(async () => {
    const mock_ForceFailGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AuthorizationController],
      providers: [
        {
          provide: AuthorizationService,
          useValue: {
            listarPoliticas: jest.fn(() => resListar),
            obtenerRoles: jest.fn(() => [resListarCasbin]),
            crearPolitica: jest.fn(() => resPolitica),
            eliminarPolitica: jest.fn(() => resPolitica),
          },
        },
        {
          provide: AuthZManagementService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(CasbinGuard)
      .useValue(mock_ForceFailGuard)
      .compile();

    controller = module.get<AuthorizationController>(AuthorizationController);
  });

  it('[listar] Deberia listar politicas en formato filas y total', async () => {
    const paginacion = new PaginacionQueryDto();
    const result = await controller.listarPoliticas(paginacion);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('finalizado');
    expect(result).toHaveProperty('mensaje');
    expect(result).toHaveProperty('datos');
    expect(result.datos).toHaveProperty('total');
    expect(result.datos).toHaveProperty('filas');
  });
  it('[obtenerRoles] Deberia listar politicas en formato casbin', async () => {
    const result = await controller.obtenerRoles();
    expect(result).toBeDefined();
    expect(result).toHaveProperty('finalizado');
    expect(result).toHaveProperty('mensaje');
    expect(result).toHaveProperty('datos');
    expect(result.datos).toBeInstanceOf(Array);
  });

  it('[crearPolitica] Deberia crear una politica', async () => {
    const politica = { ...resPolitica };
    const result = await controller.crearPolitica(politica);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('finalizado');
    expect(result.finalizado).toEqual(true);
  });

  it('[eliminarPolitica] Deberia eliminar una politica', async () => {
    const politica = { ...resPolitica };
    const result = await controller.eliminarPolitica(politica);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('finalizado');
    expect(result.finalizado).toEqual(true);
  });
});
