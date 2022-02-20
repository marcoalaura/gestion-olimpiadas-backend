import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { AreaDto } from '../dto/area.dto';
import { Area } from '../entity/Area.entity';
import { GetJsonData } from '../../../common/lib/json.module';

@EntityRepository(Area)
export class AreaRepository extends Repository<Area> {
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const query = getRepository(Area)
      .createQueryBuilder('area')
      .select(['area.id', 'area.nombre', 'area.estado'])
      .orderBy('area.nombre', orden)
      .skip(saltar)
      .take(limite);

    if (parametros?.estado) {
      query.andWhere('area.estado = :estado', { estado: parametros.estado });
    }

    return query.getManyAndCount();
  }

  async listarBandeja(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const query = getRepository(Area)
      .createQueryBuilder('area')
      .select(['area.id', 'area.nombre', 'area.estado', 'area.logo'])
      .orderBy('area.nombre', orden)
      .skip(saltar)
      .take(limite);

    if (parametros?.estado) {
      query.andWhere('area.estado = :estado', { estado: parametros.estado });
    }

    return query.getManyAndCount();
  }

  async buscarPorId(id: string) {
    return getRepository(Area)
      .createQueryBuilder('area')
      .select(['area.id', 'area.nombre', 'area.estado'])
      .where('area.id = :id', { id })
      .getOne();
  }

  async contarPorNombre(nombre: string, id: string) {
    const query = getRepository(Area)
      .createQueryBuilder('area')
      .where('area.nombre = :nombre', { nombre });

    if (id) {
      query.andWhere('area.id <> :id', { id });
    }
    return query.getCount();
  }

  async crearActualizar(areaDto: AreaDto, usuarioAuditoria: string) {
    const { id, nombre, estado, logo } = areaDto;

    const area = new Area();
    area.nombre = nombre;
    area.estado = estado;
    area.logo = logo;

    if (id) {
      area.id = id;
      area.usuarioActualizacion = usuarioAuditoria;
    } else {
      area.usuarioCreacion = usuarioAuditoria;
    }

    return this.save(area);
  }

  async actualizarEstado(id: string, estado: string, usuarioAuditoria: string) {
    return getRepository(Area)
      .createQueryBuilder()
      .update(Area)
      .set({ estado, usuarioActualizacion: usuarioAuditoria })
      .where('id = :id', { id })
      .execute();
  }

  async eliminar(area: Area) {
    return this.remove(area);
  }
}
