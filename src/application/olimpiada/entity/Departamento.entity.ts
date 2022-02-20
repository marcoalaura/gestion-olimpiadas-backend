import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Distrito } from './Distrito.entity';

@Index('departamento_pkey', ['id'], { unique: true })
@Entity('departamento', { schema: 'public' })
export class Departamento {
  @Column('uuid', { primary: true, name: 'id' })
  id: string;

  @Column('character varying', { name: 'nombre', nullable: true, length: 500 })
  nombre: string | null;

  @Column('character varying', { name: 'codigo', nullable: true, length: 10 })
  codigo: string | null;

  @OneToMany(() => Distrito, (distrito) => distrito.departamento)
  distritos: Distrito[];

  @OneToMany(() => Departamento, (departamento) => departamento)
  usuarioDepartamento: Departamento[];
}
