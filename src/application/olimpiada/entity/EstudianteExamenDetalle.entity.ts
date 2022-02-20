import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { EstudianteExamen } from './EstudianteExamen.entity';
import { Pregunta } from './Pregunta.entity';
import { AbstractEntity } from '../../../common/dto/abstract-entity.dto';
import { Status } from '../../../common/constants';

@Entity('estudiante_examen_detalle', { schema: 'public' })
@Index('estudiante_examen_detalle_pkey', ['id'], { unique: true })
@Index(['idEstudianteExamen', 'idPregunta'], { unique: true })
export class EstudianteExamenDetalle extends AbstractEntity {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('jsonb', { name: 'respuestas', nullable: true })
  // eslint-disable-next-line @typescript-eslint/ban-types
  respuestas: object | null;

  @Column('numeric', {
    name: 'puntaje',
    nullable: true,
    precision: 8,
    scale: 2,
  })
  puntaje: string | null;

  @Column({
    type: 'enum',
    name: 'estado',
    enum: [Status.ACTIVE, Status.FINALIZADO, Status.ANULADO],
    nullable: false,
  })
  estado: string | null;

  // transient
  @Column({ name: 'id_estudiante_examen' })
  idEstudianteExamen: string;

  // transient
  @Column({ name: 'id_pregunta' })
  idPregunta: string;

  @ManyToOne(
    () => EstudianteExamen,
    (estudianteExamen) => estudianteExamen.estudianteExamenDetalles,
  )
  @JoinColumn([{ name: 'id_estudiante_examen', referencedColumnName: 'id' }])
  estudianteExamen: EstudianteExamen;

  @ManyToOne(() => Pregunta, (pregunta) => pregunta.estudianteExamenDetalles)
  @JoinColumn([{ name: 'id_pregunta', referencedColumnName: 'id' }])
  pregunta: Pregunta;
}
