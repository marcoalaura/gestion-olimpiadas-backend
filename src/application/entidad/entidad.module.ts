import { Module } from '@nestjs/common';
import { EntidadController } from './entidad.controller';
import { EntidadService } from './entidad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntidadRepository } from './entidad.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([EntidadRepository]), ConfigModule],
  controllers: [EntidadController],
  providers: [EntidadService, ConfigService],
  exports: [EntidadService],
})
export class EntidadModule {}
