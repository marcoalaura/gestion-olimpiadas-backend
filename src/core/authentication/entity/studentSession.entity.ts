import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity()
export class StudentSession {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'grant_id' })
  grantId: string;

  @Column()
  iat: number;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column('jsonb', { name: 'data', nullable: true })
  // eslint-disable-next-line @typescript-eslint/ban-types
  data: object | null;
}
