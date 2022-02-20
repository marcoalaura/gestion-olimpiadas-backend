import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
} from '../../../common/validation';
import { ApiProperty } from '@nestjs/swagger';
import { DepartamentoDto } from './departamento.dto';
import { Transform, Type } from 'class-transformer';

export class DistritoDto {
  id?: string;

  @ApiProperty({ example: 'Cotoca' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toUpperCase())
  nombre: string;

  @ApiProperty({ example: 1003 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Max(9999)
  codigo: number;

  @ApiProperty({ example: '018bd25f-e215-4ef7-ab11-7c0ae97c58ab' })
  @IsUUID()
  @IsNotEmpty()
  idDepartamento: string;

  estado?: string;
}

export class DistritoRespuestaDto {
  @ApiProperty({ example: 'd4f35a56-a812-44dd-8ca7-f6b6899fda14' })
  id: string;

  @ApiProperty({ example: 'Cotoca' })
  nombre: string;

  @ApiProperty({ example: 'D0003' })
  @IsNotEmpty()
  codigo: string;

  @ApiProperty({ example: 'ACTIVO' })
  estado: string;

  @ApiProperty()
  departamento: DepartamentoDto;
}
