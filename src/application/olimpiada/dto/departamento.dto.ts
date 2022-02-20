import { ApiProperty } from '@nestjs/swagger';

export class DepartamentoDto {
  @ApiProperty({ example: '018bd25f-e215-4ef7-ab11-7c0ae97c58ab' })
  id: string;

  @ApiProperty({ example: 'La Paz' })
  nombre: string;
}
