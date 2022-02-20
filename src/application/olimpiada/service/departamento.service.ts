import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { totalRowsResponse } from 'src/common/lib/http.module';
import { DepartamentoRepository } from '../repository/departamento.repository';
import { LocalidadRepository } from '../repository/localidad.repository';
import { SeccionRepository } from '../repository/seccion.repository';

@Injectable()
export class DepartamentoService {
  constructor(
    @InjectRepository(DepartamentoRepository)
    private departamentoRepositorio: DepartamentoRepository,
    @InjectRepository(SeccionRepository)
    private seccionRepositorio: SeccionRepository,
    @InjectRepository(LocalidadRepository)
    private localidadRepositorio: LocalidadRepository,
  ) {}

  async listar() {
    const result = await this.departamentoRepositorio.listar();
    return result;
  }

  async listarSecciones(paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.seccionRepositorio.listar(paginacionQueryDto);
    return totalRowsResponse(result);
  }

  async listarLocalidades(paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.localidadRepositorio.listar(paginacionQueryDto);
    return totalRowsResponse(result);
  }
}
