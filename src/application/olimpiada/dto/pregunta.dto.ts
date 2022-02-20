import {
  IsEnum,
  IsNotEmpty,
  IsArray,
  IsObject,
  IsOptional,
  IsString,
} from '../../../common/validation';
import { ApiProperty } from '@nestjs/swagger';
import {
  TipoPregunta,
  TipoRespuesta,
  NivelDificultad,
} from '../../../common/constants';

export class PreguntaDto {
  @ApiProperty({ example: 'OLIMPIADA' })
  @IsEnum(TipoPregunta)
  tipoPregunta: string;

  @ApiProperty({ example: 'SELECCCION_MULTIPLE' })
  @IsEnum(TipoRespuesta)
  tipoRespuesta: string;

  @ApiProperty({ example: 'MEDIA' })
  @IsEnum(NivelDificultad)
  nivelDificultad: string;

  @ApiProperty({
    example:
      'Un bloque de madera flota primeramente en agua y luego en un líquido de densidad relativa 0.6 (respecto al agua). La relación entre el volumen sumergido en el líquido al sumergido en el aguatiene un valor de:',
  })
  @IsOptional()
  textoPregunta: string;

  @ApiProperty({ example: 'https://i.ibb.co/5rDFxv4/velocidad-mru.jpg' })
  @IsOptional()
  @IsString()
  imagenPregunta: string;

  @ApiProperty({
    example: {
      a: '3/5',
      b: '5/3',
      c: '1.6',
      d: 'Ninguna respuesta anterior es correcta.',
    },
  })
  @IsOptional()
  @IsObject()
  opciones: any;

  @ApiProperty({ example: ['b'] })
  @IsArray()
  respuestas: string[];
}

export class PreguntaRespuestaDto {
  @ApiProperty({ example: 'f0396cb0-abe2-49fb-8095-ab2b8d109613' })
  id: string;
}

export class PreguntaEstadoDto {
  @ApiProperty({ example: 'ENVIAR' })
  @IsNotEmpty()
  operacion: string;
}
