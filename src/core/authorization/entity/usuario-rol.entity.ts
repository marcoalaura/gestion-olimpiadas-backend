import { Usuario } from '../../../application/usuario/usuario.entity';
import { Olimpiada } from '../../../application/olimpiada/entity/Olimpiada.entity';
import { Departamento } from '../../../application/olimpiada/entity/Departamento.entity';
import { Distrito } from '../../../application/olimpiada/entity/Distrito.entity';
import { Etapa } from '../../../application/olimpiada/entity/Etapa.entity';
import { Area } from '../../../application/olimpiada/entity/Area.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rol } from './rol.entity';
import { Status } from '../../../common/constants';
import { UnidadEducativa } from '../../../application/olimpiada/entity/UnidadEducativa.entity';
import { AbstractEntity } from '../../../common/dto/abstract-entity.dto';

const enumStatus = [Status.ACTIVE, Status.INACTIVE];

@Entity()
export class UsuarioRol extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: enumStatus, default: Status.ACTIVE })
  estado: string;

  @ManyToOne(() => Rol, (rol) => rol.usuarioRol, { nullable: false })
  @JoinColumn({ name: 'id_rol', referencedColumnName: 'id' })
  public rol!: Rol;

  // transient
  @Column({ name: 'id_rol' })
  idRol: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.usuarioRol, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_usuario', referencedColumnName: 'id' })
  public usuario!: Usuario;

  // transient
  @Column({ name: 'id_usuario' })
  idUsuario: string;

  @Column({ name: 'id_olimpiada' })
  idOlimpiada: string;

  @ManyToOne(() => Olimpiada, (usuario) => usuario.usuarioOlimpiada, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_olimpiada', referencedColumnName: 'id' })
  public olimpiada!: Olimpiada;

  @Column({ name: 'id_departamento', nullable: true })
  idDepartamento: string;

  @ManyToOne(() => Departamento, (usuario) => usuario.usuarioDepartamento, {
    nullable: true,
  })
  @JoinColumn({ name: 'id_departamento', referencedColumnName: 'id' })
  public departamento!: Departamento;

  @Column({ name: 'id_distrito', nullable: true })
  idDistrito: string;

  @ManyToOne(() => Distrito, (usuario) => usuario.usuarioDistrito, {
    nullable: true,
  })
  @JoinColumn({ name: 'id_distrito', referencedColumnName: 'id' })
  public distrito!: Distrito;

  @Column({ name: 'id_unidad_educativa', nullable: true })
  idUnidadEducativa: string;

  @ManyToOne(
    () => UnidadEducativa,
    (usuario) => usuario.usuarioUnidadEducativa,
    {
      nullable: true,
    },
  )
  @JoinColumn({ name: 'id_unidad_educativa', referencedColumnName: 'id' })
  public unidadEducativa!: UnidadEducativa;

  @Column({ name: 'id_etapa', nullable: true })
  idEtapa: string;

  @ManyToOne(() => Etapa, (usuario) => usuario.usuarioEtapa, {
    nullable: true,
  })
  @JoinColumn({ name: 'id_etapa', referencedColumnName: 'id' })
  public etapa!: Etapa;

  @Column({ name: 'id_area', nullable: true })
  idArea: string;

  @ManyToOne(() => Area, (usuario) => usuario.usuarioArea, {
    nullable: true,
  })
  @JoinColumn({ name: 'id_area', referencedColumnName: 'id' })
  public area!: Area;
}
