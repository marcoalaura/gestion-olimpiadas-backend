import {
  Inject,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';

import { UsuarioService } from '../../../application/usuario/usuario.service';
import { EstudianteService } from '../../../application/olimpiada/service/estudiante.service';
import { UsuarioRolService } from '../../../application/usuario/usuario-rol.service';
import { JwtService } from '@nestjs/jwt';
import { TextService } from '../../../common/lib/text.service';
import { RefreshTokensService } from './refreshTokens.service';
import { Status, Configurations } from '../../../common/constants';
import { EntityUnauthorizedException } from '../../../common/exceptions/entity-unauthorized.exception';
import { Messages } from '../../../common/constants/response-messages';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';
import { MensajeriaService } from '../../../core/external-services/mensajeria/mensajeria.service';
import { AuthorizationService } from '../../../core/authorization/controller/authorization.service';
import { PersonaDto } from '../../../application/persona/persona.dto';
import { ConfigService } from '@nestjs/config';
import { TemplateEmailService } from '../../../common/templates/templates-email.service';
import { RolService } from '../../../core/authorization/service/rol.service';

dayjs.extend(isBetween);
@Injectable()
export class AuthenticationService {
  // eslint-disable-next-line max-params
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly estudianteService: EstudianteService,
    private readonly mensajeriaService: MensajeriaService,
    private readonly authorizationService: AuthorizationService,
    private readonly usuarioRolService: UsuarioRolService,
    private readonly rolService: RolService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  private async verificarBloqueo(usuario) {
    if (usuario.intentos >= Configurations.WRONG_LOGIN_LIMIT) {
      if (!usuario.fechaBloqueo) {
        // generar codigo y fecha de desbloqueo
        const codigo = TextService.generateUuid();
        const fechaBloqueo = dayjs().add(
          Configurations.MINUTES_LOGIN_LOCK,
          'minute',
        );
        await this.usuarioService.actualizarDatosBloqueo(
          usuario.id,
          codigo,
          fechaBloqueo,
        );
        // enviar codigo por email
        const urlDesbloqueo = `${this.configService.get(
          'URL_FRONTEND',
        )}/#/desbloqueo?q=${codigo}`;
        const template = TemplateEmailService.armarPlantillaBloqueoCuenta(
          urlDesbloqueo,
        );
        this.mensajeriaService.sendEmail(
          usuario.correoElectronico,
          Messages.SUBJECT_EMAIL_ACCOUNT_LOCKED,
          template,
        );
        return true;
      } else if (
        usuario.fechaBloqueo &&
        dayjs().isAfter(usuario.fechaBloqueo)
      ) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  private async generarIntentoBloqueo(usuario) {
    if (dayjs().isAfter(usuario.fechaBloqueo)) {
      // restaurar datos bloqueo
      await this.usuarioService.actualizarDatosBloqueo(usuario.id, null, null);
      await this.usuarioService.actualizarContadorBloqueos(usuario.id, 1);
    } else {
      const intento = usuario.intentos + 1;
      await this.usuarioService.actualizarContadorBloqueos(usuario.id, intento);
    }
  }

  async validarUsuario(usuario: string, contrasena: string): Promise<any> {
    const respuesta = await this.usuarioService.buscarUsuario(usuario);
    if (respuesta) {
      // verificar si la cuenta contiene un estado valido
      const statusValid = [Status.ACTIVE, Status.ASIGNADO];
      if (!statusValid.includes(respuesta.estado as Status)) {
        throw new EntityUnauthorizedException(Messages.INVALID_USER);
      }
      // verificar si la cuenta esta bloqueada
      const verificacionBloqueo = await this.verificarBloqueo(respuesta);
      if (verificacionBloqueo) {
        throw new EntityUnauthorizedException(Messages.USER_BLOCKED);
      }

      const pass = TextService.decodeBase64(contrasena);
      if (!(await TextService.compare(pass, respuesta.contrasena))) {
        await this.generarIntentoBloqueo(respuesta);
        throw new EntityUnauthorizedException(
          Messages.INVALID_USER_CREDENTIALS,
        );
      }
      // si se logra autenticar con exito => reiniciar contador de intentos a 0
      if (respuesta.intentos > 0) {
        this.usuarioService.actualizarContadorBloqueos(respuesta.id, 0);
      }
      let roles = [];
      if (respuesta.usuarioRol.length) {
        roles = respuesta.usuarioRol
          .map((usuarioRol) =>
            usuarioRol.estado === Status.ACTIVE ? usuarioRol.rol.rol : null,
          )
          .filter(Boolean);
      }

      return { id: respuesta.id, roles };
    }
    return null;
  }

  async autenticar(user: any) {
    const usuario = await this.usuarioService.buscarUsuarioId(user.id);
    // usuario.roles = this.filtrarOlimpiadasActivasActor(usuario.roles);
    usuario.roles = this.agruparRoles(usuario.roles);
    usuario.roles = await this.olimpiadasPorRol(usuario.roles, user.id);
    const { roles, idRol, rol } = this.usuarioOlimpiadaActual(
      user,
      usuario.roles,
    );
    usuario.roles = roles;
    const accessTokenId = nanoid();
    const payload = {
      interactionId: accessTokenId,
      id: user.id,
      roles: user.roles,
      idRol,
      rol,
    };
    // Las siguientes variables no son necesarias #832
    if (usuario.persona) {
      delete usuario.persona.nroDocumento;
      delete usuario.persona.fechaNacimiento;
    }
    // Eliminar sesiones anteriores
    const x = await this.refreshTokensService.eliminarPorGrantId(user.id);
    console.log(' ----------------- x: ', x.affected);
    // crear refresh_token
    const refreshToken = await this.refreshTokensService.create(user.id);
    // crear access_token
    const accessToken = this.jwtService.sign(payload);
    // guardar access_token
    const accessTokenDecode: any = this.jwtService.decode(accessToken);

    await this.refreshTokensService.saveAccessToken(refreshToken.id, {
      id: accessTokenDecode.interactionId,
      grantId: accessTokenDecode.id,
      iat: new Date(accessTokenDecode.iat * 1000),
      expiresAt: new Date(accessTokenDecode.exp * 1000),
    });
    // construir respuesta
    const data = {
      access_token: accessToken,
      ...usuario,
    };
    return {
      refresh_token: { id: refreshToken.id },
      data,
    };
  }

  usuarioOlimpiadaActual(user: any, roles: any) {
    let arrayRoles: any;
    if (user.idRol) {
      // buscar el rol activado
      arrayRoles = roles.map((item: any) => {
        if (item.idRol == user.idRol) {
          item.active = true;
        } else {
          item.active = false;
        }
        return item;
      });
    } else {
      // buscar el primer rol
      arrayRoles = roles.map((item: any, index: number) => {
        if (index === 0) {
          item.active = true;
        } else {
          item.active = false;
        }
        return item;
      });
    }
    const rolActivo = arrayRoles.find((item: any) => item.active === true);
    if (!rolActivo) {
      throw new PreconditionFailedException(
        `No tiene ninguna olimpiada vigente asignada.`,
      );
    }
    return {
      roles: arrayRoles,
      idRol: rolActivo?.idRol,
      rol: rolActivo?.rol,
    };
  }

  async autenticarEstudiante(loginEstudiante: any) {
    const estudiante = await this.estudianteService.encontrarEstudiantePorCiRude(
      loginEstudiante.usuario,
      loginEstudiante.rude,
    );

    if (!estudiante) {
      return {};
    }
    const rol = await this.rolService.obtenerRolPorNombre('ESTUDIANTE');

    const accessTokenId = nanoid();
    const payload = {
      interactionId: accessTokenId,
      id: estudiante.id,
      roles: ['ESTUDIANTE'],
      idRol: rol?.id,
      rol: rol?.rol,
    };
    // Eliminar sesiones anteriores
    // const x = await this.refreshTokensService.eliminarPorGrantId(estudiante.id);
    // console.log(' ----------------- x: ', x.affected);
    // crear refresh_token
    const refreshToken = await this.refreshTokensService.create(estudiante.id);
    // crear accessToken
    const accessToken = this.jwtService.sign(payload);
    // guardar access_token
    // const accessTokenDecode: any = this.jwtService.decode(accessToken);

    // await this.refreshTokensService.saveAccessToken(refreshToken.id, {
    //   id: accessTokenDecode.interactionId,
    //   grantId: accessTokenDecode.id,
    //   iat: new Date(accessTokenDecode.iat * 1000),
    //   expiresAt: new Date(accessTokenDecode.exp * 1000),
    // });
    // construir respuesta
    const modulos = await this.authorizationService.obtenerPermisosPorRol(
      'ESTUDIANTE',
    );
    const data = {
      access_token: accessToken,
      id: estudiante.id,
      rude: estudiante.rude,
      persona: estudiante.persona,
      roles: [
        {
          rol: 'ESTUDIANTE',
          modulos,
        },
      ],
    };
    return {
      refresh_token: { id: refreshToken.id },
      data,
    };
  }

  async validarUsuarioOidc(persona: PersonaDto): Promise<any> {
    const respuesta = await this.usuarioService.buscarUsuarioPorCI(persona);
    if (respuesta) {
      const { estado, persona: datosPersona } = respuesta;
      if (estado === Status.INACTIVE) {
        throw new EntityUnauthorizedException(Messages.INACTIVE_USER);
      }
      // actualizar datos persona
      if (
        datosPersona.nombres !== persona.nombres &&
        datosPersona.primerApellido !== persona.primerApellido &&
        datosPersona.segundoApellido !== persona.segundoApellido &&
        datosPersona.fechaNacimiento !== persona.fechaNacimiento
      ) {
        await this.usuarioService.actualizarDatosPersona(persona);
      }
      const roles = [];
      if (respuesta.usuarioRol.length) {
        respuesta.usuarioRol.map((usuarioRol) => {
          roles.push(usuarioRol.rol.rol);
        });
      }
      return { id: respuesta.id, roles };
    }
    return null;
  }

  async autenticarOidc(user: any) {
    const payload = { id: user.id, roles: user.roles };
    // crear refresh_token
    const refreshToken = await this.refreshTokensService.create(user.id);
    // construir respuesta
    const data = {
      access_token: this.jwtService.sign(payload),
    };
    return {
      refresh_token: { id: refreshToken.id },
      data,
    };
  }

  async cambiarRol(user: any, data: any) {
    const usuarioRol = {
      ...user,
      idRol: data.idRol,
    };
    return this.autenticar(usuarioRol);
  }

  agruparRoles(roles: any) {
    const obj = [];
    const arr = [];
    for (let i = 0, len = roles.length; i < len; i++) {
      if (!arr.includes(roles[i].rol)) {
        arr.push(roles[i].rol);
        obj.push(roles[i]);
      }
    }
    return obj;
  }

  filtrarOlimpiadasActivasActor(roles: any) {
    roles.filter((rol: any) => {
      if (rol.grupo === 'ACTOR') {
        return dayjs().isBetween(
          dayjs(rol.olimpiada.fechaInicio),
          dayjs(rol.olimpiada.fechaFin),
        );
      } else {
        return true;
      }
    });
    return roles;
  }

  async olimpiadasPorRol(roles: any, userId: string) {
    const arr = await Promise.all(
      roles.map(async (rol: any) => {
        const arrOlimpiadas = await this.usuarioRolService.obtenerOlimpiadasPorRolUsuario(
          rol.idRol,
          userId,
        );
        const olimpiadas = arrOlimpiadas.map((item) => item.olimpiada);
        return {
          ...rol,
          olimpiadas,
        };
      }),
    );
    return arr;
  }
}
