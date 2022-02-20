import { Test, TestingModule } from '@nestjs/testing';
import { TextService } from '../../../common/lib/text.service';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { UnidadEducativaDto } from '../dto/unidadEducativa.dto';
import { UnidadEducativaRepository } from '../repository/unidadEducativa.repository';
import { DistritoRepository } from '../repository/distrito.repository';
import { UnidadEducativaService } from './unidadEducativa.service';
import { plainToClass } from 'class-transformer';

const resUnidadEducativa = {
  id: 'c9930379-5dc1-556f-847c-802dd9d1d9b6',
  codigoSie: 80730608,
  nombre: 'COLORADOS DE BOLIVIA ',
  tipoUnidadEducativa: 'FISCAL',
  areaGeografica: 'URBANO',
  seccion: 'TERCERA SECCIÓN',
  localidad: 'SAN IGNACIO',
  distrito: {
    id: '2310b8e7-aab4-4320-a3f9-4361dc95750a',
    nombre: 'Max Paredes',
    departamento: {
      id: '7a69567c-8d6a-4383-8930-628b83c8f214',
      nombre: 'La Paz',
    },
  },
};

const resDistrito = {
  id: '2310b8e7-aab4-4320-a3f9-4361dc95750a',
  nombre: 'Max Paredes',
  estado: 'ACTIVO',
  departamento: {
    id: '7a69567c-8d6a-4383-8930-628b83c8f214',
    nombre: 'La Paz',
  },
};

describe('UnidadEducativaService', () => {
  let service: UnidadEducativaService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnidadEducativaService,
        {
          provide: UnidadEducativaRepository,
          useValue: {
            listar: jest.fn(() => [[resUnidadEducativa], 1]),
            buscarPorId: jest.fn(() => resUnidadEducativa),
            contarPorCodigoSie: jest.fn(() => 0),
            contarPorIdUnidadEducativa: jest.fn(() => 0),
            crearActualizar: jest.fn(() => resUnidadEducativa),
            actualizarEstado: jest.fn(() => resUnidadEducativa),
            eliminar: jest.fn(() => resUnidadEducativa),
          },
        },
        {
          provide: DistritoRepository,
          useValue: {
            buscarPorId: jest.fn(() => resDistrito),
          },
        },
      ],
    }).compile();

    service = module.get<UnidadEducativaService>(UnidadEducativaService);
  });

  it('[listar] Deberia obtener la lista de unidadEducativas', async () => {
    const paginacion = new PaginacionQueryDto();
    const result = await service.listar(paginacion);
    expect(result).toHaveProperty('filas');
    expect(result).toHaveProperty('total');
    expect(result.filas).toBeInstanceOf(Array);
    expect(result.total).toBeDefined();
  });

  it('[buscarPorId] Deberia obtener una unidadEducativa', async () => {
    const id = TextService.generateUuid();
    const result = await service.buscarPorId(id);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
    expect(result.nombre).toEqual(resUnidadEducativa.nombre);
    expect(result).toHaveProperty('distrito');
    expect(result.distrito).toHaveProperty('id');
  });

  it('[crear] Deberia crear una nueva unidadEducativa', async () => {
    const datosUnidadEducativa = {
      codigoSie: '80730608',
      nombre: 'COLORADOS DE BOLIVIA ',
      tipoUnidadEducativa: 'FISCAL',
      areaGeografica: 'URBANO',
      idDistrito: '2310b8e7-aab4-4320-a3f9-4361dc95750a',
      idDepartamento: '7a69567c-8d6a-4383-8930-628b83c8f214',
    };

    const unidadEducativaDto = plainToClass(
      UnidadEducativaDto,
      datosUnidadEducativa,
    );
    const usuarioAuditoria = TextService.generateUuid();

    const result = await service.crear(unidadEducativaDto, usuarioAuditoria);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });

  it('[actualizar] Deberia actualizar una unidadEducativa', async () => {
    const id = TextService.generateUuid();
    const datosUnidadEducativa = {
      codigoSie: '80730608',
      nombre: 'COLORADOS DE BOLIVIA ',
      tipoUnidadEducativa: 'FISCAL',
      areaGeografica: 'URBANO',
      idDistrito: '2310b8e7-aab4-4320-a3f9-4361dc95750a',
      idDepartamento: '7a69567c-8d6a-4383-8930-628b83c8f214',
    };

    const unidadEducativaDto = plainToClass(
      UnidadEducativaDto,
      datosUnidadEducativa,
    );
    const usuarioAuditoria = TextService.generateUuid();

    const result = await service.actualizar(
      id,
      unidadEducativaDto,
      usuarioAuditoria,
    );
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });

  it('[inactivar] Deberia inactivar una unidadEducativa', async () => {
    const id = TextService.generateUuid();
    const usuarioAuditoria = TextService.generateUuid();

    const result = await service.inactivar(id, usuarioAuditoria);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });

  it('[eliminar] Deberia eliminar una unidadEducativa', async () => {
    const id = TextService.generateUuid();
    const result = await service.eliminar(id);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });
});
