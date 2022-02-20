import {
  CorreoLista,
  IsEmail,
  IsNotEmpty,
  IsString,
  NombreApellido,
  NroDocumento,
} from '../../../common/validation';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class EstudianteExamenDetalle {
  id?: string;

  @ApiProperty({ example: '["a", "b", "c"]' })
  @IsNotEmpty()
  respuestas: any;
}

export class EstudianteExamenDto {
  @ApiProperty({ example: '9fbba8ae-d856-42bd-a7b5-fd91f715db3b' })
  @IsNotEmpty()
  idExamen: string;

  @ApiProperty({ example: 'ACTIVO' })
  @IsNotEmpty()
  estado: string;

  @ApiProperty({ example: 1618401600000 })
  @IsNotEmpty()
  calendarioFechaHoraInicio: number;

  @ApiProperty({ example: 1618405200000 })
  @IsNotEmpty()
  calendarioFechaHoraFin: number;

  @ApiProperty({ example: 'Matemáticas' })
  @IsNotEmpty()
  areaNombre: string;

  @ApiProperty({ example: 'Uno' })
  @IsNotEmpty()
  etapaNombre?: string;
}

export class EstudiantePersonaDto {
  @ApiProperty({ example: 'JUANCITO' })
  @IsNotEmpty()
  @NombreApellido()
  @Transform(({ value }) => value?.toUpperCase())
  nombres: string;

  @ApiProperty({ example: 'PINTO' })
  @IsString()
  @ValidateIf((o) => !o.segundoApellido)
  @NombreApellido()
  @Transform(({ value }) => value?.toUpperCase())
  primerApellido: string;

  @ApiProperty({ example: 'ESCOBAR' })
  @ValidateIf((o) => !o.primerApellido)
  @NombreApellido()
  @Transform(({ value }) => value?.toUpperCase())
  segundoApellido: string;

  @ApiProperty({ example: 'CI' })
  // @IsNotEmpty()
  tipoDocumento: string;

  @ApiProperty({ example: '7894545' })
  @IsNotEmpty()
  @NroDocumento()
  @Transform(({ value }) => value?.trim())
  nroDocumento: string;

  @ApiProperty({ example: '2020-01-01' })
  @IsString()
  @IsNotEmpty()
  fechaNacimiento: string;

  @ApiProperty({ example: 'M' })
  @IsNotEmpty()
  genero: string;

  @ApiProperty({ example: '78458798' })
  @IsOptional()
  @ValidateIf((o) => o.telefono != null)
  @Matches(/^[6-7]{1}[0-9]{7}$/, {
    message: 'telefono no es un número de celular válido',
  })
  telefono: string;

  @ApiProperty({ example: 'correo@correo.com' })
  @ValidateIf((o) => o.correoElectronico)
  @IsEmail()
  @CorreoLista()
  @IsOptional()
  correoElectronico: string;

  // @ApiProperty({ example: 'ACTIVO' })
  // @IsNotEmpty()
  // estado: string;
}

export class EstudianteDto {
  @ApiProperty({ example: '19eacbcc-3519-45ce-9de7-1ac2eee0aab7' })
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'RUDE0001' })
  @IsNotEmpty()
  rude: string;

  @ApiProperty()
  persona: EstudiantePersonaDto;

  usuarioCreacion?: string;
  usuarioActualizacion?: string;
}

export class EstudianteCreacionDto {
  @ApiProperty({ example: '86768762058118' })
  @IsNotEmpty()
  @Transform(({ value }) => value?.toUpperCase())
  @Transform(({ value }) => value?.trim())
  rude: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => EstudiantePersonaDto)
  persona: EstudiantePersonaDto;
}

export class EstudianteResponseDto {
  @ApiProperty({ example: '19eacbcc-3519-45ce-9de7-1ac2eee0aab7' })
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'RUDE0001' })
  @IsNotEmpty()
  rude: string;

  @ApiProperty()
  persona: EstudiantePersonaDto;
}

export class PruebaOfflineCreacionDto {
  @ApiProperty({ example: 'bbe59dbc-37da-4fa9-b609-bc21b353cff' })
  idEstudianteExamenDetalle: string;

  @ApiProperty({ example: 'bbe59dbc-37da-4fa9-b609-bc21b353cff' })
  idEstudianteExamen: string;

  @ApiProperty({ example: 'bbe59dbc-37da-4fa9-b609-bc21b353cff' })
  idPregunta: string;

  @ApiProperty({ example: 'RUDE0001' })
  rude: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Archivo binario de respuestas encriptadas',
  })
  archivo: string;

  fechaRespuesta: string;
}

export class PruebaOfflineDto {
  @ApiProperty({ example: '5765' })
  sie: string;

  @ApiProperty({ example: '65765766' })
  nroDoc: string;

  @ApiProperty({ example: 'CARLA PERES PERES' })
  nombres: string;

  @ApiProperty({ example: '7656756765765' })
  rude: string;

  @ApiProperty({ example: 'MATEMATICAS' })
  area: string;

  @ApiProperty({ example: 'SEGUNDO SECUNDARIA' })
  grado: string;

  @ApiProperty({ example: '02/05/2021' })
  fecha: string;

  @ApiProperty({ example: 'CARGADO' })
  estado: string;
}
