import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ParamUuidDto {
  @ApiProperty({
    description: 'Identificador único',
    example: '19eacbcc-3519-45ce-9de7-1ac2eee0aab7',
    type: String,
  })
  @IsUUID('all', {
    message: 'id debe tener el formato UUID',
  })
  id: string;
}
