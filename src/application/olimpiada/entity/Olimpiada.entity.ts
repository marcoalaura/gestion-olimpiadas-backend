import { AbstractEntity } from '../../../common/dto/abstract-entity.dto';
import { Status } from '../../../common/constants';

import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Etapa } from './Etapa.entity';
import { UsuarioRol } from '../../../core/authorization/entity/usuario-rol.entity';

@Index('olimpiada_pkey', ['id'], { unique: true })
@Entity('olimpiada', { schema: 'public' })
export class Olimpiada extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'nombre', nullable: true, length: 255 })
  nombre: string | null;

  @Column('character varying', { name: 'sigla', nullable: true, length: 255 })
  sigla: string | null;

  @Column('integer', { name: 'gestion', nullable: true })
  gestion: number | null;

  @Column({
    name: 'fecha_inicio',
    type: 'date',
    nullable: true,
  })
  fechaInicio: Date | null;

  @Column({
    name: 'fecha_fin',
    type: 'date',
    nullable: true,
  })
  fechaFin: Date | null;

  @Column({
    type: 'enum',
    enum: [Status.ACTIVE, Status.INACTIVE, Status.CLOSED],
    default: Status.ACTIVE,
  })
  estado: string;

  @Column({
    type: 'character varying',
    name: 'leyenda',
    nullable: false,
    length: 255,
  })
  leyenda: string;

  @Column({
    type: 'text',
    name: 'logo',
    nullable: false,
  })
  logo: string;

  @OneToMany(() => Etapa, (etapa) => etapa.olimpiada)
  etapas: Etapa[];

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.olimpiada)
  usuarioOlimpiada: UsuarioRol[];
}
