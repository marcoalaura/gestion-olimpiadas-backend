import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';
import { tiposEtapa } from '../../../common/constants';

import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { EtapaRepository } from '../repository/etapa.repository';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { ResultadosRepository } from '../repository/resultados.repository';

import { totalRowsResponse } from '../../../common/lib/http.module';

dayjs.extend(isBetween);
@Injectable()
export class PublicacionResultadoService {
  constructor(
    @InjectRepository(EtapaRepository)
    private etapaRepository: EtapaRepository,
    @InjectRepository(EtapaAreaGradoRepository)
    private etapaAreaGradoRepository: EtapaAreaGradoRepository,
    @InjectRepository(ResultadosRepository)
    private resultadosRepository: ResultadosRepository,
  ) {}

  async ConsultaResultadoMedalleros(
    idEAG: string,
    paginacionQueryDto: PaginacionQueryDto,
  ) {
    // if (JSON.stringify(paginacionQueryDto).search('idDepartamento') === -1) {
    //   throw new PreconditionFailedException(
    //     `Debe enviar el filtro de departamento`,
    //   );
    // }
    const resultadoMedalleros = await this.resultadosRepository.listarMedallerosPublico(
      idEAG,
      paginacionQueryDto,
    );
    return totalRowsResponse(resultadoMedalleros);
  }

  async ConsultaResultadoClasificados(
    idEAG: string,
    paginacionQueryDto: PaginacionQueryDto,
  ) {
    if (JSON.stringify(paginacionQueryDto).search('idDepartamento') === -1) {
      throw new PreconditionFailedException(
        `Debe enviar el filtro de departamento`,
      );
    }
    const resultadoClasificados = await this.resultadosRepository.listarClasificadosPublico(
      idEAG,
      paginacionQueryDto,
    );
    return totalRowsResponse(resultadoClasificados);
  }

  async validarEstudiantesClasificados(idEtapa: string) {
    const etapa = await this.etapaRepository.buscarPorId(idEtapa);
    if (!etapa) {
      throw new PreconditionFailedException(`No existe registro de la etapa`);
    }
    const tipoSiguiente =
      etapa.tipo === tiposEtapa.DISTRITAL
        ? tiposEtapa.DEPARTAMENTAL
        : etapa.tipo === tiposEtapa.DEPARTAMENTAL
        ? tiposEtapa.NACIONAL
        : null;
    if (tipoSiguiente) {
      // etapa siguiente
      const etapaSiguiente = await this.etapaRepository.buscarPorIdOlimpiadaTipo(
        etapa.olimpiada.id,
        tipoSiguiente,
      );
      if (!etapaSiguiente) {
        throw new PreconditionFailedException(
          `No se puede realizar el cambio de estado a la etapa, no existe registro de la etapa ${tipoSiguiente}`,
        );
      }

      // etapaAreaGrado siguiente
      const eagSiguiente = await this.etapaAreaGradoRepository.buscarEAGsiguiente(
        etapa.id,
        etapaSiguiente.id,
      );
      eagSiguiente.forEach((item) => {
        throw new PreconditionFailedException(
          `No se puede realizar el cambio de estado a la Etapa,
           no existe registro del área de ${item.area.nombre} y grado de escolaridad ${item.gradoEscolar.nombre} para la etapa siguiente ${tipoSiguiente}`,
        );
      });

      // clasificados
      // const clasificados = await this.inscripcionRepository.contarClasificadosPorEtapa(
      //   idEtapa,
      // );
      // if (clasificados === 0) {
      //   throw new PreconditionFailedException(
      //     `No se puede realizar el cambio de estado a la etapa, no existe estudiantes clasificados`,
      //   );
      // }
    }
  }
}
