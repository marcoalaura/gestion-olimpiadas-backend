import { IsNotEmpty, IsNumber, Max, Min } from '../../../common/validation';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { TotalPuntaje } from '../../../common/constants';

export class MedalleroPosicionRuralDto {
  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  orden: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  posicionMinima: string;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Max(TotalPuntaje)
  @Min(0)
  posicionMaxima: string;

  @ApiProperty({ example: 50 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Max(TotalPuntaje)
  @Min(1)
  notaMinima: string;

  idEtapaAreaGrado?: string;
  estado?: string;
  usuarioAuditoria?: string;
}

export class MedalleroPosicionRuralRespuestaDto {
  @ApiProperty({ example: '54aa89d1-d8d9-495d-871d-0a4000a68954' })
  id: string;

  @ApiProperty({ example: 2 })
  orden: number;

  @ApiProperty({ example: 50 })
  posicionMinima: number;

  @ApiProperty({ example: 50 })
  posicionMaxima: number;

  @ApiProperty({ example: 50 })
  notaMinima: number;
}
