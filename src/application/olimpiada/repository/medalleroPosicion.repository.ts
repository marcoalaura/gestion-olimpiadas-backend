import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { MedalleroPosicion } from '../entity/MedalleroPosicion.entity';
import { GetJsonData } from '../../../common/lib/json.module';
import { Order, Status } from '../../../common/constants';

@EntityRepository(MedalleroPosicion)
export class MedalleroPosicionRepository extends Repository<MedalleroPosicion> {
  async listarPorEtapaAreaGrado(
    idEtapaAreaGrado: string,
    paginacionQueryDto: PaginacionQueryDto,
  ) {
    const { limite, saltar, filtro, orden } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const query = getRepository(MedalleroPosicion)
      .createQueryBuilder('mp')
      .leftJoinAndSelect('mp.etapaAreaGrado', 'eag')
      .select([
        'mp.id',
        'mp.ordenGalardon',
        'mp.denominativo',
        'mp.estado',
        'eag.id',
        'eag.nroPosicionesTotal',
      ])
      .where('eag.id = :id', { id: idEtapaAreaGrado })
      .orderBy('mp.ordenGalardon', orden)
      .skip(saltar)
      .take(limite);

    if (parametros?.estado) {
      query.andWhere('mp.estado = :estado', { estado: parametros.estado });
    }
    if (parametros?.denominativo) {
      query.andWhere('mp.denominativo ilike :denominativo', {
        denominativo: `%${parametros.denominativo}%`,
      });
    }

    return query.getManyAndCount();
  }

  contarConfiguracionPorEtapa(idEtapa: string) {
    return getRepository(MedalleroPosicion)
      .createQueryBuilder('medalleroPosicion')
      .innerJoinAndSelect('medalleroPosicion.etapaAreaGrado', 'etapaAreaGrado')
      .innerJoinAndSelect('etapaAreaGrado.etapa', 'etapa')
      .where('etapa.id = :id', { id: idEtapa })
      .andWhere('medalleroPosicion.estado = :estado', { estado: Status.ACTIVE })
      .getCount();
  }

  async listaPorEtapaAreaGrado(idEtapaAreaGrado: string) {
    return await getRepository(MedalleroPosicion).find({
      select: ['id', 'ordenGalardon'],
      where: { idEtapaAreaGrado: idEtapaAreaGrado, estado: Status.ACTIVE },
      order: { ordenGalardon: Order.ASC },
    });
  }
}
