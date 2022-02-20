import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
@Entity()
export class RefreshTokens {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'grant_id' })
  grantId: string;

  @Column()
  iat: Date;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'is_revoked' })
  isRevoked: boolean;

  @Column({ type: 'jsonb' })
  data: Record<string, never>;

  // transient
  @Column({ name: 'refresh_token_id', nullable: true })
  refreshTokenId: string;

  @OneToMany(() => RefreshTokens, (refreshToken) => refreshToken.refreshToken, {
    cascade: true,
  })
  refreshTokens: RefreshTokens[];

  @ManyToOne(
    () => RefreshTokens,
    (refreshToken) => refreshToken.refreshTokens,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'refresh_token_id', referencedColumnName: 'id' })
  refreshToken: RefreshTokens;
}
