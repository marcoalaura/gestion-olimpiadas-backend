import { IsNotEmpty, IsString, IsNumber } from '../../../common/validation';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
export class GradoEscolaridadDto {
  id?: string;

  @ApiProperty({ example: '1 SECUNDARIA' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toUpperCase())
  nombre: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  orden: number;

  estado: string;
}

export class GradoEscolaridadRespuestaDto {
  @ApiProperty({ example: 'fb33a4a1-89eb-4739-aa81-be9d5f386e59' })
  id: string;

  @ApiProperty({ example: '1 SECUNDARIA' })
  nombre: string;

  @ApiProperty({ example: 1 })
  orden: number;

  @ApiProperty({ example: 'ACTIVO' })
  estado: string;
}

export class GradoEscolaridadRespuestaCortaDto {
  @ApiProperty({ example: 'fb33a4a1-89eb-4739-aa81-be9d5f386e59' })
  id: string;

  @ApiProperty({ example: '1 SECUNDARIA' })
  nombre: string;
}

export class GradoEscolaridadResponseInscripcionDto {
  id?: string;

  @ApiProperty({ example: '1 SECUNDARIA' })
  nombre: string;
}
