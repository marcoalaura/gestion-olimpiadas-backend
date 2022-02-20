import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UsuarioRol } from './usuario-rol.entity';
import { Status, grupoRol } from '../../../common/constants';
import { AbstractEntity } from '../../../common/dto/abstract-entity.dto';

const enumStatus = [Status.ACTIVE, Status.INACTIVE];
const enumGrupo = [grupoRol.USUARIO, grupoRol.ACTOR, grupoRol.ESTUDIANTE];
const enumStatusCrear = [Status.HABILITADO, Status.INHABILITADO];

@Entity()
export class Rol extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  rol: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'enum', enum: enumGrupo, default: grupoRol.USUARIO })
  grupo: string;

  @Column({ type: 'simple-array', nullable: true })
  campos: string[];

  @Column({ type: 'enum', enum: enumStatus, default: Status.ACTIVE })
  estado: string;

  @Column({ type: 'enum', enum: enumStatusCrear, default: Status.HABILITADO })
  permisoCrear: string;

  @OneToMany(() => UsuarioRol, (usuarioRol) => usuarioRol.rol)
  public usuarioRol!: UsuarioRol[];
}
