import { Module } from '@nestjs/common';
import { ReporteService } from './reporte.service';
import { ReporteController } from './reporte.controller';
import { OlimpiadaModule } from '../olimpiada/olimpiada.module';
import { ReporteRepository } from './reporte.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EtapaRepository } from '../olimpiada/repository/etapa.repository';
import { AreaRepository } from '../olimpiada/repository/area.repository';
import { DistritoRepository } from '../olimpiada/repository/distrito.repository';
import { DepartamentoRepository } from '../olimpiada/repository/departamento.repository';
import { GradoEscolaridadRepository } from '../olimpiada/repository/gradoEscolaridad.repository';
import { CarboneModule } from 'libs/carbone/src';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReporteRepository,
      EtapaRepository,
      AreaRepository,
      DistritoRepository,
      DepartamentoRepository,
      GradoEscolaridadRepository,
    ]),
    OlimpiadaModule,
    CarboneModule,
    ConfigModule,
  ],
  providers: [ReporteService],
  controllers: [ReporteController],
  exports: [ReporteService],
})
export class ReporteModule {}
