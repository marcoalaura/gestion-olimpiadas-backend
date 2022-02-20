import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Inscripcion } from './Inscripcion.entity';
import { EstudianteExamenDetalle } from './EstudianteExamenDetalle.entity';
import { AbstractEntity } from '../../../common/dto/abstract-entity.dto';
import {
  TipoPrueba,
  Status,
  TipoPlanificacion,
} from '../../../common/constants';

@Index('estudiante_examen_pkey', ['id'], { unique: true })
@Entity('estudiante_examen', { schema: 'public' })
export class EstudianteExamen extends AbstractEntity {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('timestamp with time zone', {
    name: 'fecha_inicio',
    nullable: true,
  })
  fechaInicio: Date | null;

  @Column('timestamp with time zone', {
    name: 'fecha_fin',
    nullable: true,
  })
  fechaFin: Date | null;

  @Column('timestamp with time zone', {
    name: 'fecha_conclusion',
    nullable: true,
  })
  fechaConclusion: Date | null;

  @Column({
    type: 'enum',
    name: 'estado',
    enum: [
      Status.ACTIVE,
      Status.EN_PROCESO,
      Status.FINALIZADO,
      Status.TIMEOUT,
      Status.FINALIZADO_INVALIDO,
      Status.TIMEOUT_INVALIDO,
      Status.REPROGRAMADO,
      Status.REPROGRAMADO_REZAGADO,
      Status.INACTIVE,
      Status.ANULADO,
    ],
    nullable: false,
  })
  estado: string | null;

  @Column('timestamp with time zone', {
    name: 'fecha_cargado_offfline',
    nullable: true,
  })
  fechaCargadoOffline: Date | null;

  @Column({
    type: 'enum',
    name: 'estado_cargado_offline',
    enum: [Status.PENDING, Status.FINALIZADO],
    default: Status.PENDING,
    nullable: false,
  })
  estadoCargadoOffline: string | null;

  @Column('character varying', {
    name: 'hash_examen',
    nullable: true,
    length: 500,
  })
  hashExamen: string | null;

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

  @Column('jsonb', { name: 'metadata', nullable: true })
  // eslint-disable-next-line @typescript-eslint/ban-types
  metadata: object | null;

  @Column('numeric', {
    name: 'puntaje',
    nullable: true,
    precision: 8,
    scale: 2,
  })
  puntaje: number | null;

  @Column('jsonb', { name: 'data', nullable: true })
  // eslint-disable-next-line @typescript-eslint/ban-types
  data: object | null;

  @Column('text', { name: 'observacion', nullable: true })
  observacion: string | null;

  // transient
  @Column({ name: 'id_inscripcion' })
  idInscripcion: string;

  @ManyToOne(() => Inscripcion, (inscripcion) => inscripcion.estudianteExamen)
  @JoinColumn([{ name: 'id_inscripcion', referencedColumnName: 'id' }])
  inscripcion: Inscripcion;

  @OneToMany(
    () => EstudianteExamenDetalle,
    (estudianteExamenDetalle) => estudianteExamenDetalle.estudianteExamen,
  )
  estudianteExamenDetalles: EstudianteExamenDetalle[];
}
