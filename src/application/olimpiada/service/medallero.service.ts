import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedalleroPosicionRepository } from '../repository/medalleroPosicion.repository';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { totalRowsResponse } from '../../../common/lib/http.module';
import { MedalleroPosicionRuralRepository } from '../repository/medalleroPosicionRural.repository';

@Injectable()
export class MedalleroService {
  constructor(
    @InjectRepository(MedalleroPosicionRuralRepository)
    private medalleroPosicionRuralRepositorio: MedalleroPosicionRuralRepository,
    @InjectRepository(MedalleroPosicionRepository)
    private medalleroPosicionRepositorio: MedalleroPosicionRepository,
  ) {}

  async listarPosicion(
    idEtapaAreaGrado: string,
    paginacionQueryDto: PaginacionQueryDto,
  ) {
    const result = await this.medalleroPosicionRepositorio.listarPorEtapaAreaGrado(
      idEtapaAreaGrado,
      paginacionQueryDto,
    );
    return totalRowsResponse(result);
  }

  async listarPosicionRural(
    idEtapaAreaGrado: string,
    paginacionQueryDto: PaginacionQueryDto,
  ) {
    const result = await this.medalleroPosicionRuralRepositorio.listarPorEtapaAreaGrado(
      idEtapaAreaGrado,
      paginacionQueryDto,
    );
    return totalRowsResponse(result);
  }
}
