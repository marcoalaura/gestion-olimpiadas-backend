import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class PropiedadesDto {
  @IsString()
  icono: string;

  @IsString()
  color_light?: string;

  @IsString()
  color_dark?: string;
}
export class CrearModuloDto {
  @IsNotEmpty()
  @IsString()
  label: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsObject()
  propiedades: PropiedadesDto;
}
