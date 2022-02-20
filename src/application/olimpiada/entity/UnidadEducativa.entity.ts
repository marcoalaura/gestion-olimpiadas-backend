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
import { Distrito } from './Distrito.entity';
import { AbstractEntity } from '../../../common/dto/abstract-entity.dto';
import {
  Status,
  tiposAreasGeograficas,
  tiposUnidadesEducativas,
} from '../../../common/constants';
import { Estudiante } from './Estudiante.entity';
const enumStatus = [Status.ACTIVE, Status.INACTIVE];

@Index('unidad_educativa_pkey', ['id'], { unique: true })
@Entity('unidad_educativa', { schema: 'public' })
export class UnidadEducativa extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('integer', { name: 'codigo_sie', nullable: false, unique: true })
  codigoSie: number | null;

  @Column('character varying', {
    name: 'nombre',
    nullable: false,
    length: 1000,
  })
  nombre: string;

  @Column({
    type: 'enum',
    enum: tiposUnidadesEducativas,
    name: 'tipo_unidad_educativa',
    nullable: false,
  })
  tipoUnidadEducativa: string;

  @Column({
    type: 'enum',
    enum: tiposAreasGeograficas,
    name: 'area_geografica',
    nullable: false,
  })
  areaGeografica: string;

  @Column('character varying', {
    name: 'seccion',
    nullable: false,
    length: 250,
  })
  seccion: string;

  @Column('character varying', {
    name: 'localidad',
    nullable: false,
    length: 500,
  })
  localidad: string;

  @Column({ type: 'enum', enum: enumStatus, default: Status.ACTIVE })
  estado: string;

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.unidadEducativa)
  inscripcions: Inscripcion[];

  @ManyToOne(() => Distrito, (distrito) => distrito.unidadEducativas, {
    nullable: false,
  })
  @JoinColumn([{ name: 'id_distrito', referencedColumnName: 'id' }])
  distrito: Distrito;

  @OneToMany(() => UnidadEducativa, (unidadEducativa) => unidadEducativa)
  usuarioUnidadEducativa: UnidadEducativa[];

  @ManyToOne(() => Estudiante, (estudiante) => estudiante.inscripcions)
  estudiante: Estudiante;
}
