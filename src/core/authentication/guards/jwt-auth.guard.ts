import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { TokenOlimpiadaService } from '../../../application/olimpiada/service/tokenOlimpiada.service';

import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly tokenOlimpiadaService: TokenOlimpiadaService,
    private reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true;
    }
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await this.validarCookie(request);
    return result;
  }

  async validarCookie(request: any) {
    const cookie = request.cookies[process.env.REFRESH_TOKEN_NAME];
    console.log('[validarCookie] cookie', cookie);
    if (!cookie) {
      console.log('[UserSessionStrategy] No se encontró la cookie');
      throw new UnauthorizedException();
    }
    // const payload = request.user;
    // const session = await this.tokenOlimpiadaService?.findByRefreshTokenId(
    //   payload.interactionId,
    //   cookie,
    // );
    // if (this.tokenOlimpiadaService && !session) {
    //   console.log('[UserSessionStrategy] No se encontró la sessión ');
    //   throw new UnauthorizedException();
    // }
    return true;
  }
}
