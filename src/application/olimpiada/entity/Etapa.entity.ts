import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AbstractEntity } from '../../../common/dto/abstract-entity.dto';
import { Olimpiada } from './Olimpiada.entity';
import { EtapaAreaGrado } from './EtapaAreaGrado.entity';
import {
  ArrayMaquinaEstados,
  Status,
  tiposEtapa,
} from '../../../common/constants';

const enumStatus = ArrayMaquinaEstados;

@Index('etapa_pkey', ['id'], { unique: true })
@Entity('etapa', { schema: 'public' })
export class Etapa extends AbstractEntity {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('character varying', { name: 'nombre', nullable: false, length: 255 })
  nombre: string | null;

  @Column({
    name: 'tipo',
    type: 'enum',
    enum: tiposEtapa,
  })
  tipo: string;

  @Column('integer', { name: 'jerarquia', nullable: true })
  jerarquia: number | null;

  @Column('boolean', { name: 'comite_desempate', nullable: true })
  comiteDesempate: boolean | null;

  @Column({
    name: 'fecha_inicio',
    type: 'date',
    nullable: true,
  })
  fechaInicio: Date | null;

  @Column({ name: 'fecha_fin', type: 'date', nullable: true })
  fechaFin: Date | null;

  @Column({
    name: 'fecha_inicio_impugnacion',
    type: 'date',
    nullable: true,
  })
  fechaInicioImpugnacion: Date | null;

  @Column({
    name: 'fecha_fin_impugnacion',
    type: 'date',
    nullable: true,
  })
  fechaFinImpugnacion: Date | null;

  @Column({ type: 'enum', enum: enumStatus, default: Status.ACTIVE })
  estado: string;

  @Column({
    name: 'estado_sorteo_preguntas',
    type: 'enum',
    enum: [Status.PENDING, Status.EN_PROCESO, Status.FINALIZADO],
    default: Status.PENDING,
  })
  estadoSorteoPreguntas: string;

  @Column({
    name: 'estado_sorteo_preguntas_rezagados',
    type: 'enum',
    enum: [Status.PENDING, Status.EN_PROCESO, Status.FINALIZADO],
    default: Status.PENDING,
  })
  estadoSorteoPreguntasRezagados: string;

  @Column({
    name: 'estado_posicionamiento',
    type: 'enum',
    enum: [
      Status.CALIFICACION_PROCESO,
      Status.CALIFICACION_ERROR,
      Status.CALIFICACION,
      Status.OBTENCION_MEDALLERO,
      Status.OBTENCION_MEDALLERO_PROCESO,
      Status.OBTENCION_MEDALLERO_ERROR,
      Status.GENERAR_CLASIFICADOS,
      Status.CLASIFICACION_PROCESO,
      Status.CLASIFICACION_ERROR,
    ],
    nullable: true,
  })
  estadoPosicionamiento: string;
  // transient
  @Column({ name: 'id_olimpiada' })
  idOlimpiada: string;

  @ManyToOne(() => Olimpiada, (olimpiada) => olimpiada.etapas, {
    nullable: false,
  })
  @JoinColumn([{ name: 'id_olimpiada', referencedColumnName: 'id' }])
  olimpiada: Olimpiada;

  @OneToMany(() => EtapaAreaGrado, (etapaAreaGrado) => etapaAreaGrado.etapa)
  etapaAreaGrados: EtapaAreaGrado[];

  @OneToMany(() => Etapa, (etapa) => etapa)
  usuarioEtapa: Etapa[];
}
