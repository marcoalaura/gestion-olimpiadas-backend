import { RefreshTokens } from '../../../core/authentication/entity/refreshTokens.entity';
import { EntityRepository, getRepository, Repository } from 'typeorm';

@EntityRepository(RefreshTokens)
export class TokenOlimpiadaRepository extends Repository<RefreshTokens> {
  findByRefreshTokenId(interactionId: string, jid: string) {
    return getRepository(RefreshTokens)
      .createQueryBuilder('refreshTokens')
      .where(
        'refreshTokens.id = :interactionId and refreshTokens.refreshTokenId = :jid',
        { interactionId, jid },
      )
      .getOne();
  }
}
