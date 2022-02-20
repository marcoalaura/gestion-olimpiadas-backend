import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntidadRepository } from './entidad.repository';
import { Entidad } from './entidad.entity';
import { EntidadDto } from './dto/entidad.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TotalRowsResponseDto } from 'src/common/dto/total-rows-response.dto';
import { totalRowsResponse } from '../../common/lib/http.module';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';

@Injectable()
export class EntidadService {
  constructor(
    @InjectRepository(EntidadRepository)
    private entidadRepositorio: EntidadRepository,
  ) {}

  async recuperar(
    @Query() paginacionQueryDto: PaginacionQueryDto,
  ): Promise<TotalRowsResponseDto> {
    const { limite, pagina } = paginacionQueryDto;
    const resultado = await this.entidadRepositorio.findAndCount({
      skip: pagina || 0,
      take: limite || 10,
    });
    return totalRowsResponse(resultado);
  }

  async guardar(entidadDto: EntidadDto): Promise<Entidad> {
    const entidad = this.entidadRepositorio.create(entidadDto);
    return this.entidadRepositorio.save(entidad);
  }

  // update method
  async update(id: string, entidadDto: EntidadDto) {
    const entidad = await this.entidadRepositorio.preload({
      id: +id,
      ...entidadDto,
    });
    if (!entidad) {
      throw new NotFoundException(`Entidad con id ${id} no encontrado`);
    }
    return this.entidadRepositorio.save(entidad);
  }

  // delete method
  async remove(id: string) {
    const entidad = await this.entidadRepositorio.findOne(id);
    if (!entidad) {
      throw new NotFoundException(`Entidad con id ${id} no encontrado`);
    }
    return this.entidadRepositorio.remove(entidad);
  }
}
