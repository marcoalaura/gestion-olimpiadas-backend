import { IsNotEmpty, IsString, IsNumber } from '../../../common/validation';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class MedalleroPosicionDto {
  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  ordenGalardon: string;

  @ApiProperty({ example: 'PLATA' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toUpperCase())
  @Transform(({ value }) => value?.trim())
  subGrupo: string;

  @ApiProperty({ example: 'PLATA - 1' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toUpperCase())
  denominativo: string;

  idEtapaAreaGrado?: string;
  estado?: string;
  usuarioAuditoria?: string;
}

export class MedalleroPosicionRespuestaDto {
  @ApiProperty({ example: '54aa89d1-d8d9-495d-871d-0a4000a68954' })
  id: string;

  @ApiProperty({ example: 2 })
  ordenGalardon: number;

  @ApiProperty({ example: 'PLATA' })
  subGrupo: string;

  @ApiProperty({ example: 'PLATA' })
  denominativo: string;
}
