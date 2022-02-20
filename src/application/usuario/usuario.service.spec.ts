/* eslint-disable max-lines-per-function */
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { TextService } from '../../common/lib/text.service';
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';
import { PersonaRepository } from '../persona/persona.repository';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { UsuarioRepository } from './usuario.repository';
import { UsuarioService } from './usuario.service';
import { MensajeriaService } from '../../core/external-services/mensajeria/mensajeria.service';
import { MensajeriaModule } from '../../core/external-services/mensajeria/mensajeria.module';
import { EntityNotFoundException } from '../../common/exceptions/entity-not-found.exception';
import { PreconditionFailedException } from '@nestjs/common';
import { AuthorizationService } from '../../core/authorization/controller/authorization.service';
import { Messages } from '../../common/constants/response-messages';
import { UsuarioRolRepository } from './usuario-rol.repository';
import { SegipService } from '../../core/external-services/iop/segip/segip.service';
import { ConfigService } from '@nestjs/config';
import { DepartamentoRepository } from '../olimpiada/repository/departamento.repository';
import { DistritoRepository } from '../olimpiada/repository/distrito.repository';
import { AreaRepository } from '../olimpiada/repository/area.repository';
import { UnidadEducativaRepository } from '../olimpiada/repository/unidadEducativa.repository';
import { EtapaRepository } from '../olimpiada/repository/etapa.repository';
import { OlimpiadaRepository } from '../olimpiada/olimpiada.repository';
import { RolRepository } from '../../core/authorization/repository/rol.repository';

const resUsuarioList = {
  id: '1e9215f2-47cd-45e4-a593-4289413503e0',
  usuario: 'USUARIO',
  estado: 'ACTIVO',
  persona: {
    nroDocumento: '123456',
    nombres: 'Juan',
    primerApellido: 'Perez',
    segundoApellido: 'Perez',
  },
  usuarioRol: [
    {
      estado: 'ACTIVO',
      id: '',
      rol: {
        rol: 'ADMINISTRADOR',
      },
      olimpiada: {
        id: '97303a51-8570-453f-9e67-1a06537c0744',
        nombre: 'Olimpiadas científicas',
      },
    },
  ],
};

const resUsuarioPerfil = {
  id: '1e9215f2-47cd-45e4-a593-4289413503e0',
  usuario: 'USUARIO',
  estado: 'ACTIVO',
  contrasena: '$2b$10$iz67dPnZkJDpaKarHtch6.2kaWyIaKeOf2bqtBuil6N//dBq6wJQS',
  usuarioRol: [
    {
      id: 'b320fe27-5644-5712-8423-198302b01e25',
      estado: 'ACTIVO',
      rol: {
        id: 'b320fe27-5644-5712-8423-198302b01e25',
        rol: 'ADMINISTRADOR',
        estado: 'ACTIVO',
        rolModulo: [
          {
            id: '03c1f916-7f3e-4b93-839b-1e9f7515a278',
            estado: 'ACTIVO',
            modulo: [
              {
                id: 'b320fe27-5644-5712-8423-198302b01e25',
                label: 'Usuarios',
                url: '/usuarios',
                icono: 'mdiAccountCog',
                nombre: 'usuarios',
                estado: 'ACTIVO',
              },
            ],
          },
        ],
      },
    },
  ],
  persona: {
    nroDocumento: '123456',
    nombres: 'Juan',
    primerApellido: 'Perez',
    segundoApellido: 'Perez',
    fechaNacimiento: '2002-02-09T00:00:00.000Z',
    tipoDocumento: 'CI',
  },
};

const resUsuarioCrear = {
  usuario: 'usuario122',
  contrasena: '123',
  persona: {
    nombres: 'juan',
    primerApellido: 'perez',
    segundoApellido: 'perez',
    nroDocumento: '123456122',
    fechaNacimiento: '1911-11-11',
    tipoDocumentoOtro: null,
    telefono: null,
    genero: null,
    observacion: null,
    id: '18002fe5-759c-4493-a025-8cd38b61ffff',
    tipoDocumento: 'CI',
    estado: 'ACTIVO',
  },
  usuarioCreacion: 'd5de12df-3cc3-5a58-a742-be24030482d8',
  fechaActualizacion: '2021-04-12T19:42:13.588Z',
  usuarioActualizacion: null,
  fechaCreacion: '2021-04-12T19:42:13.588Z',
  id: '416be245-aeaa-47c7-bfe0-477961b18eec',
  estado: 'CREADO',
};

const resUsuarioActivar = {
  id: TextService.generateUuid(),
  estado: 'CREADO',
};

const resUsuarioRestaurar = {
  id: TextService.generateUuid(),
  estado: 'ACTIVO',
};

const resModulo = {
  id: 'b320fe27-5644-5712-8423-198302b01e25',
  label: 'Usuarios',
  url: '/usuarios',
  icono: 'manage_accounts',
  nombre: 'usuarios',
  estado: 'ACTIVO',
};

const resOlimpiada = {
  id: '018bd25f-e215-4ef7-ab11-7c0ae97c58ab',
};
const resDepartamento = {
  id: '018bd25f-e215-4ef7-ab11-7c0ae97c58ab',
};
const resDistrito = {
  id: '018bd25f-e215-4ef7-ab11-7c0ae97c58ab',
};
const resArea = {
  id: '018bd25f-e215-4ef7-ab11-7c0ae97c58ab',
};
const resUnidadEducativa = {
  id: '018bd25f-e215-4ef7-ab11-7c0ae97c58ab',
};
const resEtapa = {
  id: '018bd25f-e215-4ef7-ab11-7c0ae97c58ab',
  nombre: 'La Paz',
  olimpiada: {
    id: '018bd25f-e215-4ef7-ab11-7c0ae97c58ab',
  },
};

describe('UsuarioService', () => {
  let service: UsuarioService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        UsuarioService,
        {
          provide: UsuarioRepository,
          useValue: {
            listar: jest.fn(() => [[resUsuarioList], 1]),
            buscarUsuarioRolPorId: jest.fn(() => resUsuarioPerfil),
            buscarUsuarioPorCI: jest
              .fn()
              .mockReturnValueOnce({ id: TextService.generateUuid() })
              .mockReturnValueOnce(undefined)
              .mockReturnValueOnce(undefined),
            buscarUsuarioPorNombre: jest
              .fn()
              .mockReturnValueOnce({ id: TextService.generateUuid() })
              .mockReturnValueOnce(undefined)
              .mockReturnValueOnce(undefined),
            buscarUsuarioPorCorreo: jest
              .fn()
              .mockReturnValueOnce({ id: TextService.generateUuid() })
              .mockReturnValueOnce(undefined),
            crear: jest.fn(() => resUsuarioCrear),
            // preload: jest.fn(() => resUsuarioActivar),
            findOne: jest
              .fn()
              .mockReturnValueOnce(resUsuarioActivar)
              .mockReturnValueOnce(undefined)
              .mockReturnValueOnce({ ...resUsuarioActivar, estado: 'ACTIVO' })
              .mockReturnValueOnce(resUsuarioActivar)
              .mockReturnValueOnce(undefined)
              .mockReturnValueOnce(resUsuarioRestaurar)
              .mockReturnValueOnce(undefined),
            update: jest.fn(() => ({})),
            runTransaction: jest.fn(),
          },
        },
        {
          provide: UsuarioRolRepository,
          useValue: {},
        },
        {
          provide: MensajeriaService,
          useValue: {
            sendEmail: jest.fn(() => ({ finalizado: true })),
          },
        },
        {
          provide: SegipService,
          useValue: {
            contrastar: jest.fn(() => ({ finalizado: true })),
          },
        },
        {
          provide: PersonaRepository,
          useValue: {},
        },
        {
          provide: AuthorizationService,
          useValue: {
            obtenerPermisosPorRol: jest.fn(() => [resModulo]),
          },
        },
        {
          provide: RolRepository,
          useValue: {
            listarRoles: jest.fn(() => []),
          },
        },
        {
          provide: OlimpiadaRepository,
          useValue: {
            buscarPorId: jest.fn(() => resOlimpiada),
          },
        },
        {
          provide: DepartamentoRepository,
          useValue: {
            buscarPorId: jest.fn(() => resDepartamento),
          },
        },
        {
          provide: DistritoRepository,
          useValue: {
            buscarPorId: jest.fn(() => resDistrito),
          },
        },
        {
          provide: AreaRepository,
          useValue: {
            buscarPorId: jest.fn(() => resArea),
          },
        },
        {
          provide: UnidadEducativaRepository,
          useValue: {
            buscarPorId: jest.fn(() => resUnidadEducativa),
          },
        },
        {
          provide: EtapaRepository,
          useValue: {
            buscarPorId: jest.fn(() => resEtapa),
          },
        },
      ],
      imports: [MensajeriaModule],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
  });

  it('[listar] Deberia obtener la lista de usuarios', async () => {
    const paginacion = new PaginacionQueryDto();
    const usuarios = await service.listar(paginacion);
    expect(usuarios).toHaveProperty('filas');
    expect(usuarios).toHaveProperty('total');
    expect(usuarios.filas).toBeInstanceOf(Array);
    expect(usuarios.total).toBeDefined();
  });

  it('[buscarUsuarioId] Deberia obtener la informacion relacionada al usuario', async () => {
    const { id } = resUsuarioPerfil;
    const usuarios = await service.buscarUsuarioId(id);

    expect(usuarios).toBeDefined();
    expect(usuarios).toHaveProperty('id');
    expect(usuarios).toHaveProperty('persona');
    expect(usuarios).toHaveProperty('roles');
  });

  it('[crear] Deberia lanzar una excepcion si ya existe un usuario con el mismo nro de documento', async () => {
    const datosUsuario = {
      usuario: 'usuario122',
      contrasena: '123',
      persona: {
        nombres: 'juan',
        primerApellido: 'perez',
        segundoApellido: 'perez',
        nroDocumento: '123456122',
        fechaNacimiento: '1911-11-11',
      },
    };
    const usuarioDto = plainToClass(CrearUsuarioDto, datosUsuario);
    const usuarioAuditoria = TextService.generateUuid();
    try {
      await service.crear(usuarioDto, usuarioAuditoria);
    } catch (error) {
      expect(error).toBeInstanceOf(PreconditionFailedException);
      expect(error.message).toEqual(Messages.EXISTING_USER);
    }
  });
  it('[crear] Deberia lanzar una excepcion si ya existe un usuario con el mismo nombre', async () => {
    const datosUsuario = {
      usuario: 'usuario122',
      contrasena: '123',
      persona: {
        nombres: 'juan',
        primerApellido: 'perez',
        segundoApellido: 'perez',
        nroDocumento: '123456122',
        fechaNacimiento: '1911-11-11',
      },
    };
    const usuarioDto = plainToClass(CrearUsuarioDto, datosUsuario);
    const usuarioAuditoria = TextService.generateUuid();
    try {
      await service.crear(usuarioDto, usuarioAuditoria);
    } catch (error) {
      expect(error).toBeInstanceOf(PreconditionFailedException);
      expect(error.message).toEqual(Messages.EXISTING_NAME);
    }
  });
  it('[crear] Deberia lanzar una excepcion si ya existe un usuario con el mismo correo electronico', async () => {
    const datosUsuario = {
      usuario: 'usuario122',
      contrasena: '123',
      persona: {
        nombres: 'juana',
        primerApellido: 'perez',
        segundoApellido: 'perez',
        nroDocumento: '123456123',
        fechaNacimiento: '1911-11-11',
      },
    };
    const usuarioDto = plainToClass(CrearUsuarioDto, datosUsuario);
    const usuarioAuditoria = TextService.generateUuid();
    try {
      await service.crear(usuarioDto, usuarioAuditoria);
    } catch (error) {
      expect(error).toBeInstanceOf(PreconditionFailedException);
      expect(error.message).toEqual(Messages.EXISTING_EMAIL);
    }
  });
  it('[crear] Deberia crear un nuevo usuario', async () => {
    const datosUsuario = {
      usuario: 'usuario122',
      contrasena: '123',
      persona: {
        nombres: 'juan',
        primerApellido: 'perez',
        segundoApellido: 'perez',
        nroDocumento: '123456122',
        fechaNacimiento: '1911-11-11',
      },
    };
    const usuarioDto = plainToClass(CrearUsuarioDto, datosUsuario);
    const usuarioAuditoria = TextService.generateUuid();
    const usuario = await service.crear(usuarioDto, usuarioAuditoria);

    expect(usuario).toBeDefined();
    expect(usuario).toHaveProperty('id');
    expect(usuario).toHaveProperty('estado');
  });

  it('[activar] Deberia activar un usuario en estado CREADO', async () => {
    const idUsuario = TextService.generateUuid();
    const usuarioAuditoria = TextService.generateUuid();
    const usuario = await service.activar(idUsuario, usuarioAuditoria);

    expect(usuario).toBeDefined();
    expect(usuario).toHaveProperty('id');
    expect(usuario).toHaveProperty('estado');
    expect(usuario.estado).toEqual('ASIGNADO');
  });

  it('[activar] Deberia lanzar una excepcion si el usuario no existe', async () => {
    try {
      const idUsuario = TextService.generateUuid();
      const usuarioAuditoria = TextService.generateUuid();
      await service.activar(idUsuario, usuarioAuditoria);
    } catch (error) {
      expect(error).toBeInstanceOf(EntityNotFoundException);
    }
  });

  it('[activar] Deberia lanzar una excepcion si el usuario no tiene un estado valido para activacion', async () => {
    try {
      const idUsuario = TextService.generateUuid();
      const usuarioAuditoria = TextService.generateUuid();
      await service.activar(idUsuario, usuarioAuditoria);
    } catch (error) {
      expect(error).toBeInstanceOf(EntityNotFoundException);
    }
  });

  it('[inactivar] Deberia inactivar un usuario en cualquier estado', async () => {
    const idUsuario = TextService.generateUuid();
    const usuarioAuditoria = TextService.generateUuid();
    const usuario = await service.inactivar(idUsuario, usuarioAuditoria);

    expect(usuario).toBeDefined();
    expect(usuario).toHaveProperty('id');
    expect(usuario).toHaveProperty('estado');
  });

  it('[inactivar] Deberia lanzar una excepcion si el usuario no existe', async () => {
    try {
      const idUsuario = TextService.generateUuid();
      const usuarioAuditoria = TextService.generateUuid();
      await service.inactivar(idUsuario, usuarioAuditoria);
    } catch (error) {
      expect(error).toBeInstanceOf(EntityNotFoundException);
    }
  });

  it('[actualizarContrasena] Deberia actualizar la contraseña de un usuario autenticado', async () => {
    const idUsuario = TextService.generateUuid();
    const contrasenaActual = TextService.btoa(encodeURI('123'));
    const contrasenaNueva = TextService.btoa(encodeURI('Contr4seN1AS3gur4'));
    const result = await service.actualizarContrasena(
      idUsuario,
      contrasenaActual,
      contrasenaNueva,
    );
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });

  it('[actualizarContrasena] Deberia lanzar una excepcion si la contraseña actual es incorrecta', async () => {
    const idUsuario = TextService.generateUuid();
    const contrasenaActual = TextService.btoa(encodeURI('1234'));
    const contrasenaNueva = TextService.btoa(encodeURI('Contr4seN1AS3gur4'));
    try {
      await service.actualizarContrasena(
        idUsuario,
        contrasenaActual,
        contrasenaNueva,
      );
    } catch (error) {
      expect(error).toBeInstanceOf(PreconditionFailedException);
    }
  });

  it('[actualizarContrasena] Deberia lanzar una excepcion si la contraseña nueva no es segura', async () => {
    const idUsuario = TextService.generateUuid();
    const contrasenaActual = '1234';
    const contrasenaNueva = 'password';
    try {
      await service.actualizarContrasena(
        idUsuario,
        contrasenaActual,
        contrasenaNueva,
      );
    } catch (error) {
      expect(error).toBeInstanceOf(PreconditionFailedException);
    }
  });

  it('[restaurarContrasena] Deberia restaurar la contraseña de un usuario', async () => {
    const idUsuario = TextService.generateUuid();
    const usuarioAuditoria = TextService.generateUuid();
    const result = await service.restaurarContrasena(
      idUsuario,
      usuarioAuditoria,
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });

  it('[restaurarContrasena] Deberia lanzar una excepcion si el usuario no existe', async () => {
    try {
      const idUsuario = TextService.generateUuid();
      const usuarioAuditoria = TextService.generateUuid();
      await service.restaurarContrasena(idUsuario, usuarioAuditoria);
    } catch (error) {
      expect(error).toBeInstanceOf(EntityNotFoundException);
    }
  });
});
