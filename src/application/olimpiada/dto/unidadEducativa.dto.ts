import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsNumber,
} from '../../../common/validation';
import { ApiProperty } from '@nestjs/swagger';
import {
  tiposUnidadesEducativas,
  tiposAreasGeograficas,
} from '../../../common/constants';
import { DistritoRespuestaDto } from './distrito.dto';
import { Transform, Type } from 'class-transformer';

export class UnidadEducativaDto {
  id?: string;

  @ApiProperty({ example: 80730628 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  codigoSie: number;

  @ApiProperty({ example: 'COLEGIO' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toUpperCase())
  nombre: string;

  @ApiProperty({ example: 'FISCAL', enum: tiposUnidadesEducativas })
  @IsEnum(tiposUnidadesEducativas)
  @IsNotEmpty()
  tipoUnidadEducativa: string;

  @ApiProperty({ example: 'RURAL', enum: tiposAreasGeograficas })
  @IsEnum(tiposAreasGeograficas)
  @IsNotEmpty()
  areaGeografica: string;

  @ApiProperty({ example: '4049f17f-9760-42c7-bee9-7afb3f0865ae' })
  @IsUUID()
  @IsNotEmpty()
  idDistrito: string;

  @ApiProperty({ example: '4049f17f-9760-42c7-bee9-7afb3f0865ae' })
  @IsUUID()
  @IsNotEmpty()
  idDepartamento: string;

  @ApiProperty({ example: 'sección' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toUpperCase())
  seccion: string;

  @ApiProperty({ example: 'localidad' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toUpperCase())
  localidad: string;

  estado?: string;
}

export class UnidadEducativaRespuestaDto {
  @ApiProperty({ example: 'd277ed90-d730-583b-bb24-aca999f2edcb' })
  id: string;

  @ApiProperty({ example: 80730628 })
  codigoSie: number;

  @ApiProperty({ example: 'COLEGIO' })
  nombre: string;

  @ApiProperty({ example: 'FISCAL' })
  tipoUnidadEducativa: string;

  @ApiProperty({ example: 'RURAL' })
  areaGeografica: string;

  @ApiProperty({ example: 'sección' })
  seccion: string;

  @ApiProperty({ example: 'localidad' })
  localidad: string;

  @ApiProperty({ example: 'ACTIVO' })
  estado: string;

  @ApiProperty()
  distrito: DistritoRespuestaDto;
}

export class UnidadEducativaRespuestaCortaDto {
  @ApiProperty({ example: 'd277ed90-d730-583b-bb24-aca999f2edcb' })
  id: string;

  @ApiProperty({ example: 80730628 })
  codigoSie: number;

  @ApiProperty({ example: 'COLEGIO' })
  nombre: string;
}
