import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { AbstractEntity } from '../../../common/dto/abstract-entity.dto';
import { Calendario } from './Calendario.entity';
import { Area } from './Area.entity';
import { Etapa } from './Etapa.entity';
import { GradoEscolaridad } from './GradoEscolaridad.entity';
import { Inscripcion } from './Inscripcion.entity';
import { MedalleroPosicion } from './MedalleroPosicion.entity';
import { MedalleroPosicionRural } from './MedalleroPosicionRural.entity';
import { Pregunta } from './Pregunta.entity';
import { Status } from '../../../common/constants';

const enumStatus = [Status.ACTIVE, Status.INACTIVE];

@Index('olimpiada_area_grado_pkey', ['id'], { unique: true })
@Unique('uk_etapa_area_grado', ['etapa', 'area', 'gradoEscolar'])
@Entity('etapa_area_grado', { schema: 'public' })
export class EtapaAreaGrado extends AbstractEntity {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('integer', { name: 'total_preguntas', nullable: true })
  totalPreguntas: number | null;

  @Column('integer', { name: 'preguntas_curricula', nullable: true })
  preguntasCurricula: number | null;

  @Column('integer', { name: 'preguntas_olimpiada', nullable: true })
  preguntasOlimpiada: number | null;

  @Column('numeric', {
    name: 'puntos_pregunta_curricula',
    nullable: true,
    precision: 8,
    scale: 2,
  })
  puntosPreguntaCurricula: number | null;

  @Column('numeric', {
    name: 'puntos_pregunta_olimpiada',
    nullable: true,
    precision: 8,
    scale: 2,
  })
  puntosPreguntaOlimpiada: number | null;

  @Column('integer', { name: 'duracion_minutos', nullable: true })
  duracionMinutos: number | null;

  @Column('integer', { name: 'preguntas_curricula_baja', nullable: true })
  preguntasCurriculaBaja: number | null;

  @Column('numeric', {
    name: 'puntaje_curricula_baja',
    nullable: true,
    precision: 8,
    scale: 2,
  })
  puntajeCurriculaBaja: number | null;

  @Column('integer', { name: 'preguntas_curricula_media', nullable: true })
  preguntasCurriculaMedia: number | null;

  @Column('numeric', {
    name: 'puntaje_curricula_media',
    nullable: true,
    precision: 8,
    scale: 2,
  })
  puntajeCurriculaMedia: number | null;

  @Column('integer', { name: 'preguntas_curricula_alta', nullable: true })
  preguntasCurriculaAlta: number | null;

  @Column('numeric', {
    name: 'puntaje_curricula_alta',
    nullable: true,
    precision: 8,
    scale: 2,
  })
  puntajeCurriculaAlta: number | null;

  @Column('integer', { name: 'preguntas_olimpiada_baja', nullable: true })
  preguntasOlimpiadaBaja: number | null;

  @Column('numeric', {
    name: 'puntaje_olimpiada_baja',
    nullable: true,
    precision: 8,
    scale: 2,
  })
  puntajeOlimpiadaBaja: number | null;

  @Column('integer', { name: 'preguntas_olimpiada_media', nullable: true })
  preguntasOlimpiadaMedia: number | null;

  @Column('numeric', {
    name: 'puntaje_olimpiada_media',
    nullable: true,
    precision: 8,
    scale: 2,
  })
  puntajeOlimpiadaMedia: number | null;

  @Column('integer', { name: 'preguntas_olimpiada_alta', nullable: true })
  preguntasOlimpiadaAlta: number | null;

  @Column('numeric', {
    name: 'puntaje_olimpiada_alta',
    nullable: true,
    precision: 8,
    scale: 2,
  })
  puntajeOlimpiadaAlta: number | null;

  // medallero
  @Column('integer', { name: 'nro_posiciones_total', nullable: true })
  nroPosicionesTotal: number | null;

  @Column('integer', { name: 'nro_posiciones_rural', nullable: true })
  nroPosicionesRural: number | null;

  @Column('numeric', {
    name: 'puntaje_minimo_medallero',
    nullable: false,
    precision: 8,
    scale: 2,
  })
  puntajeMinimoMedallero: number;

  // clasificación
  @Column('boolean', { name: 'criterio_calificacion', nullable: true })
  criterioCalificacion: boolean | null;

  @Column('numeric', {
    name: 'puntaje_minimo_clasificacion',
    nullable: false,
    precision: 8,
    scale: 2,
  })
  puntajeMinimoClasificacion: number;

  @Column('boolean', { name: 'criterio_medallero', nullable: true })
  criterioMedallero: boolean | null;

  @Column('integer', { name: 'cantidad_maxima_clasificados', nullable: true })
  cantidadMaximaClasificados: number | null;

  @Column({ type: 'enum', enum: enumStatus, default: Status.ACTIVE })
  estado: string;

  @Column('character varying', { nullable: true, length: 10 })
  color: string | null;

  // transient
  @Column({ name: 'id_etapa' })
  idEtapa: string;

  // transient
  @Column({ name: 'id_grado_escolar' })
  idGradoEscolar: string;

  // transient
  @Column({ name: 'id_area' })
  idArea: string;

  @OneToMany(() => Calendario, (calendario) => calendario.etapaAreaGrado)
  calendarios: Calendario[];

  @ManyToOne(() => Area, (area) => area.etapaAreaGrados)
  @JoinColumn([{ name: 'id_area', referencedColumnName: 'id' }])
  area: Area;

  @ManyToOne(() => Etapa, (etapa) => etapa.etapaAreaGrados)
  @JoinColumn([{ name: 'id_etapa', referencedColumnName: 'id' }])
  etapa: Etapa;

  @ManyToOne(
    () => GradoEscolaridad,
    (gradoEscolaridad) => gradoEscolaridad.etapaAreaGrados,
  )
  @JoinColumn([{ name: 'id_grado_escolar', referencedColumnName: 'id' }])
  gradoEscolar: GradoEscolaridad;

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.etapaAreaGrado)
  inscripcions: Inscripcion[];

  @OneToMany(
    () => MedalleroPosicion,
    (medalleroPosicion) => medalleroPosicion.etapaAreaGrado,
    {
      cascade: true,
    },
  )
  medalleroPosiciones!: MedalleroPosicion[];

  @OneToMany(
    () => MedalleroPosicionRural,
    (medalleroPosicionRural) => medalleroPosicionRural.etapaAreaGrado,
    {
      cascade: true,
    },
  )
  medalleroPosicionRurales: MedalleroPosicionRural[];

  @OneToMany(() => Pregunta, (pregunta) => pregunta.etapaAreaGrado)
  preguntas: Pregunta[];
}
