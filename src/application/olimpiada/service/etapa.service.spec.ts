import { Test, TestingModule } from '@nestjs/testing';
import { TextService } from '../../../common/lib/text.service';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { EtapaDto } from '../dto/etapa.dto';
import { EtapaRepository } from '../repository/etapa.repository';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { MedalleroPosicionRepository } from '../repository/medalleroPosicion.repository';
import { InscripcionRepository } from '../repository/inscripcion.repository';
import { EtapaService } from './etapa.service';
import { plainToClass } from 'class-transformer';
import { OlimpiadaRepository } from '../olimpiada.repository';
import { Status } from '../../../common/constants';

const resEtapa = {
  id: '38c82d7e-325e-4e8e-b5d4-94b0084077e7',
  nombre: 'Final',
  tipo: 'NACIONAL',
  fechaInicio: new Date(),
  fechaFin: new Date(),
  fechaInicioImpugnacion: new Date(),
  fechaFinImpugnacion: new Date(),
  estado: 'ACTIVO',
};
resEtapa.fechaInicio.setDate(resEtapa.fechaInicio.getDate() + 10);
resEtapa.fechaFin.setDate(resEtapa.fechaFin.getDate() + 20);
resEtapa.fechaInicioImpugnacion.setDate(
  resEtapa.fechaInicioImpugnacion.getDate() + 21,
);
resEtapa.fechaFinImpugnacion.setDate(
  resEtapa.fechaFinImpugnacion.getDate() + 24,
);

const resOlimpiada = {
  id: '38c82d7e-325e-4e8e-b5d4-94b0084077e7',
  nombre: 'Principal',
  estado: Status.ACTIVE,
  fechaInicio: new Date(),
  fechaFin: new Date(),
};
resOlimpiada.fechaFin.setDate(resOlimpiada.fechaFin.getDate() + 30);

describe('EtapaService', () => {
  let service: EtapaService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EtapaService,
        {
          provide: EtapaRepository,
          useValue: {
            listar: jest.fn(() => [[resEtapa], 1]),
            crearActualizar: jest.fn(() => resEtapa),
            buscarPorId: jest.fn(() => resEtapa),
            contarPorTipo: jest.fn(() => 0),
            contarEtapasCruzadas: jest.fn(() => 0),
            contarEtapasAnteriores: jest.fn(() => 0),
            contarEtapasPosteriores: jest.fn(() => 0),
            contarEtapasRompenOrden: jest.fn(() => 0),
            actualizarEstado: jest.fn(() => resEtapa),
            eliminar: jest.fn(() => resEtapa),
          },
        },
        {
          provide: EtapaAreaGradoRepository,
          useValue: {
            contarPorIdEtapa: jest.fn(() => 0),
          },
        },
        {
          provide: OlimpiadaRepository,
          useValue: {
            buscarPorId: jest.fn(() => resOlimpiada),
          },
        },
        {
          provide: MedalleroPosicionRepository,
          useValue: {
            contarConfiguracionPorEtapa: jest.fn(() => 0),
          },
        },
        {
          provide: InscripcionRepository,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<EtapaService>(EtapaService);
  });

  it('[listar] Deberia obtener la lista de etapas', async () => {
    const paginacion = new PaginacionQueryDto();
    const etapas = await service.listar(paginacion);
    expect(etapas).toHaveProperty('filas');
    expect(etapas).toHaveProperty('total');
    expect(etapas.filas).toBeInstanceOf(Array);
    expect(etapas.total).toBeDefined();
  });

  it('[listarPorGrupo] Deberia obtener etapa por ID', async () => {
    const idEtapa = 'NN';
    const etapa = await service.buscarPorId(idEtapa);
    expect(etapa).toHaveProperty('nombre');
    expect(etapa).toHaveProperty('tipo');
    expect(etapa).toHaveProperty('fechaInicio');
    expect(etapa).toHaveProperty('fechaFin');
    expect(etapa).toHaveProperty('fechaInicioImpugnacion');
    expect(etapa).toHaveProperty('fechaFinImpugnacion');
    expect(etapa).toHaveProperty('estado');
  });

  it('[crear] Deberia crear un nueva etapa', async () => {
    const etapa = new EtapaDto();
    etapa.nombre = resEtapa.nombre;
    etapa.tipo = resEtapa.tipo;
    etapa.fechaInicio = resEtapa.fechaInicio;
    etapa.fechaFin = resEtapa.fechaFin;
    etapa.fechaInicioImpugnacion = resEtapa.fechaInicioImpugnacion;
    etapa.fechaFinImpugnacion = resEtapa.fechaFinImpugnacion;

    const result = await service.crear(etapa, '1');
    expect(result).toBeDefined();
  });

  it('[actualizar] Deberia actualizar una etapa', async () => {
    const id = TextService.generateUuid();
    const datosEtapa = {
      nombre: 'Semifinal',
      tipo: 'NACIONAL',
      fechaInicio: new Date(),
      fechaFin: new Date(),
      fechaInicioImpugnacion: new Date(),
      fechaFinImpugnacion: new Date(),
    };
    datosEtapa.fechaInicio.setDate(datosEtapa.fechaInicio.getDate() + 5);
    datosEtapa.fechaFin.setDate(datosEtapa.fechaFin.getDate() + 15);
    datosEtapa.fechaInicioImpugnacion.setDate(
      datosEtapa.fechaInicioImpugnacion.getDate() + 16,
    );
    datosEtapa.fechaFinImpugnacion.setDate(
      datosEtapa.fechaFinImpugnacion.getDate() + 18,
    );

    const etapaDto = plainToClass(EtapaDto, datosEtapa);
    const usuarioAuditoria = TextService.generateUuid();

    const result = await service.actualizar(id, etapaDto, usuarioAuditoria);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });

  it('[eliminar] Deberia eliminar una etapa', async () => {
    const id = TextService.generateUuid();
    const result = await service.eliminar(id);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });
});
