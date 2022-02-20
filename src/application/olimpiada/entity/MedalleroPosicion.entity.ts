import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Inscripcion } from './Inscripcion.entity';
import { EtapaAreaGrado } from './EtapaAreaGrado.entity';
import { AbstractEntity } from '../../../common/dto/abstract-entity.dto';
import { Status } from '../../../common/constants';

@Index('medallero_posicion_pkey', ['id'], { unique: true })
@Entity('medallero_posicion', { schema: 'public' })
export class MedalleroPosicion extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('integer', { name: 'orden_galardon', nullable: true })
  ordenGalardon: number | null;

  @Column('character varying', {
    name: 'sub_grupo',
    nullable: false,
    length: 100,
  })
  subGrupo: string | null;

  @Column('character varying', {
    name: 'denominativo',
    nullable: false,
    length: 100,
  })
  denominativo: string | null;

  @Column({
    type: 'enum',
    enum: [Status.ACTIVE, Status.INACTIVE],
    default: Status.ACTIVE,
  })
  estado: string;

  // transient
  @Column({ name: 'id_etapa_area_grado' })
  idEtapaAreaGrado: string;

  @OneToMany(
    () => Inscripcion,
    (inscripcion) => inscripcion.idMedalleroPosicionAutomatica,
  )
  inscripcions: Inscripcion[];

  @OneToMany(
    () => Inscripcion,
    (inscripcion) => inscripcion.idMedalleroPosicionManual,
  )
  inscripcions2: Inscripcion[];

  @ManyToOne(
    () => EtapaAreaGrado,
    (etapaAreaGrado) => etapaAreaGrado.medalleroPosiciones,
    {
      nullable: false,
    },
  )
  @JoinColumn([{ name: 'id_etapa_area_grado', referencedColumnName: 'id' }])
  etapaAreaGrado!: EtapaAreaGrado;
}
