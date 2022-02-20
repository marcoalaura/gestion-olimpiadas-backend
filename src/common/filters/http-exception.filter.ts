import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  PreconditionFailedException,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';
import { EntityNotFoundException } from '../exceptions/entity-not-found.exception';
import { EntityUnauthorizedException } from '../exceptions/entity-unauthorized.exception';
import { Messages } from '../constants/response-messages';
import { ExternalServiceException } from '../exceptions/external-service.exception';
import { PinoLogger } from 'nestjs-pino';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  static staticLogger: PinoLogger;

  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HttpExceptionFilter.name);
    HttpExceptionFilter.staticLogger = this.logger;
  }
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = exception.getStatus()
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const r = <any>exception.getResponse();
    let errores = [];

    console.log('[error]', { r, exception });
    this.logger.error({ data: { r, exception } }, '[error]');

    if (Array.isArray(r.message)) {
      status = HttpStatus.BAD_REQUEST;
      const validationErrors = r.message;
      errores = validationErrors;
    }
    const mensaje = this.isBusinessException(exception);
    const errorResponse = {
      finalizado: false,
      codigo: status,
      timestamp: Math.floor(Date.now() / 1000),
      mensaje,
      datos: {
        errores,
      },
    };
    response.status(status).json(errorResponse);
  }
  public isBusinessException(exception: Error): any {
    if (
      exception instanceof EntityNotFoundException ||
      exception instanceof EntityUnauthorizedException ||
      exception instanceof ExternalServiceException
    ) {
      return exception.message;
    } else {
      const message = this.filterMessage(exception);
      return message;
    }
  }

  filterMessage(exception) {
    let message;
    switch (exception.constructor) {
      case BadRequestException:
        message = Messages.EXCEPTION_BAD_REQUEST;
        break;
      case UnauthorizedException:
        message = Messages.EXCEPTION_UNAUTHORIZED;
        break;
      case NotFoundException:
        message = Messages.EXCEPTION_NOT_FOUND;
        break;
      case PreconditionFailedException:
        message = exception.message || Messages.EXCEPTION_PRECONDITION_FAILED;
        break;
      case ForbiddenException:
        message = Messages.EXCEPTION_FORBIDDEN;
        break;
      default:
        message = Messages.EXCEPTION_DEFAULT;
    }
    return message;
  }
}
