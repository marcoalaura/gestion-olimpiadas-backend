import { Injectable, Query, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import * as minMax from 'dayjs/plugin/minMax';
dayjs.extend(minMax);
import * as isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

import { OlimpiadaRepository } from './olimpiada.repository';
import { OlimpiadaDto, OlimpiadaActualizacionDto } from './dto/olimpiada.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TotalRowsResponseDto } from '../../common/dto/total-rows-response.dto';
import { totalRowsResponse } from '../../common/lib/http.module';
import { Status } from '../../common/constants';
import { PaginacionQueryDto } from '../../common/dto/paginacion-query.dto';
import { EntityNotFoundException } from '../../common/exceptions/entity-not-found.exception';
import {
  ConvertJsonToFiltroQuery,
  GetJsonData,
} from '../../common/lib/json.module';
import { FileService } from '../../../libs/file/src';

@Injectable()
export class OlimpiadaService {
  constructor(
    @InjectRepository(OlimpiadaRepository)
    private olimpiadaRepositorio: OlimpiadaRepository,
    private fileService: FileService,
  ) {}

  async recuperar(
    @Query() paginacionQueryDto: PaginacionQueryDto,
    id: string,
    idRol: string,
    rol: string,
  ): Promise<TotalRowsResponseDto> {
    const resultado = await this.olimpiadaRepositorio.listar(
      paginacionQueryDto,
      id,
      idRol,
      rol,
    );
    return totalRowsResponse(resultado);
  }

  // listar bandeja super usuario
  async listar(
    @Query() paginacionQueryDto: PaginacionQueryDto,
    id: string,
    idRol: string,
    rol: string,
  ): Promise<TotalRowsResponseDto> {
    const resultado = await this.olimpiadaRepositorio.listarBandeja(
      paginacionQueryDto,
      id,
      idRol,
      rol,
    );
    return totalRowsResponse(resultado);
  }

  async recuperarPublico(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const resultado = await this.olimpiadaRepositorio.listarPublico(
      paginacionQueryDto,
    );
    return totalRowsResponse(resultado);
  }

  async buscarPorId(id: string): Promise<any> {
    const olimpiada = await this.olimpiadaRepositorio.buscarPorId(id);
    if (!olimpiada) {
      throw new EntityNotFoundException(
        `Competencia con id ${id} no encontrado`,
      );
    }
    return olimpiada;
  }

  async crear(olimpiadaDto: OlimpiadaDto, usuarioAuditoria: string) {
    let olimpiada_ = await this.olimpiadaRepositorio.buscarPorNombre(
      olimpiadaDto.nombre.trim(),
    );
    if (olimpiada_) {
      throw new PreconditionFailedException(
        'Ya existe una competencia con el mismo nombre',
      );
    }
    olimpiada_ = await this.olimpiadaRepositorio.buscarPorSigla(
      olimpiadaDto.sigla.trim(),
    );
    if (olimpiada_) {
      throw new PreconditionFailedException(
        'Ya existe una competencia con la misma sigla',
      );
    }
    if (dayjs(olimpiadaDto.fechaInicio).add(23, 'h').add(59, 'm') < dayjs()) {
      throw new PreconditionFailedException(
        `No puedes registrar una Olimpiada con fecha inicio anterior a la fecha actual.`,
      );
    }

    // validar imagen
    if (olimpiadaDto.logo) {
      this.fileService.validarTamanoLogo(olimpiadaDto.logo);
    }

    const olimpiada = await this.olimpiadaRepositorio.crear(
      olimpiadaDto,
      usuarioAuditoria,
    );
    return {
      fechaInicio: olimpiada.fechaInicio,
      fechaFin: olimpiada.fechaFin,
      nombre: olimpiada.nombre,
      gestion: olimpiada.gestion,
      sigla: olimpiada.sigla,
    };
  }

  async actualizar(
    id: string,
    olimpiadaDto: OlimpiadaActualizacionDto,
    usuarioAuditoria: string,
  ) {
    const etapasOlimpiada = await this.olimpiadaRepositorio.etapasOlimpiada(id);
    if (etapasOlimpiada?.length > 0) {
      const fechasEtapas = [];
      for (const etapaOlimpiada of etapasOlimpiada) {
        fechasEtapas.push(dayjs(etapaOlimpiada.fechaInicio));
        fechasEtapas.push(dayjs(etapaOlimpiada.fechaFin));
        // fechasEtapas.push(dayjs(etapaOlimpiada.fechaInicioImpugnacion));
        // fechasEtapas.push(dayjs(etapaOlimpiada.fechaFinImpugnacion));
      }
      const fechaMinima = dayjs.min(fechasEtapas);
      const fechaMaxima = dayjs.max(fechasEtapas);
      if (dayjs(olimpiadaDto.fechaInicio).isAfter(fechaMinima)) {
        throw new PreconditionFailedException(
          `No se puede actualizar, el campo <b>fecha inicio</b> debe ser menor o igual a  : ${fechaMinima.format(
            'DD-MM-YYYY',
          )} configurado en etapas`,
        );
      }

      if (dayjs(olimpiadaDto.fechaFin).isBefore(fechaMaxima)) {
        throw new PreconditionFailedException(
          `No se puede actualizar, el campo <b>fecha de fin</b> debe ser mayor o igual a  : ${fechaMaxima.format(
            'DD-MM-YYYY',
          )} configurado en etapas`,
        );
      }
    }

    // validar imagen
    if (olimpiadaDto.logo) {
      this.fileService.validarTamanoLogo(olimpiadaDto.logo);
    }

    const olimpiada = await this.olimpiadaRepositorio.actualizar(
      id,
      olimpiadaDto,
      usuarioAuditoria,
    );
    if (!olimpiada) {
      throw new EntityNotFoundException(
        `Competencia con id ${id} no encontrada`,
      );
    }
    return {
      fechaInicio: olimpiada.fechaInicio,
      fechaFin: olimpiada.fechaFin,
      nombre: olimpiada.nombre,
      gestion: olimpiada.gestion,
      sigla: olimpiada.sigla,
    };
  }

  async eliminar(id: string) {
    const olimpiada_ = await this.olimpiadaRepositorio.buscarPorId(id);
    if (!olimpiada_) {
      throw new EntityNotFoundException(
        `Competencia con id ${id} no encontrado`,
      );
    }
    const etapas = await this.olimpiadaRepositorio.etapasOlimpiada(id);
    if (etapas && etapas.length > 0) {
      throw new PreconditionFailedException(
        'No se puede eliminar, la olimpiada tiene etapas registradas',
      );
    }
    return this.olimpiadaRepositorio.eliminar(olimpiada_);
  }

  async activarDesactivar(id: string, estado, usuarioAuditoria: string) {
    const olimpiada_ = await this.olimpiadaRepositorio.buscarPorId(id);
    if (!olimpiada_) {
      throw new EntityNotFoundException(
        `Competencia con id ${id} no encontrado`,
      );
    }
    const etapas = await this.olimpiadaRepositorio.etapasOlimpiada(id);
    if (estado === Status.INACTIVE && etapas && etapas.length > 0) {
      throw new PreconditionFailedException(
        'No se puede inactivar, la olimpiada tiene etapas registradas',
      );
    }
    olimpiada_.usuarioActualizacion = usuarioAuditoria;
    olimpiada_.estado = estado;
    return this.olimpiadaRepositorio.save(olimpiada_);
  }

  adicionarIdOlimpiada(idOlimpiada: string, query: any) {
    const { filtro } = query;
    const params = filtro ? GetJsonData(filtro) : {};
    params.idOlimpiada = idOlimpiada;
    query.filtro = ConvertJsonToFiltroQuery(params);
    return query;
  }
}
