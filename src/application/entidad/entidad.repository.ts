import { EntityRepository, Repository } from 'typeorm';
import { Entidad } from './entidad.entity';

@EntityRepository(Entidad)
export class EntidadRepository extends Repository<Entidad> {}
