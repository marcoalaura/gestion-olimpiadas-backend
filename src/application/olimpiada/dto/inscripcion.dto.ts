import { IsNotEmpty, IsUUID, Matches } from '../../../common/validation';
import { ApiProperty } from '@nestjs/swagger';
import { EtapaAreaGradoResponseDto } from '../dto/etapaAreaGrado.dto';
import {
  EstudianteCreacionDto,
  EstudianteResponseDto,
} from '../dto/estudiante.dto';
import { Type } from 'class-transformer';
import { UnidadEducativaRespuestaCortaDto } from './unidadEducativa.dto';
import { ValidateNested } from 'class-validator';

export class InscripcionRepuestaDto {
  id?: string;

  @ApiProperty({ example: '8073060' })
  @IsNotEmpty()
  idImportacion: string;
}

export class InscripcionListadoRepuestaDto {
  @ApiProperty({ example: '19eacbcc-3519-45ce-9de7-1ac2eee0aab7' })
  id?: string;

  @ApiProperty({ example: '8073060' })
  @IsNotEmpty()
  idImportacion: string;

  @ApiProperty()
  @Type(() => EtapaAreaGradoResponseDto)
  etapaAreaGrado: EtapaAreaGradoResponseDto;

  @ApiProperty()
  @Type(() => EstudianteResponseDto)
  estudiante: EstudianteResponseDto;

  @ApiProperty()
  @Type(() => UnidadEducativaRespuestaCortaDto)
  unidadEducativa: UnidadEducativaRespuestaCortaDto;

  @ApiProperty({ example: 'ACTIVO' })
  estado?: string;
}

export class InscripcionCreacionDto {
  @ApiProperty({ example: '123456789' })
  @IsNotEmpty()
  @Matches(/^[0-9]\d*$/, {
    message: 'id importación no es un número válido.',
  })
  idImportacion: string;

  /*
  @ApiProperty({ example: '19eacbcc-3519-45ce-9de7-1ac2eee0aab7' })
  idEtapa: string;

  @ApiProperty({ example: '30eacbcc-3519-45ce-9de7-1ac2eee0aab9' })
  idArea: string;

  @ApiProperty({ example: '78eacbcc-3519-45ce-9de7-1ac2eee0aab0' })
  idGrado: string;
  */

  @ApiProperty({ example: '78eacbcc-3519-45ce-9de7-1ac2eee0aab0' })
  @IsNotEmpty()
  idUnidadEducativa: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => EstudianteCreacionDto)
  estudiante: EstudianteCreacionDto;

  @ApiProperty({ example: '19eacbcc-3519-45ce-9de7-1ac2eee0aab7' })
  @IsNotEmpty()
  idEtapaAreaGrado: string;
}

export class InscripcionDeleteDto {
  @ApiProperty({ example: '19eacbcc-3519-45ce-9de7-1ac2eee0aab7' })
  id?: string;

  @IsNotEmpty()
  idImportacion: string;
}

export class InscripcionImportarDto {
  @ApiProperty({
    description: 'Archivo ods',
    format: 'binary',
    required: true,
  })
  archivo: string;

  @ApiProperty({
    example: '19eacbcc-3519-45ce-9de7-1ac2eee0aab7',
    description: 'Identificador de etapa, área y grado de escolaridad',
  })
  @IsNotEmpty()
  @IsUUID()
  idEtapaAreaGrado: string;
}

export class InscripcionImportarResDto {
  @ApiProperty({
    example: 'ejemplo.ods',
    description: 'Nombre del archivo',
  })
  nombreArchivo: string;
}
