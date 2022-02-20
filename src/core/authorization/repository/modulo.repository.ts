import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Modulo } from '../entity/modulo.entity';
import { CasbinRule } from '../entity/casbin.entity';
import { CrearModuloDto, PropiedadesDto } from '../dto/crear-modulo.dto';
@EntityRepository(Modulo)
export class ModuloRepository extends Repository<Modulo> {
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar } = paginacionQueryDto;
    const queryBuilder = await this.createQueryBuilder('modulo')
      .skip(saltar)
      .take(limite)
      .getManyAndCount();
    return queryBuilder;
  }

  async listarTodo() {
    const queryBuilder = await this.createQueryBuilder('modulo').getMany();
    return queryBuilder;
  }

  obtenerModulosSubmodulos() {
    return this.createQueryBuilder('modulo')
      .leftJoinAndSelect('modulo.subModulo', 'subModulo')
      .where('modulo.fid_modulo is NULL')
      .getMany();
  }

  async crear(moduloDto: CrearModuloDto) {
    const propiedades = new PropiedadesDto();
    propiedades.icono = moduloDto.propiedades.icono;
    propiedades.color_dark = moduloDto.propiedades.color_dark;
    propiedades.color_light = moduloDto.propiedades.color_light;

    const modulo = new Modulo();
    modulo.label = moduloDto.label;
    modulo.url = moduloDto.url;
    modulo.nombre = moduloDto.nombre;
    modulo.propiedades = propiedades;

    return this.save(modulo);
  }

  async listarPoliticas(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar } = paginacionQueryDto;
    return getRepository(CasbinRule)
      .createQueryBuilder('c')
      .select(['c.id', 'c.v0', 'c.v1', 'c.v2', 'c.v3', 'c.v4', 'c.v5'])
      .skip(saltar)
      .take(limite)
      .getManyAndCount();
  }
}
