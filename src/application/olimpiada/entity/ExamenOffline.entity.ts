import { AbstractEntity } from 'src/common/dto/abstract-entity.dto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('examen_offline', { schema: 'public' })
export class ExamenOffline extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb', { name: 'datos', nullable: true })
  // eslint-disable-next-line @typescript-eslint/ban-types
  datos: object | null;

  @Column('varchar', { name: 'ruta', nullable: true, length: 256 })
  ruta: string | null;

  @Column('integer', { name: 'cantidad', default: 0, nullable: true })
  cantidad: number | null;

  @Column({
    enum: [
      'CREADO',
      'PROCESANDO',
      'FINALIZADO',
      'ERROR',
      'ACTIVO',
      'INACTIVO',
      'CARGADO',
      'PENDIENTE',
    ],
    default: 'CREADO',
  })
  estado: string;

  @Column('uuid', { name: 'id_olimpiada', nullable: true })
  idOlimpiada: string | null;

  @Column('uuid', { name: 'id_unidad_educativa', nullable: true })
  idUnidadEducativa: string | null;

  @Column('uuid', { name: 'id_etapa', nullable: true })
  idEtapa: string | null;
}
