import { Status } from '../../../common/constants';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { GetJsonData } from '../../../common/lib/json.module';
import {
  EntityRepository,
  getRepository,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { MedalleroPosicionRural } from '../entity/MedalleroPosicionRural.entity';

@EntityRepository(MedalleroPosicionRural)
export class MedalleroPosicionRuralRepository extends Repository<MedalleroPosicionRural> {
  async listarPorEtapaAreaGrado(
    idEtapaAreaGrado: string,
    paginacionQueryDto: PaginacionQueryDto,
  ) {
    const { limite, saltar, filtro, orden } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const query = getRepository(MedalleroPosicionRural)
      .createQueryBuilder('mp')
      .leftJoinAndSelect('mp.etapaAreaGrado', 'eag')
      .select([
        'mp.id',
        'mp.orden',
        'mp.posicionMaxima',
        'mp.posicionMinima',
        'mp.notaMinima',
        'mp.estado',
        'eag.id',
        'eag.nroPosicionesRural',
      ])
      .where('eag.id = :id', { id: idEtapaAreaGrado })
      .orderBy('mp.orden', orden)
      .skip(saltar)
      .take(limite);

    if (parametros?.estado) {
      query.andWhere('mp.estado = :estado', { estado: parametros.estado });
    }

    return query.getManyAndCount();
  }

  async listaPorEtapaAreaGradoPorOden(
    idEtapaAreaGrado: string,
    ordenGalardon: number,
    ordenMedalleroRural: number,
  ) {
    return await getRepository(MedalleroPosicionRural).findOne({
      select: ['posicionMaxima', 'posicionMinima', 'notaMinima'],
      where: {
        orden: ordenMedalleroRural,
        idEtapaAreaGrado: idEtapaAreaGrado,
        estado: Status.ACTIVE,
        posicionMaxima: LessThanOrEqual(ordenGalardon),
        posicionMinima: MoreThanOrEqual(ordenGalardon),
      },
    });
  }
}
