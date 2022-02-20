import { Status } from 'src/common/constants';
import { AbstractEntity } from 'src/common/dto/abstract-entity.dto';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
const enumStatus = [Status.ACTIVE, Status.INACTIVE];

@Index('seccion_pkey', ['id'], { unique: true })
@Entity('seccion', { schema: 'public' })
export class Seccion extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'nombre', nullable: false })
  nombre: string | null;

  @Column({ type: 'enum', enum: enumStatus, default: Status.ACTIVE })
  estado: string;
}
