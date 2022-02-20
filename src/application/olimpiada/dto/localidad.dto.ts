import { ApiProperty } from '@nestjs/swagger';

export class LocalidadDto {
  @ApiProperty({ example: '795f761d-2764-408e-94ea-7d5020bc30ac' })
  id: string;

  @ApiProperty({ example: 'LOCALIDAD' })
  nombre: string;
}
