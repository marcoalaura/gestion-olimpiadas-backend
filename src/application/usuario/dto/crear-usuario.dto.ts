import { IsEmail, IsNotEmpty, CorreoLista } from '../../../common/validation';
import { PersonaDto } from '../../../application/persona/persona.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CrearUsuarioRolOlimpiadaDto } from './crear-usuario-rol.dto';

export class CrearUsuarioDto {
  usuario?: string;

  estado?: string;

  contrasena?: string;

  @IsNotEmpty()
  @IsEmail()
  @CorreoLista()
  correoElectronico: string;

  @ValidateNested()
  @Type(() => PersonaDto)
  persona: PersonaDto;

  ciudadaniaDigital?: boolean = false;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CrearUsuarioRolOlimpiadaDto)
  roles: Array<CrearUsuarioRolOlimpiadaDto>;

  usuarioCreacion?: string;
}
