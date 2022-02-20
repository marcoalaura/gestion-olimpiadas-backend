import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';

import { EtapaRepository } from '../repository/etapa.repository';
import { OlimpiadaRepository } from '../olimpiada.repository';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { InscripcionRepository } from '../repository/inscripcion.repository';
import { EtapaDto } from '../dto/etapa.dto';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { totalRowsResponse } from '../../../common/lib/http.module';
import {
  Status,
  EtapaDescripcion,
  tiposEtapa,
  ArrayMaquinaEstados,
} from '../../../common/constants';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';
import { maquinaEstadosEtapa } from '../../../common/lib/maquinaEstados.module';
import {
  ConvertJsonToFiltroQuery,
  GetJsonData,
} from '../../../common/lib/json.module';

dayjs.extend(isBetween);
@Injectable()
export class EtapaService {
  constructor(
    @InjectRepository(EtapaRepository)
    private etapaRepositorio: EtapaRepository,
    @InjectRepository(OlimpiadaRepository)
    private olimpiadaRepositorio: OlimpiadaRepository,
    @InjectRepository(EtapaAreaGradoRepository)
    private etapaAreaGradoRepositorio: EtapaAreaGradoRepository,
  ) {}

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const etapas = await this.etapaRepositorio.listar(paginacionQueryDto);
    const result: any = totalRowsResponse(etapas);
    for (const etapa of result.filas) {
      etapa.estadoDescripcion = EtapaDescripcion[etapa.estado];
      etapa.operacion = maquinaEstadosEtapa(etapa.estado).getTransitions()[0];
      etapa.estadoCambio = etapa.operacion
        ? maquinaEstadosEtapa(etapa.estado).executeTransition(etapa.operacion)
        : 'CERRADO';
    }
    return result;
  }

  async buscarPorId(id: string) {
    const etapa = await this.etapaRepositorio.buscarPorId(id);
    if (!etapa) {
      throw new EntityNotFoundException(`Etapa con id ${id} no encontrado.`);
    }
    return etapa;
  }

  async crear(etapaDto: EtapaDto, usuarioAuditoria: string) {
    etapaDto.id = null;
    await this.validar(etapaDto);
    const result = await this.etapaRepositorio.crearActualizar(
      etapaDto,
      usuarioAuditoria,
    );
    return { id: result.id };
  }

  async actualizar(id: string, etapaDto: EtapaDto, usuarioAuditoria: string) {
    const etapa = await this.etapaRepositorio.buscarPorId(id);
    if (!etapa) {
      throw new EntityNotFoundException(`Etapa con id ${id} no encontrado.`);
    }
    if (etapa) {
      if (etapa.estado !== Status.ACTIVE) {
        throw new PreconditionFailedException(
          `Solo se puede modificar una etapa cuando se encuentre en estado ${Status.ACTIVE}.`,
        );
      }
    }
    etapaDto.id = id;
    await this.validar(etapaDto);
    const result = await this.etapaRepositorio.crearActualizar(
      etapaDto,
      usuarioAuditoria,
    );
    return { id: result.id };
  }

  async validar(etapaDto: EtapaDto) {
    const olimpiada = await this.olimpiadaRepositorio.buscarPorId(
      etapaDto.idOlimpiada,
    );
    if (!olimpiada) {
      throw new EntityNotFoundException(
        `Olimpiada con id ${etapaDto.idOlimpiada} no encontrado.`,
      );
    }
    if (olimpiada.estado !== Status.ACTIVE) {
      throw new PreconditionFailedException(
        `No se puede crear o modificar etapas, la competencia esta en estado ${olimpiada.estado}.`,
      );
    }
    const etapasJerarquia = await this.etapaRepositorio.contarPorTipo(
      etapaDto.idOlimpiada,
      etapaDto.tipo,
      etapaDto.id,
    );
    if (etapasJerarquia > 0) {
      throw new PreconditionFailedException(
        `Otra etapa con tipo ${etapaDto.tipo}, ya se encuentra registrada`,
      );
    }
    if (etapaDto.fechaInicio && etapaDto.fechaFin) {
      // Etapas dentro del rango de fechas de la olimpiada
      if (
        dayjs(olimpiada.fechaInicio) > dayjs(etapaDto.fechaInicio) ||
        dayjs(olimpiada.fechaInicio) > dayjs(etapaDto.fechaFin) ||
        dayjs(olimpiada.fechaFin) < dayjs(etapaDto.fechaInicio) ||
        dayjs(olimpiada.fechaFin) < dayjs(etapaDto.fechaFin)
      ) {
        throw new PreconditionFailedException(
          `Las fechas de la etapa, deben estar dentro del rango de fechas de la competencia.`,
        );
      }
      if (dayjs(etapaDto.fechaFin) < dayjs(etapaDto.fechaInicio)) {
        throw new PreconditionFailedException(
          `La fecha final de etapa no puede ser menor a la fecha de inicio de etapa.`,
        );
      }
      // Validamos que no se cree o modifique una Etapa con fecha pasada
      if (
        dayjs(
          //etapaDto.fechaFinImpugnacion ? etapaDto.fechaFinImpugnacion : etapaDto.fechaFin,
          etapaDto.fechaFin,
        )
          .add(23, 'h')
          .add(59, 'm') < dayjs()
      ) {
        throw new PreconditionFailedException(
          `No se puede crear o modificar una etapa con fecha pasada.`,
        );
      }
      // Validamos que la etapa no cruce con otras etapas de la misma olimpiada
      const etapasCruzadas = await this.etapaRepositorio.contarEtapasCruzadas(
        etapaDto.idOlimpiada,
        etapaDto.fechaInicio,
        // etapaDto.fechaFinImpugnacion || etapaDto.fechaFin,
        etapaDto.fechaFin,
        etapaDto.id,
      );
      if (etapasCruzadas > 0) {
        throw new PreconditionFailedException(
          `Existe una etapa que cruza con el presente registro.`,
        );
      }
      const etapasAnteriores = await this.etapaRepositorio.contarEtapasAnteriores(
        etapaDto.idOlimpiada,
        etapaDto.fechaInicio,
        etapaDto.id,
      );
      if (etapasAnteriores > 0) {
        throw new PreconditionFailedException(
          `Existe una etapa anterior, que cruza con el presente registro.`,
        );
      }
      const etapasPosteriores = await this.etapaRepositorio.contarEtapasPosteriores(
        etapaDto.idOlimpiada,
        // etapaDto.fechaFinImpugnacion || etapaDto.fechaFin,
        etapaDto.fechaFin,
        etapaDto.id,
      );
      if (etapasPosteriores > 0) {
        throw new PreconditionFailedException(
          `Existe una etapa posterior, que cruza con el presente registro.`,
        );
      }
      const etapasRompenOrden = await this.etapaRepositorio.contarEtapasRompenOrden(
        etapaDto.idOlimpiada,
        etapaDto.fechaInicio,
        etapaDto.tipo,
        etapaDto.id,
      );
      if (etapasRompenOrden > 0) {
        throw new PreconditionFailedException(
          `Debe ingresar etapas que cumplan el siguiente orden según las fechas registradas: Distrital - Departamental - Nacional.`,
        );
      }
    }

    /*if (etapaDto.fechaInicioImpugnacion && etapaDto.fechaFinImpugnacion) {
      // Fechas de la inpugnación dentro del rango de fechas de la olimpiada
      if (
        dayjs(olimpiada.fechaInicio) > dayjs(etapaDto.fechaInicioImpugnacion) ||
        dayjs(olimpiada.fechaInicio) > dayjs(etapaDto.fechaFinImpugnacion) ||
        dayjs(olimpiada.fechaFin) < dayjs(etapaDto.fechaInicioImpugnacion) ||
        dayjs(olimpiada.fechaFin) < dayjs(etapaDto.fechaFinImpugnacion)
      ) {
        throw new PreconditionFailedException(
          `Las fechas de inpugnación de la etapa, deben estar dentro del rango de fechas de la competencia.`,
        );
      }
      if (
        dayjs(etapaDto.fechaFinImpugnacion) <
        dayjs(etapaDto.fechaInicioImpugnacion)
      ) {
        throw new PreconditionFailedException(
          `La fecha final de impugnación no puede ser menor a la fecha de inicio de impugnación.`,
        );
      }
    }
    if (
      etapaDto.fechaInicio &&
      etapaDto.fechaFin &&
      etapaDto.fechaInicioImpugnacion &&
      etapaDto.fechaFinImpugnacion
    ) {
      if (dayjs(etapaDto.fechaFin) > dayjs(etapaDto.fechaInicioImpugnacion)) {
        throw new PreconditionFailedException(
          `La fecha de inicio de impugnación debe ser posterior a la fecha final de etapa.`,
        );
      }
    }*/
    return true;
  }

  async cerrar(id: string, usuarioAuditoria: string) {
    const etapa = await this.etapaRepositorio.buscarPorId(id);
    if (etapa) {
      if (etapa.estado === Status.CLOSED) {
        throw new PreconditionFailedException(
          `La etapa ya se encuentra CERRADA.`,
        );
      }
      // Falta comprobar que se haya registrado todas las configuraciones de medalleros, calendario, clasificación y exámenes
      // Falta consultar todas las areas y grados registradas en esta etapa y que tengan configuración minima
      await this.etapaRepositorio.actualizarEstado(
        id,
        Status.CLOSED,
        usuarioAuditoria,
      );
      return { id };
    }
    throw new EntityNotFoundException(`Etapa con id ${id} no encontrado.`);
  }

  async eliminar(id: string) {
    const etapa = await this.etapaRepositorio.buscarPorId(id);
    if (!etapa) {
      throw new EntityNotFoundException(`Etapa con id ${id} no encontrado.`);
    }
    if (dayjs(etapa.fechaInicio) <= dayjs()) {
      throw new PreconditionFailedException(
        `No puedes eliminar una etapa que ya inicio.`,
      );
    }
    if (etapa.estado !== Status.ACTIVE) {
      throw new PreconditionFailedException(
        `Sólo se puede eliminar una etapa cuando se encuentre en estado ${Status.ACTIVE}.`,
      );
    }
    const result = await this.etapaAreaGradoRepositorio.contarPorIdEtapa(id);
    if (result > 0) {
      throw new PreconditionFailedException(
        `No se puede eliminar, la etapa tiene etapas-areas-grados registradas`,
      );
    }
    return this.etapaRepositorio.eliminar(etapa);
  }

  /**
   * Metodo para listar etapas por olimpiada
   * @param idOlimpiada identificador de la olimpiada
   * @returns Object objeto con los datos de la olimpiada
   */
  async listarEtapasPorOlimpiada(idOlimpiada: string, nivel: any) {
    const etapas = await this.etapaRepositorio.listarEtapasPorOlimpiada(
      idOlimpiada,
      nivel,
    );
    const result: any = totalRowsResponse(etapas);

    for (const etapa of result.filas) {
      etapa.estadoDescripcion = EtapaDescripcion[etapa.estado];
      etapa.operacion = maquinaEstadosEtapa(etapa.estado).getTransitions()[0];
      etapa.fechaInicioMilis = dayjs(etapa.fechaInicio)
        .startOf('date')
        .valueOf();
      etapa.fechaFinMilis = dayjs(etapa.fechaFin).endOf('date').valueOf();
      etapa.estadoCambio = etapa.operacion
        ? maquinaEstadosEtapa(etapa.estado).executeTransition(etapa.operacion)
        : 'CERRADO';
    }
    return result;
  }

  /**
   * Metodo publico para listar etapas por olimpiada
   * @param idOlimpiada identificador de la olimpiada
   * @returns Object objeto con los datos de la olimpiada
   */
  async listarEtapasPorOlimpiadaPublico(idOlimpiada: string, nivel: any) {
    const etapas = await this.etapaRepositorio.listarEtapasPorOlimpiadaPublico(
      idOlimpiada,
      nivel,
    );
    const result: any = totalRowsResponse(etapas);
    return result;
  }

  /**
   * Metodo para validar si una etapa esta vigente (se verifica desde una etapa-area-grado)
   * @param idEtapaAreaGrado identificadir de etapa-area-grado
   */
  async validarVigenciaDeLaEtapa(idEtapaAreaGrado: string, hitos: any) {
    const result = await this.etapaRepositorio.obtenerEtapaPorEtapaAreaGrado(
      idEtapaAreaGrado,
    );
    console.log('[validarVigenciaDeLaEtapa] etapa', result);
    const { etapa } = result || {};
    if (!etapa) {
      throw new NotFoundException();
    }

    if (
      !dayjs().isBetween(
        dayjs(etapa?.fechaInicio).startOf('date'),
        dayjs(etapa?.fechaFin).endOf('date'),
      )
    ) {
      throw new PreconditionFailedException(
        `No se puede realizar la acción, la etapa ${etapa?.nombre} no esta en un periodo vigente`,
      );
    }
    // validar estado de los hitos
    if (hitos.indexOf(etapa?.estado) < 0) {
      throw new PreconditionFailedException(
        `No se puede realizar la acción, la etapa ${etapa?.nombre} se encuentra en estado: ${etapa?.estado}`,
      );
    }
  }

  async obtenerEtapaVigente(idEtapa: string, hitos: any) {
    const etapa = await this.etapaRepositorio.buscarPorId(idEtapa);
    if (!etapa) {
      throw new NotFoundException('No se encontro la etapa');
    }
    if (
      !dayjs().isBetween(
        dayjs(etapa.fechaInicio).startOf('date'),
        dayjs(etapa.fechaFin).endOf('date'),
      )
    ) {
      throw new PreconditionFailedException(
        `No se puede realizar la acción, la etapa ${etapa.nombre} no esta vigente`,
      );
    }
    // validar estado de los hitos
    if (hitos.indexOf(etapa?.estado) < 0) {
      throw new PreconditionFailedException(
        `No se puede realizar la acción, la etapa ${etapa?.nombre} se encuentra en estado: ${etapa?.estado}`,
      );
    }
    return etapa;
  }

  async validarConfiguracionGrados(idEtapa: string) {
    const configuracionEAG = await this.etapaRepositorio.contarEtapaAreaGradoPorEtapa(
      idEtapa,
    );
    if (configuracionEAG === 0) {
      throw new PreconditionFailedException(
        `No se puede realizar el cambio de estado a la Etapa, no existe registro de al menos una etapa-area-grado`,
      );
    }

    const configuracionesEAG = await this.etapaAreaGradoRepositorio.obtenerConfiguracion(
      idEtapa,
    );

    configuracionesEAG.forEach((item) => {
      if (parseInt(item.totalPreguntas) < 3) {
        throw new PreconditionFailedException(
          `No se puede realizar el cambio de estado a la Etapa,
           el área ${item.nombre_area} y grado de escolaridad ${item.nombre_grado} cuenta con una configuración de total de preguntas menor a 3`,
        );
      }
      if (
        parseInt(item.preguntasCurricula) +
          parseInt(item.preguntasOlimpiada) ===
        0
      ) {
        throw new PreconditionFailedException(
          `No se puede realizar el cambio de estado a la Etapa,
           el área ${item.nombre_area} y grado de escolaridad ${item.nombre_grado} no cuenta con una configuración de preguntas adecuada`,
        );
      }
      if (
        parseInt(item.puntosPreguntaCurricula) +
          parseInt(item.puntosPreguntaOlimpiada) ===
        0
      ) {
        throw new PreconditionFailedException(
          `No se puede realizar el cambio de estado a la Etapa,
           el área ${item.nombre_area} y grado de escolaridad ${item.nombre_grado} no cuenta con una configuración de puntaje adecuada`,
        );
      }
      if (parseInt(item.nroPosicionesTotal) === 0) {
        throw new PreconditionFailedException(
          `No se puede realizar el cambio de estado a la Etapa,
           el área ${item.nombre_area} y grado de escolaridad ${item.nombre_grado} no cuenta con un número de posición total`,
        );
      }
      if (parseInt(item.duracionMinutos) === 0) {
        throw new PreconditionFailedException(
          `No se puede realizar el cambio de estado a la Etapa,
           el área ${item.nombre_area} y grado de escolaridad ${item.nombre_grado} no cuenta con configuración de duración de minutos`,
        );
      }
      if (
        item.criterioCalificacion &&
        parseInt(item.puntajeMinimoClasificacion) === 0
      ) {
        throw new PreconditionFailedException(
          `No se puede realizar el cambio de estado a la Etapa,
           el área ${item.nombre_area} y grado de escolaridad ${item.nombre_grado} no cuenta con configuración de puntaje mínimo de clasificación`,
        );
      }
      if (
        item.criterioMedallero &&
        parseInt(item.puntajeMinimoMedallero) === 0
      ) {
        throw new PreconditionFailedException(
          `No se puede realizar el cambio de estado a la Etapa,
           el área ${item.nombre_area} y grado de escolaridad ${item.nombre_grado} no cuenta con configuración de puntaje mínimo de medallero`,
        );
      }
      if (parseInt(item.medallero) === 0) {
        throw new PreconditionFailedException(
          `No se puede realizar el cambio de estado a la Etapa,
           el área ${item.nombre_area} y grado de escolaridad ${item.nombre_grado} no cuenta con configuración de posiciones de medallero`,
        );
      }
    });
  }

  async validarRegistroInscritos(idEtapa: string) {
    const etapa = await this.etapaRepositorio.buscarPorId(idEtapa);

    const configuracionesEAG = await this.etapaAreaGradoRepositorio.obtenerConfiguracion(
      idEtapa,
    );

    configuracionesEAG.forEach((item) => {
      if (
        parseInt(item.inscripcion) === 0 &&
        etapa.tipo === tiposEtapa.DISTRITAL
      ) {
        throw new PreconditionFailedException(
          `No se puede realizar el cambio de estado a la Etapa,
           el área ${item.nombre_area} y grado de escolaridad ${item.nombre_grado} no cuenta con estudiantes inscritos`,
        );
      }
    });
  }

  async validarConfiguracionCalendario(idEtapa: string) {
    const configuracionesEAG = await this.etapaAreaGradoRepositorio.obtenerConfiguracionCalendario(
      idEtapa,
    );

    configuracionesEAG.forEach((item) => {
      if (parseInt(item.calendario) === 0) {
        throw new PreconditionFailedException(
          `No se puede realizar el cambio de estado a la Etapa,
           el área ${item.nombre_area} y grado de escolaridad ${item.nombre_grado} no cuenta con calendario registrado`,
        );
      }
      // Validamos que se cuente con los calendarios necesario segun tipo y cronograma
      if (item.calendarioTipo.search('ONLINE-CRONOGRAMA') === -1)
        throw new PreconditionFailedException(
          `No se puede realizar el cambio de estado a la Etapa,
           el área ${item.nombre_area} y grado de escolaridad ${item.nombre_grado} no cuenta con calendario ONLINE de tipo CRONOGRAMA`,
        );
      if (item.calendarioTipo.search('ONLINE-REZAGADO') === -1)
        throw new PreconditionFailedException(
          `No se puede realizar el cambio de estado a la Etapa,
           el área ${item.nombre_area} y grado de escolaridad ${item.nombre_grado} no cuenta con calendario ONLINE de tipo REZAGADO`,
        );
      if (item.calendarioTipo.search('OFFLINE-CRONOGRAMA') === -1)
        throw new PreconditionFailedException(
          `No se puede realizar el cambio de estado a la Etapa,
           el área ${item.nombre_area} y grado de escolaridad ${item.nombre_grado} no cuenta con calendario OFFLINE de tipo CRONOGRAMA`,
        );
    });
  }

  async cargarClasificadosSiguienteEtapa(
    idEtapa: string,
    usuarioAuditoria: string,
    transaction: any,
  ) {
    const etapa = await this.etapaRepositorio.buscarPorId(idEtapa);
    if (
      etapa.tipo === tiposEtapa.DISTRITAL ||
      etapa.tipo === tiposEtapa.DEPARTAMENTAL
    ) {
      let nuevoTipo = '';
      if (etapa.tipo === tiposEtapa.DISTRITAL)
        nuevoTipo = tiposEtapa.DEPARTAMENTAL;
      if (etapa.tipo === tiposEtapa.DEPARTAMENTAL)
        nuevoTipo = tiposEtapa.NACIONAL;

      const nuevaEtapa = await this.etapaRepositorio.buscarPorIdOlimpiadaTipo(
        etapa.olimpiada.id,
        nuevoTipo,
      );
      const etapaAreaGrados = await this.etapaAreaGradoRepositorio.listarEtapaAreaGradoPorEtapa(
        idEtapa,
      );
      if (nuevaEtapa) {
        // Registramos inscritos por idEtapaAreaGrado
        for (const etapaAreaGrado of etapaAreaGrados[0]) {
          const nuevaEtapaAreaGrado = await this.etapaAreaGradoRepositorio.buscarPorIdEtapaIdAreaIdGrado(
            nuevaEtapa.id,
            etapaAreaGrado.area.id,
            etapaAreaGrado.gradoEscolar.id,
          );
          if (nuevaEtapaAreaGrado) {
            // Registramos los inscritos clasificados de una Etapa a la otra
            const inscripcionRep = transaction.getCustomRepository(
              InscripcionRepository,
            );
            // await this.inscripcionRepository.cargarInscritosPorEAG(
            await inscripcionRep.cargarInscritosPorEAG(
              etapaAreaGrado.id,
              nuevaEtapaAreaGrado.id,
              usuarioAuditoria,
            );
          } else {
            throw new PreconditionFailedException(
              `No se ha identificado una EtapaAreaGrado en la etapa ${nuevaEtapa.nombre}, para pasar a los estudiantes clasificados`,
            );
          }
        }
      }
    }
    return '';
  }

  /**
   * Metodo para adicionar idOlimpiada al objeto paginacionQueryDto
   * @param idEtapa, paginacionQueryDto
   */
  async adicionarIdOlimpiada(idEtapa: string, query: any) {
    const { filtro } = query;
    let id: string;
    const params = filtro ? GetJsonData(filtro) : {};
    if (idEtapa) {
      id = idEtapa;
    } else {
      // buscar idOlimpiada de los filtros
      if (!filtro) {
        throw new PreconditionFailedException('Debe seleccionar un area.');
      }
      if (!params.idEtapa) {
        throw new PreconditionFailedException('Etapa no encontrada.');
      }
      id = params.idEtapa;
    }
    const etapa = await this.buscarPorId(id);
    params.idOlimpiada = etapa.olimpiada.id;
    query.filtro = ConvertJsonToFiltroQuery(params);
    return query;
  }

  async habilitarPorEtapaMinima(idEtapa: string, etapaMinima: string) {
    const etapa = await this.etapaRepositorio.buscarPorId(idEtapa);
    if (!etapa) {
      throw new NotFoundException('No se encontró la etapa');
    }
    const posicionEtapaActual = ArrayMaquinaEstados.findIndex(
      (item) => item === etapa.estado,
    );
    const posicionEtapaMinima = ArrayMaquinaEstados.findIndex(
      (item) => item === etapaMinima,
    );
    if (posicionEtapaActual < posicionEtapaMinima) {
      const nombreEtapaMinima = etapaMinima.replace(/_/g, ' ');
      throw new PreconditionFailedException(
        `Este reporte esta habilitado a partir del estado ${nombreEtapaMinima}`,
      );
    }
  }
}
