import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { TextService } from '../../../common/lib/text.service';
import { GetJsonData } from '../../../common/lib/json.module';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { GradoEscolaridadDto } from '../dto/gradoEscolaridad.dto';
import { GradoEscolaridad } from '../entity/GradoEscolaridad.entity';

@EntityRepository(GradoEscolaridad)
export class GradoEscolaridadRepository extends Repository<GradoEscolaridad> {
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const query = getRepository(GradoEscolaridad)
      .createQueryBuilder('gradoEscolaridad')
      .select([
        'gradoEscolaridad.id',
        'gradoEscolaridad.nombre',
        'gradoEscolaridad.orden',
        'gradoEscolaridad.estado',
      ])
      .orderBy('gradoEscolaridad.orden', orden)
      .skip(saltar)
      .take(limite);

    if (parametros?.nombre) {
      query.andWhere('gradoEscolaridad.nombre ilike :nombre', {
        nombre: `%${parametros.nombre}%`,
      });
    }
    if (parametros?.estado) {
      query.andWhere('gradoEscolaridad.estado = :estado', {
        estado: parametros.estado,
      });
    }
    return query.getManyAndCount();
  }

  async buscarPorId(id: string) {
    const queryBuilder = await this.createQueryBuilder('gradoEscolaridad')
      .select([
        'gradoEscolaridad.id',
        'gradoEscolaridad.nombre',
        'gradoEscolaridad.orden',
        'gradoEscolaridad.estado',
      ])
      .where('gradoEscolaridad.id = :id', { id })
      .getOne();
    return queryBuilder;
  }

  async contarPorNombre(nombre: string, id: string) {
    const query = getRepository(GradoEscolaridad)
      .createQueryBuilder('gradoEscolaridad')
      .where('gradoEscolaridad.nombre = :nombre', { nombre });

    if (id) {
      query.andWhere('gradoEscolaridad.id <> :id', { id });
    }
    return query.getCount();
  }

  async contarPorOrden(orden: number, id: string) {
    const query = getRepository(GradoEscolaridad)
      .createQueryBuilder('gradoEscolaridad')
      .where('gradoEscolaridad.orden = :orden', { orden });

    if (id) {
      query.andWhere('gradoEscolaridad.id <> :id', { id });
    }
    return query.getCount();
  }

  async crearActualizar(
    gradoEscolaridadDto: GradoEscolaridadDto,
    usuarioAuditoria: string,
  ) {
    const { id, nombre, orden, estado } = gradoEscolaridadDto;

    const gradoEscolaridad = new GradoEscolaridad();
    gradoEscolaridad.id = id ? id : TextService.generateUuid();
    gradoEscolaridad.nombre = nombre;
    gradoEscolaridad.orden = orden;
    gradoEscolaridad.estado = estado;
    if (id) {
      gradoEscolaridad.usuarioActualizacion = usuarioAuditoria;
    } else {
      gradoEscolaridad.usuarioCreacion = usuarioAuditoria;
    }

    await this.save(gradoEscolaridad);
    return gradoEscolaridad;
  }

  async actualizarEstado(id: string, estado: string, usuarioAuditoria: string) {
    return getRepository(GradoEscolaridad)
      .createQueryBuilder()
      .update(GradoEscolaridad)
      .set({ estado, usuarioActualizacion: usuarioAuditoria })
      .where('id = :id', { id })
      .execute();
  }

  async eliminar(gradoEscolaridad: GradoEscolaridad) {
    return this.remove(gradoEscolaridad);
  }
}
