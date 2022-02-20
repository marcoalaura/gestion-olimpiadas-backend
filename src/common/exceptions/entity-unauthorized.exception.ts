import { HttpException, HttpStatus } from '@nestjs/common';

export class EntityUnauthorizedException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
