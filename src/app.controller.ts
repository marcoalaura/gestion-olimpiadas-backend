import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

import { PinoLogger } from 'nestjs-pino';

@Controller()
export class AppController {
  static staticLogger: PinoLogger;

  constructor(
    private readonly logger: PinoLogger,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.logger.setContext(AppController.name);
    AppController.staticLogger = this.logger;
  }

  @Get('/estado')
  async verificarEstado(@Res() res: Response) {
    this.logger.info('Consulta del estado');
    return res.status(HttpStatus.OK).json({
      estado: 'Servicio funcionando correctamente',
      commit_sha: this.configService.get('CI_COMMIT_SHORT_SHA'),
      mensaje: this.configService.get('CI_COMMIT_MESSAGE'),
      branch: this.configService.get('CI_COMMIT_REF_NAME'),
      hora: Math.floor(Date.now() / 1000),
    });
  }
}
