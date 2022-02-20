import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { EstudianteExamen } from './EstudianteExamen.entity';
import { Estudiante } from './Estudiante.entity';
import { EtapaAreaGrado } from './EtapaAreaGrado.entity';
import { MedalleroPosicion } from './MedalleroPosicion.entity';
import { UnidadEducativa } from './UnidadEducativa.entity';
import { AbstractEntity } from '../../../common/dto/abstract-entity.dto';
import { Status } from '../../../common/constants';

@Index('inscripcion_pkey', ['id'], { unique: true })
@Unique('uk_inscripcion', ['estudiante', 'etapaAreaGrado', 'unidadEducativa'])
@Entity('inscripcion', { schema: 'public' })
export class Inscripcion extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'id_importacion',
    nullable: false,
  })
  idImportacion: string;

  @Column({
    type: 'enum',
    enum: [Status.ACTIVE, Status.INACTIVE],
    default: Status.ACTIVE,
  })
  estado: string;

  @Column('boolean', { name: 'importado', nullable: true })
  importado: boolean | null;

  @Column('boolean', { name: 'clasificado', nullable: true })
  clasificado: boolean | null;

  @Column('timestamp with time zone', {
    name: 'fecha_clasificacion',
    nullable: true,
  })
  fechaClasificacion: Date | null;

  @Column('jsonb', { name: 'reglas_clasificacion', nullable: true })
  // eslint-disable-next-line @typescript-eslint/ban-types
  reglasClasificacion: object | null;

  @Column('boolean', { name: 'rezagado', nullable: true })
  rezagado: boolean | null;

  // transient
  @Column({ name: 'id_etapa_area_grado' })
  idEtapaAreaGrado: string;

  @Column({ name: 'id_estudiante' })
  idEstudiante: string;

  @OneToMany(
    () => EstudianteExamen,
    (estudianteExamen) => estudianteExamen.inscripcion,
  )
  estudianteExamen: EstudianteExamen[];

  @ManyToOne(() => Estudiante, (estudiante) => estudiante.inscripcions, {
    nullable: false,
  })
  @JoinColumn([{ name: 'id_estudiante', referencedColumnName: 'id' }])
  estudiante: Estudiante;

  @ManyToOne(
    () => EtapaAreaGrado,
    (etapaAreaGrado) => etapaAreaGrado.inscripcions,
    {
      nullable: false,
    },
  )
  @JoinColumn([{ name: 'id_etapa_area_grado', referencedColumnName: 'id' }])
  etapaAreaGrado: EtapaAreaGrado;

  @ManyToOne(
    () => MedalleroPosicion,
    (medalleroPosicion) => medalleroPosicion.inscripcions,
  )
  @JoinColumn([
    { name: 'id_medallero_posicion_automatica', referencedColumnName: 'id' },
  ])
  idMedalleroPosicionAutomatica: MedalleroPosicion;

  @ManyToOne(
    () => MedalleroPosicion,
    (medalleroPosicion) => medalleroPosicion.inscripcions2,
  )
  @JoinColumn([
    { name: 'id_medallero_posicion_manual', referencedColumnName: 'id' },
  ])
  idMedalleroPosicionManual: MedalleroPosicion;

  @ManyToOne(
    () => UnidadEducativa,
    (unidadEducativa) => unidadEducativa.inscripcions,
    {
      nullable: false,
    },
  )
  @JoinColumn([{ name: 'id_unidad_educativa', referencedColumnName: 'id' }])
  unidadEducativa: UnidadEducativa;
}
