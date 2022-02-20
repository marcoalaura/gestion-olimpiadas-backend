import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Localidad } from '../entity/Localidad.entity';
import { GetJsonData } from '../../../common/lib/json.module';

@EntityRepository(Localidad)
export class LocalidadRepository extends Repository<Localidad> {
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const query = getRepository(Localidad)
      .createQueryBuilder('lo')
      .select(['lo.id', 'lo.nombre'])
      .orderBy('lo.nombre', orden)
      .skip(saltar)
      .take(limite);

    if (parametros?.nombre) {
      query.andWhere('lo.nombre ilike :nombre', {
        nombre: `%${parametros.nombre}%`,
      });
    }

    return query.getManyAndCount();
  }
}
