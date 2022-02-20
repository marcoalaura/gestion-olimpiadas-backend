import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import * as dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';

import { AuthenticationService } from './authentication.service';
import { RefreshTokensRepository } from '../repository/refreshTokens.repository';
import { RefreshTokens } from '../entity/refreshTokens.entity';
import { UsuarioService } from '../../../application/usuario/usuario.service';

import { Cron } from '@nestjs/schedule';

import * as dotenv from 'dotenv';
import { EstudianteService } from '../../../application/olimpiada/service/estudiante.service';
import { RolService } from '../../../core/authorization/service/rol.service';
import { AuthorizationService } from '../../../core/authorization/controller/authorization.service';

dotenv.config();

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshTokensRepository)
    private refreshTokensRepository: RefreshTokensRepository,
    @Inject(forwardRef(() => AuthenticationService))
    private autenticacionService: AuthenticationService,
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly estudianteService: EstudianteService,
    private readonly rolService: RolService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async findById(id: string): Promise<RefreshTokens> {
    return this.refreshTokensRepository.findById(id);
  }

  async create(grantId: string): Promise<RefreshTokens> {
    const ttl = parseInt(
      this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
      10,
    );
    const currentDate = new Date();
    const refreshToken = this.refreshTokensRepository.create({
      id: nanoid(),
      grantId,
      iat: currentDate,
      expiresAt: new Date(currentDate.getTime() + ttl),
      isRevoked: false,
      data: {},
    });
    return this.refreshTokensRepository.save(refreshToken);
  }

  async saveAccessToken(refreshTokenId: string, data: any) {
    const accessToken = this.refreshTokensRepository.create({
      id: data.id,
      grantId: data.grantId,
      iat: data.iat,
      expiresAt: data.expiresAt,
      isRevoked: false,
      data: {},
      refreshTokenId,
    });
    return this.refreshTokensRepository.save(accessToken);
  }

  async createAccessToken(cookie: string) {
    const refreshToken = await this.refreshTokensRepository.busarPorCookie(
      cookie,
    );

    if (!refreshToken) {
      throw new NotFoundException();
    }

    // eliminar refresh token anterior
    await this.refreshTokensRepository.eliminarRefreshTokenPorGrandId(
      refreshToken.grantId,
      refreshToken.id,
    );

    if (!dayjs().isBefore(dayjs(refreshToken.expiresAt))) {
      throw new UnauthorizedException();
    }

    // usuario
    const usuario = await this.usuarioService.buscarUsuarioId(
      refreshToken.grantId,
    );

    const rolesArray = [];
    if (usuario.roles.length) {
      usuario.roles.map((usuarioRol: any) => {
        rolesArray.push(usuarioRol.rol);
      });
    }
    usuario.roles = this.autenticacionService.agruparRoles(usuario.roles);
    usuario.roles = await this.autenticacionService.olimpiadasPorRol(
      usuario.roles,
      usuario.id,
    );
    const {
      roles,
      idRol,
      rol,
    } = this.autenticacionService.usuarioOlimpiadaActual(
      usuario,
      usuario.roles,
    );
    usuario.roles = roles;

    let newRefreshToken = null;
    const rft = parseInt(this.configService.get('REFRESH_TOKEN_ROTATE_IN'), 10);

    // crear rotacion de refresh token
    if (dayjs(refreshToken.expiresAt).diff(dayjs()) < rft) {
      newRefreshToken = await this.create(refreshToken.grantId);
    }
    // crear access_token
    const accessTokenId = nanoid();
    const payload = {
      interactionId: accessTokenId,
      id: usuario.id,
      roles: rolesArray,
      idRol,
      rol,
    };

    const accessToken = this.jwtService.sign(payload);
    // guardar access_token
    const accessTokenDecode: any = this.jwtService.decode(accessToken);

    const refreshTokenId = newRefreshToken
      ? newRefreshToken.id
      : refreshToken.id;
    await this.saveAccessToken(refreshTokenId, {
      id: accessTokenDecode.interactionId,
      grantId: accessTokenDecode.id,
      iat: new Date(accessTokenDecode.iat * 1000),
      expiresAt: new Date(accessTokenDecode.exp * 1000),
    });
    // retornar respuesta
    const data = {
      access_token: accessToken,
      ...usuario,
    };

    return {
      data,
      refresh_token: newRefreshToken ? { id: newRefreshToken.id } : null,
    };
  }

  async createAccessTokenEstudiante(cookie: string) {
    const refreshToken = await this.refreshTokensRepository.busarPorCookie(
      cookie,
    );
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    // eliminar refresh token anterior
    // await this.refreshTokensRepository.eliminarRefreshTokenPorGrandId(
    //   refreshToken.grantId,
    //   refreshToken.id,
    // );

    if (!dayjs().isBefore(dayjs(refreshToken.expiresAt))) {
      throw new UnauthorizedException();
    }

    // estudiante
    const estudiante = await this.estudianteService.encontrarPorId(
      refreshToken.grantId,
    );

    const rol = await this.rolService.obtenerRolPorNombre('ESTUDIANTE');

    let newRefreshToken = null;
    const rft = parseInt(this.configService.get('REFRESH_TOKEN_ROTATE_IN'), 10);

    // crear rotacion de refresh token
    if (dayjs(refreshToken.expiresAt).diff(dayjs()) < rft) {
      newRefreshToken = await this.create(refreshToken.grantId);
    }

    // crear access_token
    const accessTokenId = nanoid();
    const payload = {
      interactionId: accessTokenId,
      id: estudiante.id,
      roles: ['ESTUDIANTE'],
      idRol: rol?.id,
      rol: rol?.rol,
    };
    const accessToken = this.jwtService.sign(payload);
    // guardar access token
    // const accessTokenDecode: any = this.jwtService.decode(accessToken);

    // const refreshTokenId = newRefreshToken
    //   ? newRefreshToken.id
    //   : refreshToken.id;
    // await this.saveAccessToken(refreshTokenId, {
    //   id: accessTokenDecode.interactionId,
    //   grantId: accessTokenDecode.id,
    //   iat: new Date(accessTokenDecode.iat * 1000),
    //   expiresAt: new Date(accessTokenDecode.exp * 1000),
    // });
    const modulos = await this.authorizationService.obtenerPermisosPorRol(
      'ESTUDIANTE',
    );
    // retornar respuesta
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
      data,
      refresh_token: newRefreshToken ? { id: newRefreshToken.id } : null,
    };
  }

  async removeByid(id: string) {
    const refreshToken = await this.refreshTokensRepository.findOne(id);
    if (!refreshToken) {
      return {};
    }
    return this.refreshTokensRepository.remove(refreshToken);
  }

  @Cron(process.env.REFRESH_TOKEN_REVISIONS)
  async eliminarCaducos() {
    return this.refreshTokensRepository.eliminarTokensCaducos();
  }

  async eliminarPorGrantId(grantId: string) {
    return this.refreshTokensRepository.eliminarTokensPorGrantId(grantId);
  }
}
