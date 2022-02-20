import { Test, TestingModule } from '@nestjs/testing';
import { TextService } from '../../common/lib/text.service';
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';
import { OlimpiadaDto } from './dto/olimpiada.dto';
import { OlimpiadaRepository } from './olimpiada.repository';
import { OlimpiadaService } from './olimpiada.service';
import { FileService } from '../../../libs/file/src';
import { LoggerModule, PinoLogger } from 'nestjs-pino';

const resOlimpiada = {
  id: '41114285-ec98-4071-8e13-e4f13c1c7d67',
  nombre: 'Nueva olimpiada',
  gestion: 2021,
  fechaInicio: null,
  fechaFin: null,
  sigla: 'OECP2021',
};

describe('OlimpiadaService', () => {
  let service: OlimpiadaService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      providers: [
        OlimpiadaService,
        {
          provide: OlimpiadaRepository,
          useValue: {
            listar: jest.fn(() => [[resOlimpiada], 1]),
            crear: jest.fn(() => resOlimpiada),
            guardar: jest.fn(() => resOlimpiada),
            actualizar: jest.fn(() => resOlimpiada),
            buscarPorId: jest.fn(() => resOlimpiada),
            buscarPorNombre: jest.fn(() => null),
            buscarPorSigla: jest.fn(() => null),
          },
        },
        FileService,
        PinoLogger,
      ],
    }).compile();

    service = module.get<OlimpiadaService>(OlimpiadaService);
  });

  it('[listar] Deberia obtener la lista de olimpiadas', async () => {
    const paginacion = new PaginacionQueryDto();
    const id = TextService.generateUuid();
    const idRol = TextService.generateUuid();
    const olimpiadas = await service.recuperar(
      paginacion,
      id,
      idRol,
      'ADMINISTRADOR',
    );
    expect(olimpiadas).toHaveProperty('filas');
    expect(olimpiadas).toHaveProperty('total');
    expect(olimpiadas.filas).toBeInstanceOf(Array);
    expect(olimpiadas.total).toBeDefined();
  });

  it('[listarPorGrupo] Deberia obtener olimpiada por ID', async () => {
    const idOlimpiada = 'TD';
    const olimpiada = await service.buscarPorId(idOlimpiada);
    expect(olimpiada).toHaveProperty('nombre');
    expect(olimpiada).toHaveProperty('gestion');
  });

  it('[crear] Deberia crear un nueva olimpiada', async () => {
    const olimpiada = new OlimpiadaDto();
    olimpiada.nombre = resOlimpiada.nombre;
    olimpiada.gestion = resOlimpiada.gestion;
    olimpiada.sigla = resOlimpiada.sigla;

    const result = await service.crear(olimpiada, 'usuarioActualizacion');
    expect(result).toBeDefined();
  });
});
