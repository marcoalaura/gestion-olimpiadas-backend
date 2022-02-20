import {
  IsNotEmpty,
  IsArray,
  IsEmail,
  CorreoLista,
} from '../../../common/validation';
import { ValidateIf } from 'class-validator';
import { PersonaActualizacionDto } from '../../../application/persona/persona.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CrearUsuarioRolDto } from './crear-usuario-rol.dto';

export class ActualizarUsuarioRolDto {
  @IsNotEmpty()
  @IsEmail()
  @CorreoLista()
  @ValidateIf((o) => !o.roles)
  correoElectronico?: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateIf((o) => !o.correoElectronico)
  @Type(() => CrearUsuarioRolDto)
  roles: Array<CrearUsuarioRolDto>;
  // roles?: Array<string>;

  @ValidateNested()
  @Type(() => PersonaActualizacionDto)
  persona: PersonaActualizacionDto;
}
