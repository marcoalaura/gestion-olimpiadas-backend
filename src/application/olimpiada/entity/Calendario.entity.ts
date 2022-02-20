import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { EtapaAreaGrado } from './EtapaAreaGrado.entity';
import { AbstractEntity } from '../../../common/dto/abstract-entity.dto';
import {
  Status,
  TipoPrueba,
  TipoPlanificacion,
} from '../../../common/constants';

@Index('calendario_pkey', ['id'], { unique: true })
@Entity('calendario', { schema: 'public' })
export class Calendario extends AbstractEntity {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column({
    type: 'enum',
    name: 'tipo_prueba',
    enum: [TipoPrueba.ONLINE, TipoPrueba.OFFLINE],
    nullable: false,
  })
  tipoPrueba: string;

  @Column({
    type: 'enum',
    name: 'tipo_planificacion',
    enum: [TipoPlanificacion.CRONOGRAMA, TipoPlanificacion.REZAGADO],
    nullable: false,
  })
  tipoPlanificacion: string;

  @Column('timestamp without time zone', {
    name: 'fecha_hora_inicio',
    nullable: true,
  })
  fechaHoraInicio: Date | null;

  @Column('timestamp without time zone', {
    name: 'fecha_hora_fin',
    nullable: true,
  })
  fechaHoraFin: Date | null;

  @Column({
    type: 'enum',
    name: 'estado',
    enum: [Status.CREATE, Status.ACTIVE, Status.ELIMINADO, Status.CLOSED],
    default: Status.CREATE,
    nullable: false,
  })
  estado: string;

  // transient
  @Column({ name: 'id_etapa_area_grado' })
  idEtapaAreaGrado: string;

  @ManyToOne(
    () => EtapaAreaGrado,
    (etapaAreaGrado) => etapaAreaGrado.calendarios,
  )
  @JoinColumn([{ name: 'id_etapa_area_grado', referencedColumnName: 'id' }])
  etapaAreaGrado: EtapaAreaGrado;
}
