import { Test, TestingModule } from '@nestjs/testing';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { MedalleroPosicionRepository } from '../repository/medalleroPosicion.repository';
import { MedalleroPosicionRuralRepository } from '../repository/medalleroPosicionRural.repository';
import { MedalleroService } from './medallero.service';

const resMedalleroPosicionService = {
  id: 'd394f1b6-81e1-40b6-be26-f0b7508b91ec',
  ordenGalardon: 1,
  denominativo: 'PRIMERO',
  estado: 'ACTIVO',
  etapaAreaGrado: {
    id: '793e2227-770d-5692-8852-d9efdcc6a4d7',
    nroPosicionesTotal: 3,
  },
};

const resMedalleroPosicionRuralService = {
  id: 'd394f1b6-81e1-40b6-be26-f0b7508b91ec',
  orden: 1,
  posicionMaxima: 1,
  posicionMinima: 1,
  notaMinima: 51,
  estado: 'ACTIVO',
  etapaAreaGrado: {
    id: '793e2227-770d-5692-8852-d9efdcc6a4d7',
    nroPosicionesTotal: 3,
  },
};

const idEtapaAreaGrado = '793e2227-770d-5692-8852-d9efdcc6a4d7';

describe('MedalleroService', () => {
  let service: MedalleroService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedalleroService,
        {
          provide: MedalleroPosicionRepository,
          useValue: {
            listarPorEtapaAreaGrado: jest.fn(() => [
              [resMedalleroPosicionService],
              1,
            ]),
          },
        },
        {
          provide: MedalleroPosicionRuralRepository,
          useValue: {
            listarPorEtapaAreaGrado: jest.fn(() => [
              [resMedalleroPosicionRuralService],
              1,
            ]),
          },
        },
      ],
    }).compile();

    service = module.get<MedalleroService>(MedalleroService);
  });

  it('[listar] Deberia obtener la lista de medallero-posición', async () => {
    const paginacion = new PaginacionQueryDto();
    const result = await service.listarPosicion(idEtapaAreaGrado, paginacion);
    expect(result).toHaveProperty('filas');
    expect(result).toHaveProperty('total');
    expect(result.filas).toBeInstanceOf(Array);
    expect(result.total).toBeDefined();
  });

  it('[listar] Deberia obtener la lista de medallero-posición-rural', async () => {
    const paginacion = new PaginacionQueryDto();
    const result = await service.listarPosicionRural(
      idEtapaAreaGrado,
      paginacion,
    );
    expect(result).toHaveProperty('filas');
    expect(result).toHaveProperty('total');
    expect(result.filas).toBeInstanceOf(Array);
    expect(result.total).toBeDefined();
  });
});
