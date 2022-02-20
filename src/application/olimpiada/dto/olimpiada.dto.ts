import { IsNotEmpty, MaxLength } from '../../../common/validation';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OlimpiadaDto {
  @ApiProperty({ example: 'Olimpiada' })
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @ApiProperty({ example: 2021 })
  @IsNotEmpty()
  gestion: number;

  @ApiProperty({ example: 'OCEPB2021' })
  @IsNotEmpty()
  @MaxLength(30)
  sigla: string;

  @ApiProperty()
  fechaInicio: Date;

  @ApiProperty()
  fechaFin: Date;

  @IsNotEmpty()
  @MaxLength(255)
  leyenda: string;

  @IsNotEmpty()
  @IsString()
  logo: string;

  usuarioCreacion?: string;
  usuarioActualizacion?: string;
}

export class OlimpiadaActualizacionDto {
  @ApiProperty({ example: 'Olimpiada' })
  nombre?: string;

  @ApiProperty({ example: 2021 })
  gestion?: number;

  @ApiProperty({ example: 'OCEPB2021' })
  sigla?: string;

  @ApiProperty()
  fechaInicio?: Date;

  @ApiProperty()
  fechaFin?: Date;

  @ApiProperty()
  leyenda?: string;

  @ApiProperty()
  logo?: string;

  usuarioCreacion?: string;
  usuarioActualizacion?: string;
}
