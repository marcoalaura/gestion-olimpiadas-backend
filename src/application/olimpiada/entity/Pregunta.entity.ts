import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import {
  TipoPregunta,
  TipoRespuesta,
  Status,
  NivelDificultad,
} from '../../../common/constants';

import { AbstractEntity } from '../../../common/dto/abstract-entity.dto';
import { EstudianteExamenDetalle } from './EstudianteExamenDetalle.entity';
import { EtapaAreaGrado } from './EtapaAreaGrado.entity';
@Index('pregunta_pkey', ['id'], { unique: true })
@Index('pregunta_codigo_idx', ['codigo'], { unique: true })
@Entity('pregunta', { schema: 'public' })
export class Pregunta extends AbstractEntity {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('character varying', { name: 'codigo', nullable: true, length: 32 })
  codigo: string | null;

  @Column({
    type: 'enum',
    name: 'tipo_pregunta',
    enum: [TipoPregunta.OLIMPIADA, TipoPregunta.CURRICULA],
    nullable: false,
  })
  tipoPregunta: string;

  @Column({
    type: 'enum',
    name: 'nivel_dificultad',
    enum: [NivelDificultad.ALTA, NivelDificultad.MEDIA, NivelDificultad.BAJA],
    nullable: false,
  })
  nivelDificultad: string | null;

  @Column('text', { name: 'texto_pregunta', nullable: true })
  textoPregunta: string | null;

  @Column('character varying', {
    name: 'imagen_pregunta',
    nullable: true,
    length: 255,
  })
  imagenPregunta: string | null;

  @Column({
    type: 'enum',
    name: 'tipo_respuesta',
    enum: [
      TipoRespuesta.FALSO_VERDADERO,
      TipoRespuesta.SELECCION_SIMPLE,
      TipoRespuesta.SELECCION_MULTIPLE,
    ],
  })
  tipoRespuesta: string | null;

  @Column('jsonb', { name: 'opciones', nullable: true })
  // eslint-disable-next-line @typescript-eslint/ban-types
  opciones: object | null;

  @Column('text', {
    array: true,
    name: 'respuestas',
    nullable: false,
  })
  respuestas: string[] | null;

  @Column('uuid', { name: 'usuario_verificacion', nullable: true })
  usuarioVerificacion: string | null;

  @Column({
    type: 'enum',
    name: 'estado',
    enum: [
      Status.CREATE,
      Status.ENVIADO,
      Status.APROBADO,
      Status.ELIMINADO,
      Status.ANULADO,
      Status.OBSERVADO,
    ],
    default: Status.CREATE,
    nullable: false,
  })
  estado: string;

  @Column('text', { name: 'observacion', nullable: true })
  observacion: string | null;

  // transient
  @Column({ name: 'id_etapa_area_grado' })
  idEtapaAreaGrado: string;

  @OneToMany(
    () => EstudianteExamenDetalle,
    (estudianteExamenDetalle) => estudianteExamenDetalle.pregunta,
  )
  estudianteExamenDetalles: EstudianteExamenDetalle[];

  @ManyToOne(() => EtapaAreaGrado, (etapaAreaGrado) => etapaAreaGrado.preguntas)
  @JoinColumn([{ name: 'id_etapa_area_grado', referencedColumnName: 'id' }])
  etapaAreaGrado: EtapaAreaGrado;
}
