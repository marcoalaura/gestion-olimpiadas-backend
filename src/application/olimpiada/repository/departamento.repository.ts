import { EntityRepository, getRepository, Repository } from 'typeorm';
import { Departamento } from '../entity/Departamento.entity';

@EntityRepository(Departamento)
export class DepartamentoRepository extends Repository<Departamento> {
  async listar() {
    return getRepository(Departamento)
      .createQueryBuilder('d')
      .select(['d.id', 'd.nombre', 'd.codigo'])
      .getMany();
  }

  async buscarPorId(id: string) {
    return getRepository(Departamento)
      .createQueryBuilder('d')
      .select(['d.id', 'd.nombre', 'd.codigo'])
      .where('d.id = :id', { id })
      .getOne();
  }
}
