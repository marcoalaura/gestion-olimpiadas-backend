import { Test, TestingModule } from '@nestjs/testing';
import { tiposAreasGeograficas, tiposEtapa } from '../../../common/constants';
import { MedalleroPosicion } from '../entity/MedalleroPosicion.entity';
import { MedalleroPosicionRural } from '../entity/MedalleroPosicionRural.entity';
import { DepartamentoRepository } from '../repository/departamento.repository';
import { EtapaRepository } from '../repository/etapa.repository';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { InscripcionRepository } from '../repository/inscripcion.repository';
import { ObtencionMedalleroRepository } from '../repository/obtencionMedallero.repository';
import { MedalleroPosicionRepository } from '../repository/medalleroPosicion.repository';
import { MedalleroPosicionRuralRepository } from '../repository/medalleroPosicionRural.repository';
import { ResultadosRepository } from '../repository/resultados.repository';
import { ObtencionMedalleroService } from './obtencion-medallero.service';
import { EtapaService } from './etapa.service';
import { OlimpiadaRepository } from '../olimpiada.repository';
import { Connection } from 'typeorm';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { PreconditionFailedException } from '@nestjs/common';
import { Etapa } from '../entity/Etapa.entity';
import { Olimpiada } from '../entity/Olimpiada.entity';

const etaAreaGrado = {
  puntajeMinimoMedallero: 51,
};
const etapa: Etapa = {
  id: '541654-5454-54545',
  tipo: tiposEtapa.NACIONAL,
  nombre: 'dos',
  jerarquia: 2,
  comiteDesempate: true,
  fechaInicio: null,
  fechaFin: null,
  fechaActualizacion: null,
  fechaCreacion: null,
  fechaFinImpugnacion: null,
  fechaInicioImpugnacion: null,
  estado: 'true',
  estadoSorteoPreguntas: 'false',
  estadoSorteoPreguntasRezagados: 'false',
  etapaAreaGrados: [],
  olimpiada: new Olimpiada(),
  usuarioEtapa: [],
  usuarioCreacion: '324324',
  usuarioActualizacion: 'asdfasf',
  estadoPosicionamiento: null,
  idOlimpiada: '465465-4651-456',
};

const usuarioAuditoria = 'd5de12df-3cc3-5a58-a742-be24030482d8';

describe('ObtencionMedalleroService', () => {
  let service: ObtencionMedalleroService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObtencionMedalleroService,
        {
          provide: ObtencionMedalleroRepository,
          useValue: {
            findDatosPosicion: jest.fn().mockImplementation(() => null),
            findOne: jest
              .fn()
              .mockImplementation(() => (etapa.estadoPosicionamiento = null)),
          },
        },
        {
          provide: EtapaRepository,
          useValue: {
            findOne: jest.fn().mockImplementation(() => null),
          },
        },
        DepartamentoRepository,
        {
          provide: MedalleroPosicionRepository,
          useValue: {
            listaPorEtapaAreaGrado: jest.fn().mockImplementation(() => []),
            find: jest.fn().mockImplementation(() => []),
          },
        },
        MedalleroPosicionRuralRepository,
        InscripcionRepository,
        {
          provide: EtapaAreaGradoRepository,
          useValue: {
            findOne: jest.fn(() => etaAreaGrado),
          },
        },
        EtapaService,
        OlimpiadaRepository,
        {
          provide: Connection,
          useValue: {
            name: jest.fn().mockImplementation(() => null),
          },
        },
        ResultadosRepository,
        {
          provide: ResultadosRepository,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ObtencionMedalleroService>(ObtencionMedalleroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('[obtencionMedallero] Deberia devolver error no existe la etapa', async () => {
    const id = '88bdc57a-4ba2-41c4-98b0-23d719c5c999';
    try {
      await service.obtencionMedallero(id, usuarioAuditoria);
    } catch (err) {
      expect(err).toBeInstanceOf(PreconditionFailedException);
      expect(err.message).toBe(`Etapa con id ${id} no encontrado`);
    }
  });

  it('[listarByAreaGrado] Deberia devolver mensaje de medallero registrado', async () => {
    const opciones = {
      id: '66b7d7aa-ea70-49c7-8263-906a07668fc1',
      idDepartamento: '0',
      idDistrito: '0',
      areas: [],
      gradoEscolaridad: [],
    };
    const result = await service.listarByAreaGrado(opciones, usuarioAuditoria);
    expect(result).toBeDefined();
    expect(result.mensaje).toBe('Medallero registrado');
  });

  it('[registrarMedallero] Deberia estar definido', async () => {
    const lista = [
      {
        id_etapa_area_grado: '6b7d7aa-ea70-49c7-8263-906a07668fc1',
      },
    ];
    const result = await service.registrarMedallero(lista, usuarioAuditoria);
    expect(result).toBeDefined();
  });

  it('[buscarRural] Deberia devolver existe rural false y i = 1', async () => {
    let medalleroPosicionRural: MedalleroPosicionRural;
    const result = service.buscarRural([], medalleroPosicionRural, 0);
    expect(result).toBeDefined();
    expect(result.existeRural).toBe(false);
    expect(result.i).toBe(1);
  });

  it('[buscarRural] Deberia devolver existe rural true y i = 2', async () => {
    const lista = [
      {
        area_geografica: tiposAreasGeograficas.URBANO,
        puntaje: 80,
      },
      {
        area_geografica: tiposAreasGeograficas.RURAL,
        puntaje: 80,
      },
    ];
    const medala: MedalleroPosicionRural = {
      id: '6b7d7aa-ea70-49c7-8263-906a07668fc1',
      idEtapaAreaGrado: 'asdfasdf-asfd-asasdf-asdfasdf',
      notaMinima: 51,
      orden: 1,
      posicionMaxima: 1,
      posicionMinima: 1,
      estado: 'ACTIVO',
      fechaCreacion: null,
      usuarioCreacion: null,
      fechaActualizacion: null,
      etapaAreaGrado: null,
      usuarioActualizacion: null,
    };
    const result = service.buscarRural(lista, medala, 0);
    expect(result).toBeDefined();
    expect(result.existeRural).toBe(true);
    expect(result.i).toBe(2);
  });

  it('[buscarRural] Deberia devolver existe rural false y i = 2', async () => {
    const lista = [
      {
        area_geografica: tiposAreasGeograficas.URBANO,
        puntaje: 80,
      },
      {
        area_geografica: tiposAreasGeograficas.RURAL,
        puntaje: 50,
      },
    ];
    const medalla: MedalleroPosicionRural = {
      id: '6b7d7aa-ea70-49c7-8263-906a07668fc1',
      idEtapaAreaGrado: '2344-234324-324234-234234-324324',
      notaMinima: 51,
      orden: 1,
      posicionMaxima: 1,
      posicionMinima: 1,
      estado: 'ACTIVO',
      fechaCreacion: null,
      usuarioCreacion: null,
      fechaActualizacion: null,
      etapaAreaGrado: null,
      usuarioActualizacion: null,
    };
    const result = service.buscarRural(lista, medalla, 0);
    expect(result).toBeDefined();
    expect(result.existeRural).toBe(false);
    expect(result.i).toBe(2);
  });

  it('[siCumpleNotaMinima] Deberia devolver id inscripción 4324234-234234', async () => {
    const result = await service.siCumpleNotaMinima(
      '34353-35235-325235',
      51,
      '4324234-234234',
    );
    expect(result).toBeDefined();
    expect(result).toBe('4324234-234234');
  });

  it('[siCumpleNotaMinima] Deberia devolver id inscripción 0', async () => {
    const result = await service.siCumpleNotaMinima(
      '34353-35235-325235',
      50,
      '4324234-234234',
    );
    expect(result).toBeDefined();
    expect(result).toBe('0');
  });

  it('[inscripcionMedallero] Deberia devolver undefined', async () => {
    let posicion: MedalleroPosicion;
    const result = await service.inscripcionMedallero(
      '0',
      posicion,
      usuarioAuditoria,
    );
    expect(result).toBeUndefined();
  });

  it('[listarMedallerosGenerados] Deberia devolver total -1', async () => {
    let paginacionQueryDto: PaginacionQueryDto;
    const nivel = { idEtapa: '54564-45615-456451' };
    const result = await service.listarMedallerosGenerados(
      paginacionQueryDto,
      nivel,
    );
    expect(result).toBeDefined();
    expect(result.total).toBe(-1);
  });

  it('[listarMedallero] Deberia devolver []', async () => {
    const result = await service.listarMedallero('54564-45615-456451');
    expect(result).toBeDefined();
    expect(result).toStrictEqual([]);
  });

  it('[findDatosPosicion] Deberia devolver null', async () => {
    const result = await service.findDatosPosicion('54564-45615-456451');
    expect(result).toBeDefined();
    expect(result).toBe(null);
  });

  it('[buscarEmpatesEnMedallero] Deberia devolver [ { puntaje: 80 }, { puntaje: 60 } ]', async () => {
    const lista = [
      { seleccion: 0, ee_puntaje: 80 },
      { seleccion: 0, ee_puntaje: 80 },
      { seleccion: 0, ee_puntaje: 60 },
      { seleccion: 0, ee_puntaje: 80 },
      { seleccion: 0, ee_puntaje: 59 },
      { seleccion: 1, ee_puntaje: 70 },
      { seleccion: 1, ee_puntaje: 70 },
      { seleccion: 0, ee_puntaje: 60 },
    ];
    const result = await service.buscarEmpatesEnMedallero(lista);
    expect(result).toBeDefined();
    expect(result).toStrictEqual([{ puntaje: 80 }, { puntaje: 60 }]);
  });

  it('[medalleroComiteDepartamental] Deberia devolver No existen registros necesarios para modificar el medallero por el COMMITE DEPARTAMENTAL', async () => {
    try {
      await service.medalleroComiteDepartamental(usuarioAuditoria, []);
    } catch (err) {
      expect(err).toBeInstanceOf(PreconditionFailedException);
      expect(err.message).toBe(
        `No existen registros necesarios para modificar el medallero por el COMMITE DEPARTAMENTAL`,
      );
    }
  });
  it('[validarObtencionMedallero] No se puede realizar el cambio de estado a la Etapa, no se generó los medalleros', async () => {
    try {
      await service.validarObtencionMedallero('345345-345345-34534534-345345');
    } catch (err) {
      expect(err).toBeInstanceOf(PreconditionFailedException);
      expect(err.message).toBe(
        `No se puede realizar el cambio de estado a la Etapa, no se generó los medalleros`,
      );
    }
  });

  it('[revisarDatosMedallero] Deberia devolver Etapa no encontrado', async () => {
    try {
      let etapa: Etapa;
      service.revisarDatosMedallero(etapa);
    } catch (err) {
      expect(err).toBeInstanceOf(PreconditionFailedException);
      expect(err.message).toBe(`Etapa no encontrado`);
    }
  });

  it('[revisarDatosMedallero] Deberia devolver Debe existir el Departamento y el Distrito ya que la etapa es DISTRITAL', async () => {
    try {
      const etap = etapa;
      etap.tipo = tiposEtapa.DISTRITAL;
      service.revisarDatosMedallero(etap);
    } catch (err) {
      expect(err).toBeInstanceOf(PreconditionFailedException);
      expect(err.message).toBe(
        `Debe existir el Departamento y el Distrito ya que la etapa es DISTRITAL`,
      );
    }
  });

  it('[revisarDatosMedallero] Deberia devolver Debe existir el Departamento ya que la etapa es DEPARTAMENTAL', async () => {
    try {
      const etap = etapa;
      etap.tipo = tiposEtapa.DEPARTAMENTAL;
      service.revisarDatosMedallero(etap);
    } catch (err) {
      expect(err).toBeInstanceOf(PreconditionFailedException);
      expect(err.message).toBe(
        `Debe existir el Departamento ya que la etapa es DEPARTAMENTAL`,
      );
    }
  });

  it('[revisarDatosMedallero] Deberia devolver No debe existir el Distrito ya que la etapa es DEPARTAMENTAL', async () => {
    try {
      const etap = etapa;
      etap.tipo = tiposEtapa.DEPARTAMENTAL;
      service.revisarDatosMedallero(etap, '32423-32423', '234-23423');
    } catch (err) {
      expect(err).toBeInstanceOf(PreconditionFailedException);
      expect(err.message).toBe(
        `No debe existir el Distrito ya que la etapa es DEPARTAMENTAL`,
      );
    }
  });

  it('[revisarDatosMedallero] Deberia devolver No debe existir el Distrito ya que la etapa es NACIONAL', async () => {
    try {
      const etap = etapa;
      etap.tipo = tiposEtapa.NACIONAL;
      service.revisarDatosMedallero(etap, '32423-32423', '234-23423');
    } catch (err) {
      expect(err).toBeInstanceOf(PreconditionFailedException);
      expect(err.message).toBe(
        `No debe existir el Distrito ya que la etapa es NACIONAL`,
      );
    }
  });

  it('[revisarDatosMedallero] Deberia devolver No debe existir el Departamento ya que la etapa es NACIONAL', async () => {
    try {
      const etap = etapa;
      etap.tipo = tiposEtapa.NACIONAL;
      service.revisarDatosMedallero(etap, '32423-32423');
    } catch (err) {
      expect(err).toBeInstanceOf(PreconditionFailedException);
      expect(err.message).toBe(
        `No debe existir el Departamento ya que la etapa es NACIONAL`,
      );
    }
  });
});
