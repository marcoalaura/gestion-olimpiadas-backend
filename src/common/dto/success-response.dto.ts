import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty()
  @IsOptional()
  finalizado: boolean;

  @ApiProperty({
    example: 'Datos obtenidos correctamente',
  })
  @IsOptional()
  mensaje: string;

  @ApiProperty()
  @IsOptional()
  datos: any;
}
