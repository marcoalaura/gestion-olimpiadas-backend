import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginEstudianteDto {
  @ApiProperty({
    description: 'Nro. documento de identidad',
    example: 'Nzg5NDU0NQ',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly usuario: string;

  @ApiProperty({
    description: 'Registro único de estudiante',
    example: 'UlVERTAwMDE',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  readonly rude: string;

  constructor(datos) {
    this.usuario = datos.usuario
      ? Buffer.from(datos.usuario, 'base64').toString('utf8')
      : '';
    this.rude = datos.rude
      ? Buffer.from(datos.rude, 'base64').toString('utf8')
      : '';
  }
}

export class LoginEstudianteResp {
  @ApiProperty({
    example: true,
    description: 'Estado de respuesta',
  })
  finalizado: boolean;

  @ApiProperty({
    example: 'Sessión iniciada correctamente',
    description: 'Mensaje de respuesta',
  })
  mensaje: string;

  @ApiProperty({
    example: {
      access_token: 'eyJhbGciOiJIUzI1Ni...',
      id: '19eacbcc-3519-45ce',
      rude: 'RUDE0001',
      persona: {
        nroDocumento: '1234567',
        nombres: 'JUAN',
        primerApellido: 'PEREZ',
        segundoApellido: null,
      },
    },
    description: 'Datos de la respuesta',
  })
  datos: Record<string, unknown>;
}
