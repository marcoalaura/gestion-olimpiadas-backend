import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenOlimpiadaRepository } from '../repository/tokenOlimpiada.repository';

@Injectable()
export class TokenOlimpiadaService {
  constructor(
    @InjectRepository(TokenOlimpiadaRepository)
    private readonly tokenOlimpiadaRepository: TokenOlimpiadaRepository,
  ) {}

  async findByRefreshTokenId(interactionId: string, jid: string) {
    return this.tokenOlimpiadaRepository.findByRefreshTokenId(
      interactionId,
      jid,
    );
  }
}
