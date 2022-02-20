import { Module } from '@nestjs/common';
import { ParametroController } from './parametro.controller';
import { ParametroService } from './parametro.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParametroRepository } from './parametro.repository';

@Module({
  controllers: [ParametroController],
  providers: [ParametroService],
  imports: [TypeOrmModule.forFeature([ParametroRepository])],
})
export class ParametroModule {}
