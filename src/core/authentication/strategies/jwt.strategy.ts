import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsuarioRolService } from '../../../application/usuario/usuario-rol.service';
import { cleanObject } from '../../../common/lib/object.module';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usuarioRolService: UsuarioRolService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const data = {
      id: payload.id,
      roles: payload.roles,
      idRol: payload.idRol,
      rol: payload.rol,
      exp: payload.exp,
      iat: payload.iat,
      nivel: {},
      interactionId: payload.interactionId,
    };
    data.nivel = await this.obtenerNiveles(data.id, data.idRol, data.rol);
    return data;
  }

  async obtenerNiveles(idUsuario: string, idRol: string, rol: string) {
    const usuarioRol = await this.usuarioRolService.obtenerNiveles(
      idUsuario,
      idRol,
      rol,
    );
    const niveles = usuarioRol.map((nivel) => cleanObject(nivel));
    return niveles;
  }
}
