import { Transform } from 'class-transformer';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';

export class FiltrosUsuarioDto extends PaginacionQueryDto {
  @Transform(({ value }) => (value ? value.split(',') : null))
  readonly rol?: string;
  @Transform(({ value }) => (value ? value.split(',') : null))
  readonly grupo?: string;
  @Transform(({ value }) => (value ? value.split(',') : null))
  readonly olimpiada?: string;
}
