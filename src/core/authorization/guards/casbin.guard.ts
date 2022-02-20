import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTHZ_ENFORCER } from 'nest-authz';
import { IS_CASBIN_OFF } from '../../../common/decorators/casbin-off.decorator';

@Injectable()
export class CasbinGuard implements CanActivate {
  constructor(
    @Inject(AUTHZ_ENFORCER) private enforcer,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isCasbinOff = this.reflector.get(IS_CASBIN_OFF, context.getHandler());
    if (isCasbinOff) return true;
    const {
      user,
      originalUrl,
      query,
      route,
      method: action,
    } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException();
    }
    const resource = Object.keys(query).length ? route.path : originalUrl;
    for (const rol of user.roles) {
      if (await this.enforcer.enforce(rol, resource, action)) return true;
    }
    return false;
  }
}
