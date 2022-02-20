import { Module } from '@nestjs/common';
import { MensajeriaModule } from './mensajeria/mensajeria.module';
import { IopModule } from './iop/iop.module';
import { EmpaquetadoModule } from './empaquetado/empaquetado.module';

@Module({
  imports: [MensajeriaModule, IopModule, EmpaquetadoModule],
  providers: [],
  exports: [MensajeriaModule, IopModule, EmpaquetadoModule],
})
export class ExternalServicesModule {}
