import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from '../../../common/validation';
import { ApiProperty } from '@nestjs/swagger';
import { GradoEscolaridadResponseInscripcionDto } from '../dto/gradoEscolaridad.dto';
import { EtapaRespuestaCortaDto } from '../dto/etapa.dto';
import { AreaRespuestaCortaDto } from '../dto/area.dto';
import { GradoEscolaridadRespuestaCortaDto } from '../dto/gradoEscolaridad.dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { MedalleroPosicionDto } from './medalleroPosicion.dto';
import { MedalleroPosicionRuralDto } from './medalleroPosicionRural.dto';
import {
  MAX_NUMERO_PREGUNTAS,
  MAX_TIEMPO_PRUEBA,
  MIN_NUMERO_PREGUNTAS,
  MIN_TIEMPO_PRUEBA,
  TotalPuntaje,
} from '../../../common/constants';

export class EtapaAreaGradoDto {
  id?: string;

  @ApiProperty({ example: '20' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Max(MAX_NUMERO_PREGUNTAS)
  @Min(MIN_NUMERO_PREGUNTAS)
  totalPreguntas: string;

  @ApiProperty({ example: '12' })
  @IsString()
  @IsNotEmpty()
  preguntasCurricula: string;

  @ApiProperty({ example: '8' })
  @IsString()
  @IsNotEmpty()
  preguntasOlimpiada: string;

  @ApiProperty({ example: '60' })
  @IsString()
  puntosPreguntaCurricula: string;

  @ApiProperty({ example: '40' })
  @IsString()
  puntosPreguntaOlimpiada: string;

  @ApiProperty({ example: '60' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Max(MAX_TIEMPO_PRUEBA)
  @Min(MIN_TIEMPO_PRUEBA)
  duracionMinutos: string;

  @ApiProperty({ example: '5' })
  @IsString()
  preguntasCurriculaBaja: string;

  @ApiProperty({ example: '4' })
  @IsString()
  puntajeCurriculaBaja: string;

  @ApiProperty({ example: '5' })
  @IsString()
  preguntasCurriculaMedia: string;

  @ApiProperty({ example: '4' })
  @IsString()
  puntajeCurriculaMedia: string;

  @ApiProperty({ example: '2' })
  @IsString()
  preguntasCurriculaAlta: string;

  @ApiProperty({ example: '10' })
  @IsString()
  puntajeCurriculaAlta: string;

  @ApiProperty({ example: '3' })
  @IsString()
  preguntasOlimpiadaBaja: string;

  @ApiProperty({ example: '5' })
  @IsString()
  puntajeOlimpiadaBaja: string;

  @ApiProperty({ example: '3' })
  @IsString()
  preguntasOlimpiadaMedia: string;

  @ApiProperty({ example: '5' })
  @IsString()
  puntajeOlimpiadaMedia: string;

  @ApiProperty({ example: '2' })
  @IsString()
  preguntasOlimpiadaAlta: string;

  @ApiProperty({ example: '5' })
  @IsString()
  puntajeOlimpiadaAlta: string;

  estado?: string;

  @ApiProperty({ example: '411f6ebd-d5cf-407d-be7c-da85599cfcae' })
  @IsUUID()
  @IsNotEmpty()
  idEtapa: string;

  @ApiProperty({ example: 'e78379e3-5856-4a61-95d7-571cba583ec7' })
  @IsUUID()
  @IsNotEmpty()
  idArea: string;

  @ApiProperty({ example: '1e739ab5-025d-402d-9e1c-eaac6222d83f' })
  @IsUUID()
  @IsNotEmpty()
  idGradoEscolar: string;

  // medallero
  @ApiProperty({ example: 5 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  nroPosicionesTotal: string;

  @ApiProperty({ example: 51 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Max(TotalPuntaje)
  @Min(1)
  puntajeMinimoMedallero: string;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  nroPosicionesRural: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MedalleroPosicionDto)
  medalleroPosicion: Array<MedalleroPosicionDto>;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MedalleroPosicionRuralDto)
  medalleroPosicionRural: Array<MedalleroPosicionRuralDto>;

  // clasificacion
  @ApiProperty({ example: true })
  @IsNotEmpty()
  criterioCalificacion: boolean;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  criterioMedallero: boolean;

  @ApiProperty({ example: 51 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Max(TotalPuntaje)
  @Min(0)
  puntajeMinimoClasificacion: string;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cantidadMaximaClasificados: string;
}

export class EtapaAreaGradoRespuestaDto {
  @ApiProperty({ example: '208c8d47-594f-4207-b31a-b9a02b308148' })
  id: string;

  @ApiProperty({ example: '20' })
  totalPreguntas: string;

  @ApiProperty({ example: '12' })
  preguntasCurricula: string;

  @ApiProperty({ example: '8' })
  preguntasOlimpiada: string;

  @ApiProperty({ example: '60' })
  puntosPreguntaCurricula: string;

  @ApiProperty({ example: '40' })
  puntosPreguntaOlimpiada: string;

  @ApiProperty({ example: '60' })
  duracionMinutos: string;

  @ApiProperty({ example: '5' })
  preguntasCurriculaBaja: string;

  @ApiProperty({ example: '4' })
  puntajeCurriculaBaja: string;

  @ApiProperty({ example: '5' })
  preguntasCurriculaMedia: string;

  @ApiProperty({ example: '4' })
  puntajeCurriculaMedia: string;

  @ApiProperty({ example: '2' })
  preguntasCurriculaAlta: string;

  @ApiProperty({ example: '10' })
  puntajeCurriculaAlta: string;

  @ApiProperty({ example: '3' })
  preguntasOlimpiadaBaja: string;

  @ApiProperty({ example: '5' })
  puntajeOlimpiadaBaja: string;

  @ApiProperty({ example: '3' })
  preguntasOlimpiadaMedia: string;

  @ApiProperty({ example: '5' })
  puntajeOlimpiadaMedia: string;

  @ApiProperty({ example: '2' })
  preguntasOlimpiadaAlta: string;

  @ApiProperty({ example: '5' })
  puntajeOlimpiadaAlta: string;

  @ApiProperty({ example: '5' })
  nroPosicionesTotal: string;

  @ApiProperty({ example: '50' })
  puntajeMinimoClasificacion: string;

  @ApiProperty({ example: '#d9138a' })
  color: string;

  @ApiProperty({ example: 'ACTIVO' })
  estado: string;

  @ApiProperty()
  etapa: EtapaRespuestaCortaDto;

  @ApiProperty()
  area: AreaRespuestaCortaDto;

  @ApiProperty()
  gradoEscolaridad: GradoEscolaridadRespuestaCortaDto;
}

export class EtapaAreaGradoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @Type(() => GradoEscolaridadResponseInscripcionDto)
  gradoEscolaridad: GradoEscolaridadResponseInscripcionDto;
}

export class EtapaAreaGradoPorEtapaRespuestaDto {
  @ApiProperty({ example: '208c8d47-594f-4207-b31a-b9a02b308148' })
  id: string;

  @ApiProperty({ example: 'ACTIVO' })
  estado: string;

  @ApiProperty()
  etapa: EtapaRespuestaCortaDto;

  @ApiProperty()
  area: AreaRespuestaCortaDto;

  @ApiProperty()
  gradoEscolaridad: GradoEscolaridadRespuestaCortaDto;
}

export class EtapaAreaGradoCalendarioRespuestaDto {
  @ApiProperty({ example: '793e2227-770d-5692-8852-d9efdcc6a4d7' })
  id: string;

  @ApiProperty({ example: '#1e2761' })
  color: string;
}

export class EtapaAreaGradoMedalleroDto {
  @ApiProperty({ example: 5 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  nroPosicionesTotal: number;

  @ApiProperty({ example: 51 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  puntajeMinimoMedallero: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  nroPosicionesRural: number;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  criterioCalificacion: boolean;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  criterioMedallero: boolean;

  @ApiProperty({ example: 51 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  puntajeMinimoClasificacion: number;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cantidadMaximaClasificados: number;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MedalleroPosicionDto)
  medalleroPosicion: Array<MedalleroPosicionDto>;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MedalleroPosicionRuralDto)
  medalleroPosicionRural: Array<MedalleroPosicionRuralDto>;

  idEtapaAreaGrado?: string;
  estado?: string;
  usuarioAuditoria?: string;
}

export class EtapaAreaGradoMedalleroRespuestaDto {
  @ApiProperty({ example: '793e2227-770d-5692-8852-d9efdcc6a4d7' })
  id: string;

  @ApiProperty({ example: '5' })
  nroPosicionesTotal: string;

  @ApiProperty({ example: '5' })
  nroPosicionesRural: string;

  @ApiProperty({ example: '5' })
  puntajeMinimoMedallero: string;

  @ApiProperty({ example: true })
  criterioCalificacion: boolean;

  @ApiProperty({ example: true })
  criterioMedallero: boolean;

  @ApiProperty({ example: 51 })
  puntajeMinimoClasificacion: number;

  @ApiProperty({ example: 100 })
  cantidadMaximaClasificados: number;
}
