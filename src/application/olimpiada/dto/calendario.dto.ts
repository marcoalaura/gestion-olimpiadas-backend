import { IsEnum, IsNotEmpty, IsOptional } from '../../../common/validation';
import { ApiProperty } from '@nestjs/swagger';
import { TipoPrueba, TipoPlanificacion } from '../../../common/constants';
import { EtapaAreaGradoCalendarioRespuestaDto } from './etapaAreaGrado.dto';

export class CalendarioCrearDto {
  @ApiProperty({ example: 'ONLINE' })
  @IsEnum(TipoPrueba)
  tipoPrueba: string;

  @ApiProperty({ example: 'CRONOGRAMA' })
  @IsEnum(TipoPlanificacion)
  tipoPlanificacion: string;

  @ApiProperty({ example: '2021-05-11 08:00:00' })
  @IsNotEmpty()
  fechaHoraInicio: Date;

  @ApiProperty({ example: '2021-05-11 20:00:00' })
  @IsNotEmpty()
  fechaHoraFin: Date;
}

export class CalendarioActualizarDto {
  @ApiProperty({ example: 'ONLINE' })
  @IsOptional()
  @IsEnum(TipoPrueba)
  tipoPrueba: string;

  @ApiProperty({ example: '2021-05-11 08:00:00' })
  @IsOptional()
  fechaHoraInicio: Date;

  @ApiProperty({ example: '2021-05-11 20:00:00' })
  @IsOptional()
  fechaHoraFin: Date;
}

export class CalendarioIdRespuestaDto {
  @ApiProperty({ example: 'f0396cb0-abe2-49fb-8095-ab2b8d109613' })
  id: string;
}

export class CalendarioListaRespuetaDto {
  @ApiProperty({ example: '7eba1568-ffc6-49e8-9926-dbd0ef1346c4' })
  id: string;

  @ApiProperty({ example: 'ONLINE' })
  tipoPrueba: string;

  @ApiProperty({ example: 1618502400000 })
  fechaHoraInicio: number;

  @ApiProperty({ example: 1618507800000 })
  @IsOptional()
  fechaHoraFin: number;

  @ApiProperty()
  etapaAreaGrado: EtapaAreaGradoCalendarioRespuestaDto;
}
