import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { EtapaRepository } from '../repository/etapa.repository';
import { AreaRepository } from '../repository/area.repository';
import { GradoEscolaridadRepository } from '../repository/gradoEscolaridad.repository';
import { CalendarioRepository } from '../repository/calendario.repository';
import { InscripcionRepository } from '../repository/inscripcion.repository';
import { PreguntaRepository } from '../repository/pregunta.repository';
import { EtapaAreaGradoDto } from '../dto/etapaAreaGrado.dto';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { totalRowsResponse } from '../../../common/lib/http.module';
import { Status, TotalPuntaje } from '../../../common/constants';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';

import {
  GetJsonData,
  ConvertJsonToFiltroQuery,
} from '../../../common/lib/json.module';
import { MedalleroPosicionRepository } from '../repository/medalleroPosicion.repository';
import { MedalleroPosicionRuralRepository } from '../repository/medalleroPosicionRural.repository';

@Injectable()
export class EtapaAreaGradoService {
  constructor(
    @InjectRepository(EtapaAreaGradoRepository)
    private etapaAreaGradoRepositorio: EtapaAreaGradoRepository,
    @InjectRepository(EtapaRepository)
    private etapaRepositorio: EtapaRepository,
    @InjectRepository(AreaRepository)
    private areaRepositorio: AreaRepository,
    @InjectRepository(GradoEscolaridadRepository)
    private gradoEscolaridadRepositorio: GradoEscolaridadRepository,
    @InjectRepository(CalendarioRepository)
    private calendarioRepositorio: CalendarioRepository,
    @InjectRepository(InscripcionRepository)
    private inscripcionRepositorio: InscripcionRepository,
    @InjectRepository(PreguntaRepository)
    private preguntaRepositorio: PreguntaRepository,
  ) {}

  async listar(idEtapa: string, paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.etapaAreaGradoRepositorio.listar(
      idEtapa,
      paginacionQueryDto,
    );
    return totalRowsResponse(result);
  }

  async listarPublico(idEtapa: string, paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.etapaAreaGradoRepositorio.listarPublico(
      idEtapa,
      paginacionQueryDto,
    );
    return totalRowsResponse(result);
  }

  async buscarPorId(id: string) {
    const etapaAreaGrado = await this.etapaAreaGradoRepositorio.buscarPorId(id);
    if (!etapaAreaGrado) {
      throw new EntityNotFoundException(
        `Etapa - area - grado con id ${id} no encontrado.`,
      );
    }
    return etapaAreaGrado;
  }

  async crear(etapaAreaGradoDto: EtapaAreaGradoDto, usuarioAuditoria: string) {
    etapaAreaGradoDto.id = null;
    await this.validar(etapaAreaGradoDto);
    await this.validarConfiguraciones(etapaAreaGradoDto);
    const result = await this.etapaAreaGradoRepositorio.crearActualizar(
      etapaAreaGradoDto,
      usuarioAuditoria,
    );
    return { id: result.id };
  }

  async actualizar(
    id: string,
    etapaAreaGradoDto: EtapaAreaGradoDto,
    usuarioAuditoria: string,
  ) {
    etapaAreaGradoDto.id = id;

    await this.validar(etapaAreaGradoDto);
    await this.validarEtapaCerrada(id);
    await this.validarConfiguraciones(etapaAreaGradoDto);
    const result = await this.etapaAreaGradoRepositorio.crearActualizar(
      etapaAreaGradoDto,
      usuarioAuditoria,
    );
    return { id: result.id };
  }

  async validar(etapaAreaGradoDto: EtapaAreaGradoDto) {
    const etapa = await this.etapaRepositorio.buscarPorId(
      etapaAreaGradoDto.idEtapa,
    );
    if (!etapa) {
      throw new EntityNotFoundException(
        `Etapa con id ${etapaAreaGradoDto.idEtapa} no encontrada.`,
      );
    } else if (etapa.estado !== Status.CONFIGURACION_GRADOS) {
      throw new PreconditionFailedException(
        `La etapa debe estar en estado ${Status.CONFIGURACION_GRADOS} para crear y modificar configuraciones.`,
      );
    }
    const area = await this.areaRepositorio.buscarPorId(
      etapaAreaGradoDto.idArea,
    );
    if (!area) {
      throw new EntityNotFoundException(
        `Área con id ${etapaAreaGradoDto.idArea} no encontrado.`,
      );
    }
    const gradoEscolaridad = await this.gradoEscolaridadRepositorio.buscarPorId(
      etapaAreaGradoDto.idGradoEscolar,
    );
    if (!gradoEscolaridad) {
      throw new EntityNotFoundException(
        `Grado escolar con id ${etapaAreaGradoDto.idGradoEscolar} no encontrado.`,
      );
    }
    const etapasAreasGrados = await this.etapaAreaGradoRepositorio.contarPorIds(
      etapaAreaGradoDto.id,
      etapaAreaGradoDto.idEtapa,
      etapaAreaGradoDto.idArea,
      etapaAreaGradoDto.idGradoEscolar,
    );
    if (etapasAreasGrados > 0) {
      throw new PreconditionFailedException(
        `La etapa = ${etapa.nombre}, area = ${area.nombre} y grado escolar = ${gradoEscolaridad.nombre}; Ya se encuentra registrada.`,
      );
    }

    // validaciones medallero y clasificacion
    await this.validarMedallero(etapaAreaGradoDto);

    return true;
  }

  async validarMedallero(params: EtapaAreaGradoDto) {
    // validaciones clasificación
    // if (params.criterioCalificacion && !params.puntajeMinimoClasificacion) {
    //   throw new PreconditionFailedException(
    //     `El puntaje mínimo de calificación es requerido`,
    //   );
    // }
    if (!(params.criterioCalificacion || params.criterioMedallero)) {
      throw new PreconditionFailedException(
        `Se debe seleccionar al menos un criterio de clasificación`,
      );
    }

    // validaciones medallero
    if (params.nroPosicionesRural > params.nroPosicionesTotal) {
      throw new PreconditionFailedException(
        `El número de posiciones rurales debe ser menor o igual a la cantidad de posiciones`,
      );
    }

    // validaciones medalleroPosicion
    const itemsMP = params.medalleroPosicion;
    if (itemsMP.length < 1) {
      throw new PreconditionFailedException(
        `El medallero debe tener al menos una posición`,
      );
    }
    if (parseInt(params.nroPosicionesTotal) !== itemsMP.length) {
      throw new PreconditionFailedException(
        `La cantidad de medallero posición debe ser igual al número posiciones`,
      );
    }
    for (const i in itemsMP) {
      const posicion = parseInt(i) + 1;
      if (parseInt(itemsMP[i].ordenGalardon) !== posicion) {
        throw new PreconditionFailedException(
          `Medallero - Posición ${posicion} - Orden galardon le corresponde la posición ${posicion}`,
        );
      }
    }

    // validaciones medalleroPosicionRural
    const itemsMPR = params.medalleroPosicionRural;
    if (parseInt(params.nroPosicionesRural) !== itemsMPR.length) {
      throw new PreconditionFailedException(
        `La cantidad de medallero posición rural debe ser igual al número posiciones rurales`,
      );
    }
    let maximo = 0;
    const minimo = parseInt(params.nroPosicionesTotal);
    for (const i in itemsMPR) {
      const posicion = parseInt(i) + 1;
      const posicionMinima = parseInt(itemsMPR[i].posicionMinima);
      const posicionMaxima = parseInt(itemsMPR[i].posicionMaxima);
      if (parseInt(itemsMPR[i].orden) !== posicion) {
        throw new PreconditionFailedException(
          `Medallero rural - Posición ${posicion} - Orden galardon le corresponde la posición ${posicion}`,
        );
      }
      if (posicionMaxima > posicionMinima) {
        throw new PreconditionFailedException(
          `Medallero rural - Posición ${posicion} - Posición mínima (${posicionMinima}) debe ser mayor o igual Posición máxima (${posicionMaxima})`,
        );
      }
      if (posicionMaxima <= maximo) {
        throw new PreconditionFailedException(
          `Medallero rural - Posición ${posicion} - Posición máxima (${posicionMaxima}) debe ser mayor a la Posición ${
            posicion - 1
          } - Posición mínima (${minimo})`,
        );
      }
      if (posicionMinima > minimo) {
        throw new PreconditionFailedException(
          `Medallero rural - Posición ${posicion} - Posición mínima (${posicionMinima}) debe ser menor o igual al número de posiciones en el medallero (${maximo})`,
        );
      }
      maximo = posicionMinima;
    }

    return true;
  }

  async validarConfiguraciones(etapaAreaGradoDto: EtapaAreaGradoDto) {
    if (
      parseInt(etapaAreaGradoDto.totalPreguntas) < 0 ||
      parseInt(etapaAreaGradoDto.preguntasCurricula) < 0 ||
      parseInt(etapaAreaGradoDto.preguntasOlimpiada) < 0 ||
      parseInt(etapaAreaGradoDto.preguntasCurriculaBaja) < 0 ||
      parseInt(etapaAreaGradoDto.preguntasCurriculaMedia) < 0 ||
      parseInt(etapaAreaGradoDto.preguntasCurriculaAlta) < 0 ||
      parseInt(etapaAreaGradoDto.preguntasOlimpiadaBaja) < 0 ||
      parseInt(etapaAreaGradoDto.preguntasOlimpiadaMedia) < 0 ||
      parseInt(etapaAreaGradoDto.preguntasOlimpiadaAlta) < 0
    ) {
      throw new PreconditionFailedException(
        `Las preguntas no deben tener un valor negativo.`,
      );
    }

    if (
      parseFloat(etapaAreaGradoDto.puntosPreguntaCurricula) < 0 ||
      parseFloat(etapaAreaGradoDto.puntajeCurriculaBaja) < 0 ||
      parseFloat(etapaAreaGradoDto.puntajeCurriculaMedia) < 0 ||
      parseFloat(etapaAreaGradoDto.puntajeCurriculaAlta) < 0 ||
      parseFloat(etapaAreaGradoDto.puntosPreguntaOlimpiada) < 0 ||
      parseFloat(etapaAreaGradoDto.puntajeOlimpiadaBaja) < 0 ||
      parseFloat(etapaAreaGradoDto.puntajeOlimpiadaMedia) < 0 ||
      parseFloat(etapaAreaGradoDto.puntajeOlimpiadaAlta) < 0
    ) {
      throw new PreconditionFailedException(
        `Los puntajes no deben tener un valor negativo.`,
      );
    }

    if (parseFloat(etapaAreaGradoDto.duracionMinutos) < 0) {
      throw new PreconditionFailedException(
        `La duración en minutos no puede ser negativa.`,
      );
    }

    if (
      parseInt(etapaAreaGradoDto.totalPreguntas) !==
      parseInt(etapaAreaGradoDto.preguntasCurricula) +
        parseInt(etapaAreaGradoDto.preguntasOlimpiada)
    ) {
      throw new PreconditionFailedException(
        `Las preguntas de curricula y de olimpiada debe ser igual al total preguntas.`,
      );
    }

    if (
      parseInt(etapaAreaGradoDto.preguntasCurricula) !==
      parseInt(etapaAreaGradoDto.preguntasCurriculaBaja) +
        parseInt(etapaAreaGradoDto.preguntasCurriculaMedia) +
        parseInt(etapaAreaGradoDto.preguntasCurriculaAlta)
    ) {
      throw new PreconditionFailedException(
        `Las preguntas de curricula baja, media y alta debe ser igual al total preguntas curricula.`,
      );
    }

    if (
      parseInt(etapaAreaGradoDto.preguntasOlimpiada) !==
      parseInt(etapaAreaGradoDto.preguntasOlimpiadaBaja) +
        parseInt(etapaAreaGradoDto.preguntasOlimpiadaMedia) +
        parseInt(etapaAreaGradoDto.preguntasOlimpiadaAlta)
    ) {
      throw new PreconditionFailedException(
        `Las preguntas de olimpiada baja, media y alta debe ser igual al total preguntas olimpiada.`,
      );
    }

    if (
      TotalPuntaje !==
      parseFloat(etapaAreaGradoDto.puntosPreguntaCurricula) +
        parseFloat(etapaAreaGradoDto.puntosPreguntaOlimpiada)
    ) {
      throw new PreconditionFailedException(
        `Las preguntas de curricula y de olimpiada debe ser igual a ${TotalPuntaje}.`,
      );
    }

    if (
      Math.round(parseFloat(etapaAreaGradoDto.puntosPreguntaCurricula)) !=
      Math.round(
        parseFloat(etapaAreaGradoDto.puntajeCurriculaBaja) *
          parseFloat(etapaAreaGradoDto.preguntasCurriculaBaja) +
          parseFloat(etapaAreaGradoDto.puntajeCurriculaMedia) *
            parseFloat(etapaAreaGradoDto.preguntasCurriculaMedia) +
          parseFloat(etapaAreaGradoDto.puntajeCurriculaAlta) *
            parseFloat(etapaAreaGradoDto.preguntasCurriculaAlta),
      )
    ) {
      throw new PreconditionFailedException(
        `La suma del puntaje de curricula baja, media y alta debe ser igual al total puntaje curricula.`,
      );
    }

    if (
      Math.round(parseFloat(etapaAreaGradoDto.puntosPreguntaOlimpiada)) !=
      Math.round(
        parseFloat(etapaAreaGradoDto.puntajeOlimpiadaBaja) *
          parseFloat(etapaAreaGradoDto.preguntasOlimpiadaBaja) +
          parseFloat(etapaAreaGradoDto.puntajeOlimpiadaMedia) *
            parseFloat(etapaAreaGradoDto.preguntasOlimpiadaMedia) +
          parseFloat(etapaAreaGradoDto.puntajeOlimpiadaAlta) *
            parseFloat(etapaAreaGradoDto.preguntasOlimpiadaAlta),
      )
    ) {
      throw new PreconditionFailedException(
        `la suma del puntaje de olimpiada baja, media y alta debe ser igual al total puntaje olimpiada.`,
      );
    }

    return true;
  }

  async activar(id: string, usuarioAuditoria: string) {
    await this.validarEtapaCerrada(id);
    await this.etapaAreaGradoRepositorio.actualizarEstado(
      id,
      Status.ACTIVE,
      usuarioAuditoria,
    );
    return { id };
  }

  async inactivar(id: string, usuarioAuditoria: string) {
    await this.validarEtapaCerrada(id);
    await this.etapaAreaGradoRepositorio.actualizarEstado(
      id,
      Status.INACTIVE,
      usuarioAuditoria,
    );
    return { id };
  }

  async validarEtapaCerrada(id: string) {
    const etapaAreaGrado = await this.etapaAreaGradoRepositorio.buscarPorId(id);
    if (!etapaAreaGrado) {
      throw new EntityNotFoundException(
        `Etapa - area - grado con id ${id} no encontrado.`,
      );
    }
    if (etapaAreaGrado.etapa.estado === Status.CLOSED) {
      throw new PreconditionFailedException(
        `La etapa se encuentra CERRADA, no se puede hacer modificaciones.`,
      );
    }
  }

  async eliminar(id: string) {
    const etapaAreaGrado = await this.etapaAreaGradoRepositorio.buscarPorId(id);
    if (!etapaAreaGrado) {
      throw new EntityNotFoundException(
        `Etapa - area - grado con id ${id} no encontrado.`,
      );
    }
    if (etapaAreaGrado.etapa?.estado !== Status.CONFIGURACION_GRADOS) {
      throw new PreconditionFailedException(
        `No se puede eliminar etapa-area-grado en estado ${etapaAreaGrado.etapa?.estado}`,
      );
    }
    const resultCal = await this.calendarioRepositorio.contarPorIdEtapaAreaGrado(
      id,
    );
    if (resultCal > 0) {
      throw new PreconditionFailedException(
        `No se puede eliminar, el etapa-area-grado tiene calendario registrado`,
      );
    }
    const resultIns = await this.inscripcionRepositorio.contarPorIdEtapaAreaGrado(
      id,
    );
    if (resultIns > 0) {
      throw new PreconditionFailedException(
        `No se puede eliminar, el etapa-area-grado tiene inscripciones registradas`,
      );
    }
    const resultPreg = await this.preguntaRepositorio.contarPorIdEtapaAreaGrado(
      id,
    );
    if (resultPreg > 0) {
      throw new PreconditionFailedException(
        `No se puede eliminar, el etapa-area-grado tiene preguntas registradas`,
      );
    }
    const op = async (transaction) => {
      const repositoryMedalleroPosicion = transaction.getCustomRepository(
        MedalleroPosicionRepository,
      );
      await repositoryMedalleroPosicion.delete({ idEtapaAreaGrado: id });

      const repositoryMedalleroPosicionRural = transaction.getCustomRepository(
        MedalleroPosicionRuralRepository,
      );
      await repositoryMedalleroPosicionRural.delete({ idEtapaAreaGrado: id });

      const repositoryEtapaAreaGrado = transaction.getCustomRepository(
        EtapaAreaGradoRepository,
      );
      await repositoryEtapaAreaGrado.eliminar(etapaAreaGrado);
    };
    await this.etapaAreaGradoRepositorio.runTransaction(op);
  }

  async listarEtapaAreaGradoPorEtapa(idEtapa: string, nivel: string) {
    const result = await this.etapaAreaGradoRepositorio.listarEtapaAreaGradoPorEtapa(
      idEtapa,
      nivel,
    );
    return totalRowsResponse(result);
  }

  async listarParametrosEtapaAreaGradoPorEtapa(idEtapa: string) {
    const result = await this.etapaAreaGradoRepositorio.listarParametrosEtapaAreaGradoPorEtapa(
      idEtapa,
    );
    return result;
  }

  async obtenerIdOlimpiada(idEtapaAreaGrado: string) {
    const result = await this.etapaAreaGradoRepositorio.obtenerIdOlimpiada(
      idEtapaAreaGrado,
    );
    return result;
  }

  /**
   * Metodo para adicionar idOlimpiada al objeto paginacionQueryDto
   * @param idEtapaAreaGrado, paginacionQueryDto
   */
  async adicionarIdOlimpiada(idEtapaAreaGrado: string, query: any) {
    const { filtro } = query;
    let id: string;
    const params = filtro ? GetJsonData(filtro) : {};
    if (idEtapaAreaGrado) {
      // buscar idOlimpiada del params
      id = idEtapaAreaGrado;
    } else {
      // buscar idOlimpiada de los filtros
      if (!filtro) {
        throw new PreconditionFailedException('Debe seleccionar un area.');
      }
      if (!params.idEtapaAreaGrado) {
        throw new PreconditionFailedException(
          'Etapa, area, grado no encontrado.',
        );
      }
      id = params.idEtapaAreaGrado;
    }
    const etapaAreaGrado = await this.obtenerIdOlimpiada(id);
    params.idOlimpiada = etapaAreaGrado.etapa.olimpiada.id;
    query.filtro = ConvertJsonToFiltroQuery(params);
    return query;
  }
}
