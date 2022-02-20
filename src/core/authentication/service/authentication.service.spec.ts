import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MensajeriaService } from '../../../core/external-services/mensajeria/mensajeria.service';
import { UsuarioService } from '../../../application/usuario/usuario.service';
import { AuthenticationService } from './authentication.service';
import { RefreshTokensService } from './refreshTokens.service';
import { EntityUnauthorizedException } from '../../../common/exceptions/entity-unauthorized.exception';
import { Configurations } from '../../../common/constants';
import * as dayjs from 'dayjs';
import { TextService } from '../../../common/lib/text.service';
import { EstudianteService } from '../../../application/olimpiada/service/estudiante.service';
import { AuthorizationService } from '../../../core/authorization/controller/authorization.service';
import { Persona } from '../../../application/persona/persona.entity';
import { plainToClass } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { UsuarioRolService } from '../../../application/usuario/usuario-rol.service';
import { RolService } from '../../../core/authorization/service/rol.service';

const resSign = 'aaa.bbb.ccc';
const resBuscarUsuario = {
  id: 11111,
  usuario: 'user',
  contrasena: '$2b$10$Tq95LTM6Ofo0oEbD8J4/E.8xr13SVbNYXfX7y1Q.IconhxfHuKRVe',
  estado: 'ACTIVO',
  usuarioRol: [
    {
      estado: 'ACTIVO',
      rol: {
        rol: 'ADMINISTRADOR',
      },
    },
  ],
  intentos: 0,
};

const resPersona = {
  nombres: 'JUAN',
  primerApellido: 'PEREZ',
  segundoApellido: 'PEREZ',
  fechaNacimiento: '1999-11-11',
};

const refreshToken = { resfresh_token: '1' };

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let usuarioService: UsuarioService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        AuthenticationService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => resSign),
          },
        },
        {
          provide: AuthorizationService,
          useValue: {
            obtenerPermisosPorRol: jest.fn(() => []),
          },
        },
        {
          provide: UsuarioService,
          useValue: {
            buscarUsuario: jest
              .fn()
              .mockReturnValueOnce(resBuscarUsuario)
              .mockReturnValueOnce(resBuscarUsuario)
              .mockReturnValueOnce({ ...resBuscarUsuario, estado: 'INACTIVO' })
              .mockReturnValueOnce({
                ...resBuscarUsuario,
                intentos: Configurations.WRONG_LOGIN_LIMIT,
              })
              .mockReturnValueOnce({
                ...resBuscarUsuario,
                intentos: Configurations.WRONG_LOGIN_LIMIT - 1,
              })
              .mockReturnValueOnce({
                ...resBuscarUsuario,
                intentos: Configurations.WRONG_LOGIN_LIMIT,
                fechaBloqueo: dayjs().subtract(2, 'minutes').toDate(),
              }),
            actualizarDatosBloqueo: jest.fn(() => ({})),
            actualizarContadorBloqueos: jest.fn(() => ({})),
            buscarUsuarioPorCI: jest
              .fn()
              .mockReturnValueOnce(undefined)
              .mockReturnValueOnce({
                ...resBuscarUsuario,
                estado: 'INACTIVO',
                persona: resPersona,
              })
              .mockReturnValueOnce({
                ...resBuscarUsuario,
                estado: 'ACTIVO',
                persona: resPersona,
              }),
          },
        },
        {
          provide: RefreshTokensService,
          useValue: {
            create: jest.fn(() => refreshToken),
            createAccessToken: jest.fn(() => refreshToken),
          },
        },
        {
          provide: MensajeriaService,
          useValue: {
            sendEmail: jest.fn(() => ({ finalizado: true })),
          },
        },
        {
          provide: EstudianteService,
          useValue: {
            encontrarEstudiantePorCiRude: jest.fn(() => ({
              id: TextService.generateUuid(),
            })),
          },
        },
        {
          provide: UsuarioRolService,
          useValue: {
            obtenerOlimpiadasPorRolUsuario: jest.fn(() => ({
              idOlimpiada: TextService.generateUuid(),
            })),
          },
        },
        {
          provide: RolService,
          useValue: {
            obtenerRolPorNombre: jest.fn(() => ({
              idRol: TextService.generateUuid(),
              rol: 'ESTUDIANTE',
            })),
          },
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    usuarioService = module.get<UsuarioService>(UsuarioService);
  });

  it('[autenticar] deberia generar un token de acceso.', async () => {
    const user = {
      usuario: 'user',
      id: '11111',
    };
    const credenciales = await service.autenticarOidc(user);
    // expect(credenciales).toHaveProperty('access_token');
    expect(credenciales?.data?.access_token).toEqual(resSign);
  });

  it('[validarUsuario] deberia validar un usuario exitosamente.', async () => {
    const usuario = await service.validarUsuario(
      'user',
      TextService.btoa(encodeURI('123')),
    );

    expect(usuario).toHaveProperty('id');
  });

  it('[validarUsuario] deberia lanzar una excepcion para un usuario con contrasena erronea.', async () => {
    try {
      await service.validarUsuario('user', TextService.btoa(encodeURI('1234')));
    } catch (error) {
      expect(error instanceof EntityUnauthorizedException);
      expect(error.status).toEqual(401);
    }
  });

  it('[validarUsuario] deberia lanzar una excepcion para un usuario INACTIVO.', async () => {
    try {
      await service.validarUsuario('user', TextService.btoa(encodeURI('123')));
    } catch (error) {
      expect(error instanceof EntityUnauthorizedException);
      expect(error.status).toEqual(401);
    }
  });

  it('[validarUsuario] deberia lanzar una excepcion si excedio el limite de intentos erroneos de inicio de sesion.', async () => {
    try {
      await service.validarUsuario('user', TextService.btoa(encodeURI('123')));
    } catch (error) {
      expect(error instanceof EntityUnauthorizedException);
      expect(error.status).toEqual(401);
    }
  });

  it('[validarUsuario] deberia restablecer el limite de intentos si inicio sesion correctamente.', async () => {
    await service.validarUsuario('user', TextService.btoa(encodeURI('123')));

    expect(usuarioService.actualizarContadorBloqueos).toBeCalled();
  });

  it('[validarUsuario] deberia permitir iniciar sesion si la fecha limite bloqueo ya expiro.', async () => {
    try {
      await service.validarUsuario('user', TextService.btoa(encodeURI('1234')));
    } catch (error) {
      expect(error instanceof EntityUnauthorizedException);
      expect(usuarioService.actualizarDatosBloqueo).toBeCalled();
      expect(usuarioService.actualizarContadorBloqueos).toBeCalled();
    }
  });

  it('[validarUsuarioOidc] Deberia retornar null cuando no existe el usuario.', async () => {
    const persona = plainToClass(Persona, resPersona);

    const result = await service.validarUsuarioOidc(persona);
    expect(result).toBeFalsy();
  });

  it('[validarUsuarioOidc] Deberia retornar excepcion si el usuario esta INACTIVO.', async () => {
    try {
      const persona = plainToClass(Persona, resPersona);
      await service.validarUsuarioOidc(persona);
    } catch (error) {
      expect(error).toBeInstanceOf(EntityUnauthorizedException);
    }
  });

  it('[validarUsuarioOidc] Deberia retornar el id si el usuario esta ACTIVO.', async () => {
    const persona = plainToClass(Persona, resPersona);
    const result = await service.validarUsuarioOidc(persona);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
  });
});
