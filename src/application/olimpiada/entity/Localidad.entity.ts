import { Status } from 'src/common/constants';
import { AbstractEntity } from 'src/common/dto/abstract-entity.dto';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
const enumStatus = [Status.ACTIVE, Status.INACTIVE];

@Index('localidad_pkey', ['id'], { unique: true })
@Entity('localidad', { schema: 'public' })
export class Localidad extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'nombre', nullable: false })
  nombre: string | null;

  @Column({ type: 'enum', enum: enumStatus, default: Status.ACTIVE })
  estado: string;
}
