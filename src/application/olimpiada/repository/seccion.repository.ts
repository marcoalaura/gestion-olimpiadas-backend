import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Seccion } from '../entity/Seccion.entity';
import { GetJsonData } from '../../../common/lib/json.module';

@EntityRepository(Seccion)
export class SeccionRepository extends Repository<Seccion> {
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const query = getRepository(Seccion)
      .createQueryBuilder('se')
      .select(['se.id', 'se.nombre'])
      .orderBy('se.nombre', orden)
      .skip(saltar)
      .take(limite);

    if (parametros?.nombre) {
      query.andWhere('se.nombre ilike :nombre', {
        nombre: `%${parametros.nombre}%`,
      });
    }

    return query.getManyAndCount();
  }
}
