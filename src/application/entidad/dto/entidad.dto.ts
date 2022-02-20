import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EntidadDto {
  @ApiProperty()
  @IsNotEmpty()
  razonSocial: string;

  @ApiProperty()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty()
  @IsNotEmpty()
  nit: string;

  @ApiProperty()
  @IsNotEmpty()
  sigla: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  telefonos: string;

  @ApiProperty()
  direccion: string;

  @ApiProperty()
  web: string;

  @ApiProperty()
  info: string;

  @ApiProperty()
  codigoPortalUnico: string;

  @ApiProperty()
  estado: string;
}
