import { ValidateIf, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  NombreApellido,
  NroDocumento,
  IsNumber,
  Max,
  Min,
} from '../../common/validation';

export class PersonaDto {
  @IsNotEmpty()
  @NroDocumento()
  @Transform(({ value }) => value?.trim())
  nroDocumento: string;

  tipoDocumento?: string;

  @IsNotEmpty()
  @NombreApellido()
  @Transform(({ value }) => value?.toUpperCase())
  nombres: string;

  @IsString()
  @ValidateIf((o) => !o.segundoApellido)
  @NombreApellido()
  @Transform(({ value }) => value?.toUpperCase())
  primerApellido?: string;

  @ValidateIf((o) => !o.primerApellido)
  @NombreApellido()
  @Transform(({ value }) => value?.toUpperCase())
  segundoApellido?: string;

  @IsString()
  fechaNacimiento: string;

  @ValidateIf((o) => o.telefono != null)
  @IsNumber()
  @Max(79999999)
  @Min(60000000)
  telefono: string;
}

export class PersonaActualizacionDto {
  @IsOptional()
  @IsNumber()
  @Max(79999999)
  @Min(60000000)
  telefono: string;
}
