import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Persona } from '../../persona/persona.entity';
import { Inscripcion } from './Inscripcion.entity';
import { AbstractEntity } from '../../../common/dto/abstract-entity.dto';
import { Status } from '../../../common/constants';

const enumStatus = [Status.ACTIVE, Status.INACTIVE];

@Index('estudiante_pkey', ['id'], { unique: true })
@Entity('estudiante', { schema: 'public' })
export class Estudiante extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', {
    name: 'rude',
    nullable: true,
    length: 255,
    unique: true,
  })
  rude: string | null;

  @Column({
    type: 'enum',
    enum: enumStatus,
    default: Status.ACTIVE,
  })
  estado: string;

  @ManyToOne(() => Persona, (persona) => persona.estudiantes, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn([{ name: 'id_persona', referencedColumnName: 'id' }])
  persona: Persona;

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.estudiante)
  inscripcions: Inscripcion[];
}
