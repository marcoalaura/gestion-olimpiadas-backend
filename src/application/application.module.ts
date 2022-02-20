import { Module } from '@nestjs/common';
import { EntidadModule } from './entidad/entidad.module';
import { ParametroModule } from './parametro/parametro.module';
import { ReporteModule } from './reporte/reporte.module';
import { OlimpiadaModule } from './olimpiada/olimpiada.module';
import { XlsxModule } from './xlsx/xlsx.module';

@Module({
  imports: [
    EntidadModule,
    ParametroModule,
    ReporteModule,
    OlimpiadaModule,
    XlsxModule,
  ],
})
export class ApplicationModule {}
