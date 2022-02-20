import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { Status } from '../../../common/constants';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from '../../../common/validation';

export class CrearUsuarioRolOlimpiadaDto {
  @IsNotEmpty()
  @IsUUID()
  idOlimpiada: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CrearUsuarioRolDto)
  usuarioRoles: Array<CrearUsuarioRolDto>;
}

export class CrearUsuarioRolDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  idOlimpiada?: string;

  @IsNotEmpty()
  @IsUUID()
  idRol?: string;

  idDepartamento?: string;

  idDistrito?: string;

  idUnidadEducativa?: string;

  idArea?: string;

  idEtapa?: string;

  @IsEnum([Status.ACTIVE, Status.INACTIVE])
  @IsOptional()
  estado?: string;
}
