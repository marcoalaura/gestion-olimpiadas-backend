import { ApiProperty } from '@nestjs/swagger';

export class SeccionDto {
  @ApiProperty({ example: '795f761d-2764-408e-94ea-7d5020bc30ac' })
  id: string;

  @ApiProperty({ example: 'PRIMERA SECCIÓN' })
  nombre: string;
}
