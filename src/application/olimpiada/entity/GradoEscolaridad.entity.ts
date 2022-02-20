import { AbstractEntity } from '../../../common/dto/abstract-entity.dto';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { EtapaAreaGrado } from './EtapaAreaGrado.entity';
import { Status } from '../../../common/constants';
const enumStatus = [Status.ACTIVE, Status.INACTIVE];

@Index('grado_escolaridad_pkey', ['id'], { unique: true })
@Entity('grado_escolaridad', { schema: 'public' })
export class GradoEscolaridad extends AbstractEntity {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('character varying', { name: 'nombre', nullable: true, length: 255 })
  nombre: string | null;

  @Column('integer', { name: 'orden', nullable: true })
  orden: number | null;

  @Column({ type: 'enum', enum: enumStatus, default: Status.ACTIVE })
  estado: string;

  @OneToMany(
    () => EtapaAreaGrado,
    (etapaAreaGrado) => etapaAreaGrado.gradoEscolar,
  )
  etapaAreaGrados: EtapaAreaGrado[];
}
