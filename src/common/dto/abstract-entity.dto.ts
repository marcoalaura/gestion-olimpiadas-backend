import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export abstract class AbstractEntity {
  // datos de auditoria
  @CreateDateColumn({
    name: 'fecha_creacion',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaCreacion: Date;

  @Column({ name: 'usuario_creacion' })
  usuarioCreacion: string;

  @Exclude()
  @UpdateDateColumn({ name: 'fecha_actualizacion', nullable: true })
  fechaActualizacion: Date;

  @Column({ name: 'usuario_actualizacion', nullable: true })
  usuarioActualizacion: string;
}
