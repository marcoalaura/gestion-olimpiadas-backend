import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UnidadEducativa } from './UnidadEducativa.entity';
import { Departamento } from './Departamento.entity';
import { AbstractEntity } from '../../../common/dto/abstract-entity.dto';
import { Status } from '../../../common/constants';

const enumStatus = [Status.ACTIVE, Status.INACTIVE];

@Index('distrito_pkey', ['id'], { unique: true })
@Entity('distrito', { schema: 'public' })
export class Distrito extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'nombre', nullable: false, length: 500 })
  nombre: string | null;

  @Column('integer', { name: 'codigo', nullable: false, unique: true })
  codigo: number | null;

  @Column({ type: 'enum', enum: enumStatus, default: Status.ACTIVE })
  estado: string;

  @ManyToOne(() => Departamento, (departamento) => departamento.distritos, {
    nullable: false,
  })
  @JoinColumn([{ name: 'id_departamento', referencedColumnName: 'id' }])
  departamento: Departamento;

  @OneToMany(
    () => UnidadEducativa,
    (unidadEducativa) => unidadEducativa.distrito,
  )
  unidadEducativas: UnidadEducativa[];

  @OneToMany(() => Distrito, (distrito) => distrito)
  usuarioDistrito: Distrito[];
}
