import { IsNotEmpty, IsString } from '../../../common/validation';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class AreaDto {
  id?: string;

  @ApiProperty({ example: 'Matemáticas' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toUpperCase())
  nombre: string;

  estado?: string;

  @IsNotEmpty()
  @IsString()
  logo: string;
}

export class AreaRespuestaDto {
  @ApiProperty({ example: '795f761d-2764-408e-94ea-7d5020bc30ac' })
  id: string;

  @ApiProperty({ example: 'Matemáticas' })
  nombre: string;

  @ApiProperty({ example: 'ACTIVO' })
  estado: string;

  @IsNotEmpty()
  @IsString()
  logo: string;
}

export class AreaRespuestaCortaDto {
  @ApiProperty({ example: '795f761d-2764-408e-94ea-7d5020bc30ac' })
  id: string;

  @ApiProperty({ example: 'Matemáticas' })
  nombre: string;
}
