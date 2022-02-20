import { Test, TestingModule } from '@nestjs/testing';
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';
import { ParametroDto } from './dto/parametro.dto';
import { ParametroRepository } from './parametro.repository';
import { ParametroService } from './parametro.service';

const resParametro = {
  id: '1e9215f2-47cd-45e4-a593-4289413503e0',
  codigo: 'COD-1',
  nombre: 'CODIGO 1',
  grupo: 'COD',
};

describe('ParametroService', () => {
  let service: ParametroService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParametroService,
        {
          provide: ParametroRepository,
          useValue: {
            listar: jest.fn(() => [[resParametro], 1]),
            listarPorGrupo: jest.fn(() => [resParametro]),
            crear: jest.fn(() => resParametro),
          },
        },
      ],
    }).compile();

    service = module.get<ParametroService>(ParametroService);
  });

  it('[listar] Deberia obtener la lista de parametros', async () => {
    const paginacion = new PaginacionQueryDto();
    const parametros = await service.listar(paginacion);
    expect(parametros).toHaveProperty('filas');
    expect(parametros).toHaveProperty('total');
    expect(parametros.filas).toBeInstanceOf(Array);
    expect(parametros.total).toBeDefined();
  });

  it('[listarPorGrupo] Deberia obtener la lista de parametros por grupo', async () => {
    const grupo = 'TD';
    const parametros = await service.listarPorGrupo(grupo);
    expect(parametros).toBeInstanceOf(Array);
  });

  it('[crear] Deberia crear un nuevo parametro', async () => {
    const parametro = new ParametroDto();
    parametro.codigo = resParametro.codigo;
    parametro.nombre = resParametro.nombre;
    parametro.grupo = resParametro.grupo;
    parametro.descripcion = 'descripcion';

    const result = await service.crear(parametro);
    expect(result).toBeDefined();
    expect(result.codigo).toEqual(parametro.codigo);
  });
});
