import { Test, TestingModule } from '@nestjs/testing';
import { TextService } from '../../../common/lib/text.service';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { AreaDto } from '../dto/area.dto';
import { AreaRepository } from '../repository/area.repository';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { AreaService } from './area.service';
import { plainToClass } from 'class-transformer';
import { FileService } from '../../../../libs/file/src';
import { LoggerModule, PinoLogger } from 'nestjs-pino';

const resArea = {
  id: 'c542010a-7814-4293-b08f-6be128be3a65',
  nombre: 'Matemáticas',
};

describe('AreaService', () => {
  let service: AreaService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      providers: [
        AreaService,
        {
          provide: AreaRepository,
          useValue: {
            listar: jest.fn(() => [[resArea], 1]),
            buscarPorId: jest.fn(() => resArea),
            contarPorNombre: jest.fn(() => 0),
            crearActualizar: jest.fn(() => resArea),
            actualizarEstado: jest.fn(() => resArea),
            eliminar: jest.fn(() => resArea),
            listarBandeja: jest.fn(() => [[resArea], 1]),
          },
        },
        {
          provide: EtapaAreaGradoRepository,
          useValue: {
            contarPorIdArea: jest.fn(() => 0),
          },
        },
        FileService,
        PinoLogger,
      ],
    }).compile();

    service = module.get<AreaService>(AreaService);
  });

  it('[listar] Deberia obtener la lista de areas', async () => {
    const paginacion = new PaginacionQueryDto();
    const result = await service.listar(paginacion);
    expect(result).toHaveProperty('filas');
    expect(result).toHaveProperty('total');
    expect(result.filas).toBeInstanceOf(Array);
    expect(result.total).toBeDefined();
  });

  it('[buscarPorId] Deberia obtener una área', async () => {
    const id = TextService.generateUuid();
    const result = await service.buscarPorId(id);
    expect(result).toBeDefined();
    expect(result.nombre).toEqual(resArea.nombre);
  });

  it('[crear] Deberia crear una nueva area', async () => {
    const datosArea = {
      nombre: 'Física',
    };

    const areaDto = plainToClass(AreaDto, datosArea);
    const usuarioAuditoria = TextService.generateUuid();

    const result = await service.crear(areaDto, usuarioAuditoria);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });

  it('[actualizar] Deberia actualizar una area', async () => {
    const id = TextService.generateUuid();
    const datosArea = {
      nombre: 'Matemáticas',
    };

    const areaDto = plainToClass(AreaDto, datosArea);
    const usuarioAuditoria = TextService.generateUuid();

    const result = await service.actualizar(id, areaDto, usuarioAuditoria);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });

  it('[inactivar] Deberia inactivar una area', async () => {
    const id = TextService.generateUuid();
    const usuarioAuditoria = TextService.generateUuid();

    const result = await service.inactivar(id, usuarioAuditoria);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });

  it('[eliminar] Deberia eliminar una area', async () => {
    const id = TextService.generateUuid();
    const result = await service.eliminar(id);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });
});
