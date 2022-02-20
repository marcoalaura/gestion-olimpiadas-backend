import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
// import { Issuer } from 'openid-client';
import { sendRefreshToken } from '../../../common/lib/http.module';

import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { OidcAuthGuard } from '../guards/oidc-auth.guard';
import { AuthenticationService } from '../service/authentication.service';
import { RefreshTokensService } from '../service/refreshTokens.service';
import { PinoLogger } from 'nestjs-pino';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  LoginEstudianteDto,
  LoginEstudianteResp,
} from './dto/authentication.dto';

@Controller()
export class AuthenticationController {
  static staticLogger: PinoLogger;

  constructor(
    private readonly autenticacionService: AuthenticationService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthenticationController.name);
    AuthenticationController.staticLogger = this.logger;
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth')
  async login(@Request() req: any, @Res() res: Response) {
    const result = await this.autenticacionService.autenticar(req.user);
    this.logger.info(`Usuario: ${result.data.id} ingreso al sistema`);
    sendRefreshToken(res, result.refresh_token.id);
    return res
      .status(200)
      .send({ finalizado: true, mensaje: 'ok', datos: result.data });
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-rol')
  async changeRol(
    @Request() req: any,
    @Res() res: Response,
    @Body() payload: any,
  ) {
    const result = await this.autenticacionService.cambiarRol(
      req.user,
      payload,
    );
    sendRefreshToken(res, result.refresh_token.id);
    return res
      .status(200)
      .send({ finalizado: true, mensaje: 'ok', datos: result.data });
  }

  @UseGuards(OidcAuthGuard)
  @Get('ciudadania-auth')
  async loginCiudadania() {
    //
  }

  @UseGuards(OidcAuthGuard)
  @Get('ciudadania-callback')
  async loginCiudadaniaCallback(@Request() req, @Res() res: Response) {
    if (req.user) {
      const result = await this.autenticacionService.autenticarOidc(req.user);
      sendRefreshToken(res, result.refresh_token.id);
      res
        .status(200)
        .redirect(
          `${process.env.URL_FRONTEND}/#/login?code=${result.data.access_token}`,
        );
    } else {
      res.redirect(`${process.env.URL_FRONTEND}`);
    }
  }

  @Post('auth/estudiante')
  @ApiOperation({ summary: 'Login para estudiantes' })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión correcto',
    type: LoginEstudianteResp,
  })
  async loginEstudiante(
    @Request() req: any,
    @Res() res: Response,
    @Body() loginEstudianteDto: LoginEstudianteDto,
  ) {
    loginEstudianteDto = new LoginEstudianteDto(loginEstudianteDto);

    const result: any = await this.autenticacionService.autenticarEstudiante(
      loginEstudianteDto,
    );
    if (!result.data || !result.data.id) {
      throw new UnauthorizedException('Estudiante no registrado');
    }
    const data = { ...result };
    delete data.refresh_token;
    this.logger.info(`Usuario: ${result.data.id} ingreso al sistema`);
    sendRefreshToken(res, result.refresh_token.id);
    return res
      .status(200)
      .send({ finalizado: true, mensaje: 'ok', datos: data });
  }

  @Get('logout')
  async logoutCiudadania(@Request() req, @Res() res: Response) {
    const cookie = req.cookies[process.env.REFRESH_TOKEN_NAME] || '';
    if (cookie != '') {
      await this.refreshTokensService.removeByid(cookie);
    }
    // const idToken = req.user ? req.user.idToken : null;
    // req.logout();
    req.session = null;
    res.clearCookie('connect.sid');
    res.clearCookie('cookie', cookie);
    // verificar que el token esta bien
    // const idUsuario = JSON.parse(
    //   Buffer.from(req.headers.authorization.split('.')[1], 'base64').toString(),
    // ).id;
    // this.logger.info(`Usuario: ${idUsuario} salio del sistema`);
    // // remover todos los tokens del usuario
    // if (idUsuario) {
    //   await this.refreshTokensService.eliminarPorGrantId(idUsuario);
    // }
    // if (idToken) {
    //   const issuer = await Issuer.discover(process.env.OIDC_ISSUER);
    //   const url = issuer.metadata.end_session_endpoint;
    //   if (url) {
    //     return res.status(200).json({
    //       url: `${url}?post_logout_redirect_uri=${process.env.OIDC_POST_LOGOUT_REDIRECT_URI}&id_token_hint=${idToken}`,
    //     });
    //   }
    // }
    return res.status(200).json();
  }
}
