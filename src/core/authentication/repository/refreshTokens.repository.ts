import { EntityRepository, getRepository, Repository } from 'typeorm';
import * as dayjs from 'dayjs';

import { RefreshTokens } from '../entity/refreshTokens.entity';

@EntityRepository(RefreshTokens)
export class RefreshTokensRepository extends Repository<RefreshTokens> {
  findById(id: string) {
    return getRepository(RefreshTokens)
      .createQueryBuilder('refreshTokens')
      .where('refreshTokens.id = :id', { id })
      .getOne();
  }

  // metodo para buscar refresh toke padre
  busarPorCookie(id: string) {
    return getRepository(RefreshTokens)
      .createQueryBuilder('refreshTokens')
      .where('refreshTokens.id = :id', { id })
      .andWhere('refreshTokens.refreshTokenId is null')
      .getOne();
  }

  eliminarTokensCaducos() {
    const now = dayjs().format();
    return getRepository(RefreshTokens)
      .createQueryBuilder('RefreshTokens')
      .delete()
      .from(RefreshTokens)
      .where('expires_at < :now', { now })
      .execute();
  }

  eliminarTokensPorGrantId(grantId: string) {
    return getRepository(RefreshTokens)
      .createQueryBuilder('RefreshTokens')
      .delete()
      .from(RefreshTokens)
      .where('grant_id = :grantId', { grantId })
      .execute();
  }

  eliminarRefreshTokenPorGrandId(grantId: string, refreshTokenId: string) {
    return getRepository(RefreshTokens)
      .createQueryBuilder('RefreshTokens')
      .delete()
      .from(RefreshTokens)
      .where('grant_id = :grantId and refresh_token_id = :refreshTokenId', {
        grantId,
        refreshTokenId,
      })
      .execute();
  }
}
