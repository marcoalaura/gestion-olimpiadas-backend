import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsEnum,
  IsNumber,
  IsOptional,
} from '../../../common/validation';
import { ApiProperty } from '@nestjs/swagger';
import { OlimpiadaDto } from './olimpiada.dto';
import { tiposEtapa } from '../../../common/constants';

export class EtapaDto {
  id?: string;

  @ApiProperty({ example: 'PRIMERA ETAPA' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'DEPARTAMENTAL', enum: tiposEtapa })
  @IsEnum(tiposEtapa)
  @IsNotEmpty()
  tipo: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  jerarquia: number;

  @ApiProperty({ example: true })
  comiteDesempate: boolean;

  @ApiProperty()
  fechaInicio: Date;

  @ApiProperty()
  fechaFin: Date;

  @ApiProperty()
  fechaInicioImpugnacion: Date;

  @ApiProperty()
  fechaFinImpugnacion: Date;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  idOlimpiada: string;

  estado?: string;
}

export class EtapaRespuestaDto {
  @ApiProperty({ example: 'e7755011-4d49-45c0-a05a-566621da34bc' })
  id: string;

  @ApiProperty({ example: 'PRIMERA ETAPA' })
  nombre: string;

  @ApiProperty({ example: 'DEPARTAMENTAL' })
  tipo: string;

  @ApiProperty({ example: 1 })
  jerarquia: number;

  @ApiProperty({ example: true })
  comiteDesempate: boolean;

  @ApiProperty()
  fechaInicio: Date;

  @ApiProperty()
  fechaFin: Date;

  @ApiProperty()
  fechaInicioImpugnacion: Date;

  @ApiProperty()
  fechaFinImpugnacion: Date;

  @ApiProperty({ example: 'CREADO' })
  estado: string;

  @ApiProperty()
  olimpiada: OlimpiadaDto;
}

export class EtapaRespuestaCortaDto {
  @ApiProperty({ example: 'e7755011-4d49-45c0-a05a-566621da34bc' })
  id: string;

  @ApiProperty({ example: 'PRIMERA ETAPA' })
  nombre: string;
}
