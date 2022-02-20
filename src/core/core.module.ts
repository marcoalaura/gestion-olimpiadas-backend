import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { ConfigCoreModule } from './config/config.module';
import { ExternalServicesModule } from './external-services/external.module';
import { LogService } from './logs/log.service';
@Module({
  imports: [
    ConfigCoreModule,
    ExternalServicesModule,
    AuthorizationModule,
    AuthenticationModule,
    LogService,
  ],
  exports: [ExternalServicesModule, AuthenticationModule],
})
export class CoreModule {}
