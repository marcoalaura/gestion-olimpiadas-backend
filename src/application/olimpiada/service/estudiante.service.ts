import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import { totalRowsResponse } from '../../../common/lib/http.module';
import { EstudianteRepository } from '../repository/estudiante.repository';
import { EstudianteExamenDetalleRepository } from '../repository/estudianteExamenDetalle.repository';
import { PaginacionQueryDto } from '../../../../src/common/dto/paginacion-query.dto';
import { Estudiante } from '../entity/Estudiante.entity';
import { EstudianteCreacionDto } from '../dto/estudiante.dto';
import { Status } from '../../../common/constants';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(EstudianteRepository)
    private estudianteRepositorio: EstudianteRepository,
    @InjectRepository(EstudianteExamenDetalleRepository)
    private estudianteExamenDetalleRepository: EstudianteExamenDetalleRepository,
  ) {}

  async obtenerEstudiantes(paginacionQueryDto: PaginacionQueryDto) {
    const resultado = await this.estudianteRepositorio.obtenerEstudiantes(
      paginacionQueryDto,
    );
    return totalRowsResponse(resultado);
  }

  async encontrarPorId(id: string): Promise<Estudiante> {
    return await this.estudianteRepositorio.encontrarPorId(id);
  }

  async crear(usuarioDto: EstudianteCreacionDto, usuarioAuditoria: string) {
    const result = await this.estudianteRepositorio.crear(
      usuarioDto,
      usuarioAuditoria,
    );
    return {
      result,
    };
  }

  /**
   * Metodo para listar lista de examenes pantalla principal del estudiante
   */
  async encontrarExamenes(id: string, idOlimpiada: string) {
    const examenes = await this.estudianteRepositorio.encontrarExamenes(
      id,
      idOlimpiada,
    );
    examenes.map((fila) => {
      fila.fechaHoraInicio = fila.fechaHoraInicio.getTime();
      fila.fechaHoraFin = fila.fechaHoraFin.getTime();
      fila.iniciaEnXMilis = null;
      if (dayjs(fila.fechaHoraInicio).isAfter(dayjs())) {
        fila.iniciaEnXMilis = dayjs().diff(fila.fechaHoraInicio);
      }
      fila.estado =
        fila.estado === Status.ACTIVE
          ? dayjs().isBetween(
              dayjs(fila.fechaHoraInicio),
              dayjs(fila.fechaHoraFin),
            )
            ? Status.ACTIVE
            : Status.INSCRITO
          : fila.estado;
    });
    return examenes;
  }

  /**
   * Metodo para obtener una lista de examenes para la solicitud de reinicio
   * pruebas online
   * @param idEstudiante identificador del estudiante
   * @param params filtros de operacion
   * @returns Object
   */
  async encontrarExamenesEnCalendarioVigente(
    idEstudiante: string,
    params: any,
  ) {
    const examenes = await this.estudianteRepositorio.encontrarExamenesEnCalendatioVigente(
      idEstudiante,
      params.idEtapaAreaGrado,
      params.idOlimpiada,
    );
    for (const fila of examenes) {
      const cantidadPreguntas = await this.estudianteExamenDetalleRepository.cantidadPreguntas(
        fila.idExamen,
      );
      const cantidadRespuestas = await this.estudianteExamenDetalleRepository.cantidadRespuestas(
        fila.idExamen,
      );
      fila.totalPreguntas = cantidadPreguntas?.totalPreguntas;
      fila.totalRespuestas = cantidadRespuestas?.totalRespuestas;
      fila.nroReinicios = 0;
      fila.fechaInicio = fila.fechaInicio ? fila.fechaInicio.getTime() : null;
      fila.fechaConclusion = fila.fechaConclusion
        ? fila.fechaConclusion.getTime()
        : null;
      fila.estado =
        fila.estado === Status.ACTIVE
          ? dayjs().isBetween(
              dayjs(fila.fechaInicio),
              dayjs(fila.fechaConclusion),
            )
            ? Status.ACTIVE
            : Status.INSCRITO
          : fila.estado;
    }
    return examenes;
  }

  async encontrarExamenesHistoricos(id: string) {
    const examenes = await this.estudianteRepositorio.encontrarExamenesHistoricos(
      id,
    );
    examenes.map((fila) => {
      fila.fechaInicio = fila.fechaInicio?.getTime();
      fila.fechaFin = fila.fechaFin?.getTime();
      if (fila.fechaInicio && fila.fechaFin) {
        fila.duracionMinutosEstudiante = dayjs(fila.fechaFin).diff(
          dayjs(fila.fechaInicio),
          'minute',
          true,
        );
      }
    });
    console.log(' ******************* examenes: ', examenes);
    return examenes;
  }

  async encontrarEstudiantePorCiRude(
    ci: string,
    rude: string,
  ): Promise<Estudiante> {
    const result = await this.estudianteRepositorio.encontrarEstudiantePorCiRude(
      ci,
      rude,
    );
    return result;
  }

  async buscarEstudiantePorCiRude(ciRude: string) {
    const result = await this.estudianteRepositorio.buscarEstudiantePorCiRude(
      ciRude,
    );
    console.log(result);
    return result;
  }

  /**
   * Metodo para obtener las olimpiadas en las que participo el estudiante
   * @param id identificador del estudiante
   * @returns Object
   */
  async obtenerOlimpiadas(id: string) {
    const olimpiadas = await this.estudianteRepositorio.encontrarOlimpiadas(id);
    return olimpiadas;
  }
}
