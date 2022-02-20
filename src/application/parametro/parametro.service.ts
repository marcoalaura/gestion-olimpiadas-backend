import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParametroRepository } from './parametro.repository';
import { Parametro } from './parametro.entity';
import { ParametroDto } from './dto/parametro.dto';
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';
import { totalRowsResponse } from '../../common/lib/http.module';

@Injectable()
export class ParametroService {
  constructor(
    @InjectRepository(ParametroRepository)
    private parametroRepositorio: ParametroRepository,
  ) {}

  async crear(parametroDto: ParametroDto): Promise<Parametro> {
    const result = await this.parametroRepositorio.crear(parametroDto);
    return result;
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.parametroRepositorio.listar(paginacionQueryDto);
    return totalRowsResponse(result);
  }

  async listarPorGrupo(grupo: string) {
    const result = await this.parametroRepositorio.listarPorGrupo(grupo);
    return result;
  }
}
