import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CalendarioRepository } from '../repository/calendario.repository';
import { EstudianteExamenRepository } from '../repository/estudianteExamen.repository';
import { InscripcionRepository } from '../repository/inscripcion.repository';
import { EtapaRepository } from '../repository/etapa.repository';
import { EtapaService } from './etapa.service';
import { totalRowsResponse } from '../../../common/lib/http.module';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { Status } from '../../../common/constants';

@Injectable()
export class RezagadosService {
  constructor(
    @InjectRepository(InscripcionRepository)
    private readonly inscripcionRepository: InscripcionRepository,
    @InjectRepository(EstudianteExamenRepository)
    private readonly estudianteExamenRepository: EstudianteExamenRepository,
    @InjectRepository(CalendarioRepository)
    private readonly calendarioRepository: CalendarioRepository,
    @InjectRepository(EtapaRepository)
    private readonly etapaRepository: EtapaRepository,
    private readonly etapaService: EtapaService,
  ) {}

  async habilitarRezagados(idEtapa: string, usuarioAuditoria: string) {
    await this.etapaService.obtenerEtapaVigente(idEtapa, [
      Status.HABILITACION_REZAGADOS,
    ]);
    const rezagados = await this.estudianteExamenRepository.buscarEstudiantesQueNoDieronExamenPorEtapa(
      idEtapa,
    );
    console.log('[habilitarRezagados] rezagados: ', rezagados);
    if (!(rezagados && rezagados.length > 0)) {
      return {
        mensaje: 'No se encontraron estudiantes para para programar rezagados',
      };
    }
    for (const resagado of rezagados) {
      await this.inscripcionRepository.habilitarRezagado(
        resagado.id_inscripcion,
        usuarioAuditoria,
      );
    }
    return rezagados;
  }

  async listarRezagados(
    idEtapa: string,
    idOlimpiada: string,
    paginacionQueryDto: PaginacionQueryDto,
  ) {
    console.log('[listarRezagados] idEtapa: ', idEtapa);
    const etapa = await this.etapaRepository.buscarPorId(idEtapa);
    if (!(etapa?.olimpiada?.id === idOlimpiada)) {
      throw new NotFoundException(
        'No se encontro la etapa o esta no pertenese a la olimpiada seleccionada',
      );
    }
    const rezagados = await this.inscripcionRepository.listarRezagadosPorEtapa(
      idEtapa,
      paginacionQueryDto,
    );
    console.log('[listarRezagados] rezagados: ', rezagados);
    return totalRowsResponse(rezagados);
  }
}
