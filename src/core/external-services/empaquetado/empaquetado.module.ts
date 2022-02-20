import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmpaquetadoService } from './empaquetado.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get('EMPAQUETADO_URL'),
        headers: {
          authorization: `Bearer ${configService.get('EMPAQUETADO_TOKEN')}`,
        },
      }),
    }),
  ],
  providers: [EmpaquetadoService],
  exports: [EmpaquetadoService],
})
export class EmpaquetadoModule {}
