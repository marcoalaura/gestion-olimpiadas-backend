import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GetJsonData } from '../lib/json.module';

const FORMAT_DEFAULT = 'pdf';

export class ReporteQueryDto {
  @IsNotEmpty()
  @IsString()
  readonly filtro?: string;

  @IsString()
  @IsOptional()
  readonly format?: string = FORMAT_DEFAULT;

  get filtroJSON(): any {
    return this.filtro ? GetJsonData(this.filtro) : {};
  }

  get idOlimpiada(): string {
    return this.filtroJSON && this.filtroJSON.idOlimpiada
      ? this.filtroJSON.idOlimpiada
      : null;
  }

  get idDepartamento(): string {
    return this.filtroJSON && this.filtroJSON.idDepartamento
      ? this.filtroJSON.idDepartamento
      : null;
  }

  get idEtapa(): string {
    return this.filtroJSON && this.filtroJSON.idEtapa
      ? this.filtroJSON.idEtapa
      : null;
  }

  get idArea(): string {
    return this.filtroJSON && this.filtroJSON.idArea
      ? this.filtroJSON.idArea
      : null;
  }

  get idDistrito(): string {
    return this.filtroJSON && this.filtroJSON.idDistrito
      ? this.filtroJSON.idDistrito
      : null;
  }

  get idGradoEscolar(): string {
    return this.filtroJSON && this.filtroJSON.idGradoEscolar
      ? this.filtroJSON.idGradoEscolar
      : null;
  }
}
