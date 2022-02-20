import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Rol } from '../entity/rol.entity';
import { Status } from '../../../common/constants';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { GetJsonData } from '../../../common/lib/json.module';

@EntityRepository(Rol)
export class RolRepository extends Repository<Rol> {
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { filtro } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const queryBuilder = await this.createQueryBuilder('rol')
      .select(['rol.id', 'rol.rol', 'rol.nombre', 'rol.grupo', 'rol.campos'])
      .where({ estado: Status.ACTIVE });

    if (parametros?.grupo) {
      queryBuilder.andWhere('rol.grupo = :grupo', { grupo: parametros.grupo });
    }
    if (parametros?.permisoCrear) {
      queryBuilder.andWhere('rol.permisoCrear = :permisoCrear', {
        permisoCrear: parametros.permisoCrear,
      });
    }
    return queryBuilder.getMany();
  }

  async listarRoles() {
    const queryBuilder = await this.createQueryBuilder('rol')
      .select(['rol.id', 'rol.rol', 'rol.nombre', 'rol.grupo', 'rol.campos'])
      .where({ estado: Status.ACTIVE });
    return queryBuilder.getMany();
  }

  async buscarPorId(id: string) {
    return getRepository(Rol)
      .createQueryBuilder('rol')
      .select([
        'rol.id',
        'rol.rol',
        'rol.nombre',
        'rol.grupo',
        'rol.campos',
        'rol.estado',
      ])
      .where('rol.id = :id', { id })
      .getOne();
  }

  obtenerRolPorNombre(rol: string) {
    return getRepository(Rol)
      .createQueryBuilder('rol')
      .select(['rol.id', 'rol.rol', 'rol.grupo', 'rol.campos'])
      .where('rol.rol = :rol and rol.estado = :estado', {
        rol,
        estado: Status.ACTIVE,
      })
      .getOne();
  }
}
