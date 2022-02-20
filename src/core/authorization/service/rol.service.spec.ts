import { Test, TestingModule } from '@nestjs/testing';
import { RolService } from './rol.service';
import { RolRepository } from '../repository/rol.repository';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';

const resRolesList = {
  id: '1e9215f2-47cd-45e4-a593-4289413503e0',
  rol: 'ADMINISTRADOR',
};

describe('RolService', () => {
  let service: RolService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolService,
        {
          provide: RolRepository,
          useValue: {
            listar: jest.fn(() => [resRolesList]),
          },
        },
      ],
    }).compile();

    service = module.get<RolService>(RolService);
  });

  it('[listar] Deberia obtener la lista de roles', async () => {
    const paginacion = new PaginacionQueryDto();
    const usuarios = await service.listar(paginacion);

    expect(usuarios).toBeDefined();
    expect(usuarios).toBeInstanceOf(Array);
  });
});
