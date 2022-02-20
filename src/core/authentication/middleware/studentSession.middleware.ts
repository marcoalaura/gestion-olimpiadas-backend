import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { RefreshTokensService } from '../service/refreshTokens.service';

@Injectable()
export class StudentSessionMiddleware implements NestMiddleware {
  constructor(private readonly refreshTokensService: RefreshTokensService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    console.log('[StudentSessionMiddleware] req.cookies: ', req.cookies);
    const cookie = req.cookies[process.env.REFRESH_TOKEN_NAME];
    if (!cookie) {
      console.log('[StudentSessionMiddleware] No se encontro la cookies ');
      throw new UnauthorizedException();
    }
    // const session = await this.refreshTokensService.findById(cookie);
    // if (!session) {
    //   console.log('[StudentSessionMiddleware] No se encontro la session ');
    //   throw new UnauthorizedException();
    // }
    next();
  }
}
