import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolRepository } from '../../../core/authorization/repository/rol.repository';
import { Rol } from '../../../core/authorization/entity/rol.entity';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
@Injectable()
export class RolService {
  constructor(
    @InjectRepository(RolRepository)
    private rolRepositorio: RolRepository,
  ) {}

  async listar(paginacionQueryDto: PaginacionQueryDto): Promise<Rol[]> {
    const result = await this.rolRepositorio.listar(paginacionQueryDto);
    return result;
  }

  async obtenerRolPorNombre(rol: string): Promise<Rol> {
    return this.rolRepositorio.obtenerRolPorNombre(rol);
  }
}
