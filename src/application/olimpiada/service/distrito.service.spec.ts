import { Test, TestingModule } from '@nestjs/testing';
import { TextService } from '../../../common/lib/text.service';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { DistritoDto } from '../dto/distrito.dto';
import { DistritoRepository } from '../repository/distrito.repository';
import { DepartamentoRepository } from '../repository/departamento.repository';
import { DistritoService } from './distrito.service';
import { plainToClass } from 'class-transformer';
import { UnidadEducativaRepository } from '../repository/unidadEducativa.repository';

const resDistrito = {
  id: '2310b8e7-aab4-4320-a3f9-4361dc95750a',
  nombre: 'Max Paredes',
  codigo: 5010,
  departamento: {
    id: '018bd25f-e215-4ef7-ab11-7c0ae97c58ab',
    nombre: 'La Paz',
  },
};

const resDepartamento = {
  id: '018bd25f-e215-4ef7-ab11-7c0ae97c58ab',
  nombre: 'La Paz',
};

describe('DistritoService', () => {
  let service: DistritoService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DistritoService,
        {
          provide: DistritoRepository,
          useValue: {
            listar: jest.fn(() => [[resDistrito], 1]),
            buscarPorId: jest.fn(() => resDistrito),
            contarPorCodigo: jest.fn(() => 0),
            crearActualizar: jest.fn(() => resDistrito),
            actualizarEstado: jest.fn(() => resDistrito),
            eliminar: jest.fn(() => resDistrito),
          },
        },
        {
          provide: DepartamentoRepository,
          useValue: {
            buscarPorId: jest.fn(() => resDepartamento),
          },
        },
        {
          provide: UnidadEducativaRepository,
          useValue: {
            contarPorIdDistrito: jest.fn(() => 0),
          },
        },
      ],
    }).compile();

    service = module.get<DistritoService>(DistritoService);
  });

  it('[listar] Deberia obtener la lista de distritos', async () => {
    const paginacion = new PaginacionQueryDto();
    const result = await service.listar(paginacion);
    expect(result).toHaveProperty('filas');
    expect(result).toHaveProperty('total');
    expect(result.filas).toBeInstanceOf(Array);
    expect(result.total).toBeDefined();
  });

  it('[buscarPorId] Deberia obtener una distrito', async () => {
    const id = TextService.generateUuid();
    const result = await service.buscarPorId(id);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
    expect(result.nombre).toEqual(resDistrito.nombre);
    expect(result).toHaveProperty('departamento');
    expect(result.departamento).toHaveProperty('id');
  });

  it('[crear] Deberia crear una nueva distrito', async () => {
    const datosDistrito = {
      nombre: 'Max Paredes',
      codigo: 'D0010',
      idDepartamento: '018bd25f-e215-4ef7-ab11-7c0ae97c58ab',
    };

    const distritoDto = plainToClass(DistritoDto, datosDistrito);
    const usuarioAuditoria = TextService.generateUuid();

    const result = await service.crear(distritoDto, usuarioAuditoria);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });

  it('[actualizar] Deberia actualizar una distrito', async () => {
    const id = TextService.generateUuid();
    const datosDistrito = {
      nombre: 'Max Paredes Nuevo',
      codigo: 'D00101',
      idDepartamento: '018bd25f-e215-4ef7-ab11-7c0ae97c58ab',
    };

    const distritoDto = plainToClass(DistritoDto, datosDistrito);
    const usuarioAuditoria = TextService.generateUuid();

    const result = await service.actualizar(id, distritoDto, usuarioAuditoria);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });

  it('[inactivar] Deberia inactivar una distrito', async () => {
    const id = TextService.generateUuid();
    const usuarioAuditoria = TextService.generateUuid();

    const result = await service.inactivar(id, usuarioAuditoria);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });

  it('[eliminar] Deberia eliminar una distrito', async () => {
    const id = TextService.generateUuid();
    const result = await service.eliminar(id);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });
});
