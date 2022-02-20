import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EtapaAreaGrado } from './EtapaAreaGrado.entity';
import { AbstractEntity } from '../../../../src/common/dto/abstract-entity.dto';
import { Status } from '../../../common/constants';

@Index('medallero_posicion_rural_pkey', ['id'], { unique: true })
@Entity('medallero_posicion_rural', { schema: 'public' })
export class MedalleroPosicionRural extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('integer', { name: 'orden', nullable: true })
  orden: number | null;

  @Column('integer', { name: 'posicion_maxima', nullable: true })
  posicionMaxima: number | null;

  @Column('integer', { name: 'posicion_minima', nullable: true })
  posicionMinima: number | null;

  @Column('integer', { name: 'nota_minima', nullable: false })
  notaMinima: number;

  @Column({
    type: 'enum',
    enum: [Status.ACTIVE, Status.INACTIVE],
    default: Status.ACTIVE,
  })
  estado: string;

  // transient
  @Column({ name: 'id_etapa_area_grado' })
  idEtapaAreaGrado: string;

  @ManyToOne(
    () => EtapaAreaGrado,
    (etapaAreaGrado) => etapaAreaGrado.medalleroPosicionRurales,
    {
      nullable: false,
    },
  )
  @JoinColumn([{ name: 'id_etapa_area_grado', referencedColumnName: 'id' }])
  etapaAreaGrado: EtapaAreaGrado;
}
