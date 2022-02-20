import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Status } from '../../../common/constants';
import { AbstractEntity } from '../../../common/dto/abstract-entity.dto';
import { EtapaAreaGrado } from './EtapaAreaGrado.entity';

const enumStatus = [Status.ACTIVE, Status.INACTIVE];

@Index('area_pkey', ['id'], { unique: true })
@Entity('area', { schema: 'public' })
export class Area extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'nombre', nullable: true, length: 255 })
  nombre: string | null;

  @Column({ type: 'enum', enum: enumStatus, default: Status.ACTIVE })
  estado: string;

  @Column({
    type: 'text',
    name: 'logo',
    nullable: false,
  })
  logo: string;

  @OneToMany(() => EtapaAreaGrado, (etapaAreaGrado) => etapaAreaGrado.area)
  etapaAreaGrados: EtapaAreaGrado[];

  @OneToMany(() => Area, (area) => area)
  usuarioArea: Area[];
}
