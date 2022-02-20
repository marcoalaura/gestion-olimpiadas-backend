import { Test, TestingModule } from '@nestjs/testing';
import { TextService } from '../../../common/lib/text.service';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { GradoEscolaridadDto } from '../dto/gradoEscolaridad.dto';
import { GradoEscolaridadRepository } from '../repository/gradoEscolaridad.repository';
import { GradoEscolaridadService } from './gradoEscolaridad.service';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { plainToClass } from 'class-transformer';

const resGradoEscolaridad = {
  id: 'ec9a3995-4ce7-46b7-af8a-6bc579a52ad3',
  nombre: 'Nuevo grado escolar',
  orden: 11,
  estado: 'ACTIVO',
};

describe('GradoEscolaridadService', () => {
  let service: GradoEscolaridadService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GradoEscolaridadService,
        {
          provide: GradoEscolaridadRepository,
          useValue: {
            listar: jest.fn(() => [[resGradoEscolaridad], 1]),
            crearActualizar: jest.fn(() => resGradoEscolaridad),
            buscarPorId: jest.fn(() => resGradoEscolaridad),
            contarPorNombre: jest.fn(() => 0),
            contarPorOrden: jest.fn(() => 0),
            actualizarEstado: jest.fn(() => resGradoEscolaridad),
            eliminar: jest.fn(() => resGradoEscolaridad),
          },
        },
        {
          provide: EtapaAreaGradoRepository,
          useValue: {
            contarPorIdGrado: jest.fn(() => 0),
          },
        },
      ],
    }).compile();

    service = module.get<GradoEscolaridadService>(GradoEscolaridadService);
  });

  it('[listar] Deberia obtener la lista de grados escolares', async () => {
    const paginacion = new PaginacionQueryDto();
    const gradosEscolaridad = await service.listar(paginacion);
    expect(gradosEscolaridad).toHaveProperty('filas');
    expect(gradosEscolaridad).toHaveProperty('total');
    expect(gradosEscolaridad.filas).toBeInstanceOf(Array);
    expect(gradosEscolaridad.total).toBeDefined();
  });

  it('[listarPorGrupo] Deberia obtener grado escolar por ID', async () => {
    const idGradoEscolaridad = TextService.generateUuid();
    const gradoEscolaridad = await service.buscarPorId(idGradoEscolaridad);
    expect(gradoEscolaridad).toHaveProperty('nombre');
    expect(gradoEscolaridad).toHaveProperty('orden');
    expect(gradoEscolaridad).toHaveProperty('estado');
  });

  it('[crear] Deberia crear un nueva grado escolar', async () => {
    const datosGradoEscolaridad = {
      nombre: 'Prepromocion',
      orden: 14,
    };

    const gradoEscolaridadDto = plainToClass(
      GradoEscolaridadDto,
      datosGradoEscolaridad,
    );
    const usuarioAuditoria = TextService.generateUuid();

    const result = await service.crear(gradoEscolaridadDto, usuarioAuditoria);
    expect(result).toBeDefined();
  });

  it('[actualizar] Deberia actualizar una grado escolar', async () => {
    const id = TextService.generateUuid();
    const datosGradoEscolaridad = {
      nombre: 'Promocióm',
      orden: 15,
    };

    const gradoEscolaridadDto = plainToClass(
      GradoEscolaridadDto,
      datosGradoEscolaridad,
    );
    const usuarioAuditoria = TextService.generateUuid();

    const result = await service.actualizar(
      id,
      gradoEscolaridadDto,
      usuarioAuditoria,
    );
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });

  it('[inactivar] Deberia inactivar un grado escolar', async () => {
    const id = TextService.generateUuid();
    const usuarioAuditoria = TextService.generateUuid();

    const result = await service.inactivar(id, usuarioAuditoria);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });

  it('[eliminar] Deberia eliminar una grado escolar', async () => {
    const id = TextService.generateUuid();
    const result = await service.eliminar(id);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });
});
