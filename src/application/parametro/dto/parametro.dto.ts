import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParametroDto {
  id: number;
  @ApiProperty()
  @IsNotEmpty()
  codigo: string;
  @ApiProperty()
  @IsNotEmpty()
  nombre: string;
  @ApiProperty()
  @IsNotEmpty()
  grupo: string;
  @ApiProperty()
  @IsNotEmpty()
  descripcion: string;
}
