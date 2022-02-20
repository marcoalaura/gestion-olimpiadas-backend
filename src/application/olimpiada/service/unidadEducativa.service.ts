import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnidadEducativaRepository } from '../repository/unidadEducativa.repository';
import { DistritoRepository } from '../repository/distrito.repository';
import { UnidadEducativaDto } from '../dto/unidadEducativa.dto';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { totalRowsResponse } from '../../../common/lib/http.module';
import { Status } from '../../../common/constants';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';

@Injectable()
export class UnidadEducativaService {
  constructor(
    @InjectRepository(UnidadEducativaRepository)
    private unidadEducativaRepositorio: UnidadEducativaRepository,
    @InjectRepository(DistritoRepository)
    private distritoRepositorio: DistritoRepository,
  ) {}

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.unidadEducativaRepositorio.listar(
      paginacionQueryDto,
    );
    return totalRowsResponse(result);
  }

  async listarPublico(paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.unidadEducativaRepositorio.listarPublico(
      paginacionQueryDto,
    );
    return totalRowsResponse(result);
  }

  async buscarPorId(id: string) {
    const unidadEducativa = await this.unidadEducativaRepositorio.buscarPorId(
      id,
    );
    if (!unidadEducativa) {
      throw new EntityNotFoundException(
        `Unidad Educativa con id ${id} no encontrado`,
      );
    }
    return unidadEducativa;
  }

  async crear(
    unidadEducativaDto: UnidadEducativaDto,
    usuarioAuditoria: string,
  ) {
    unidadEducativaDto.id = null;
    await this.validar(unidadEducativaDto);
    const result = await this.unidadEducativaRepositorio.crearActualizar(
      unidadEducativaDto,
      usuarioAuditoria,
    );
    const { id } = result;
    return { id };
  }

  async actualizar(
    id: string,
    unidadEducativaDto: UnidadEducativaDto,
    usuarioAuditoria: string,
  ) {
    const unidadEducativa = await this.unidadEducativaRepositorio.buscarPorId(
      id,
    );
    if (!unidadEducativa) {
      throw new EntityNotFoundException(
        `Unidad Educativa con id ${id} no encontrado`,
      );
    }

    unidadEducativaDto.id = id;
    await this.validar(unidadEducativaDto);
    const result = await this.unidadEducativaRepositorio.crearActualizar(
      unidadEducativaDto,
      usuarioAuditoria,
    );
    return { id: result.id };
  }

  async validar(unidadEducativaDto: UnidadEducativaDto) {
    const distrito = await this.distritoRepositorio.buscarPorId(
      unidadEducativaDto.idDistrito,
    );
    if (!distrito) {
      throw new EntityNotFoundException(
        `Distrito con id ${unidadEducativaDto.idDistrito} no encontrado`,
      );
    }
    if (distrito?.estado != Status.ACTIVE) {
      throw new PreconditionFailedException(
        `Distrito ${distrito.nombre} no esta ${Status.ACTIVE}`,
      );
    }
    if (distrito?.departamento.id != unidadEducativaDto.idDepartamento) {
      throw new PreconditionFailedException(
        `Distrito ${distrito.nombre} no corresponde al departamento de ${distrito.departamento.nombre}`,
      );
    }
    const unidades = await this.unidadEducativaRepositorio.contarPorCodigoSie(
      unidadEducativaDto.codigoSie,
      unidadEducativaDto.id,
    );
    if (unidades > 0) {
      throw new PreconditionFailedException(
        `La unidad educativa con código ${unidadEducativaDto.codigoSie} ya se encuentra registrada`,
      );
    }
    return true;
  }

  async activar(id: string, usuarioAuditoria: string) {
    const area = await this.unidadEducativaRepositorio.buscarPorId(id);
    if (area) {
      await this.unidadEducativaRepositorio.actualizarEstado(
        id,
        Status.ACTIVE,
        usuarioAuditoria,
      );
      return { id };
    }
    throw new EntityNotFoundException(
      `Unidad Educativa con id ${id} no encontrado`,
    );
  }

  async inactivar(id: string, usuarioAuditoria: string) {
    const area = await this.unidadEducativaRepositorio.buscarPorId(id);
    if (area) {
      await this.unidadEducativaRepositorio.actualizarEstado(
        id,
        Status.INACTIVE,
        usuarioAuditoria,
      );
      return { id };
    }
    throw new EntityNotFoundException(
      `Unidad Educativa con id ${id} no encontrado`,
    );
  }

  async eliminar(id: string) {
    const unidadEducativa = await this.unidadEducativaRepositorio.buscarPorId(
      id,
    );
    if (!unidadEducativa) {
      throw new EntityNotFoundException(
        `Unidad Educativa con id ${id} no encontrado`,
      );
    }
    const result = await this.unidadEducativaRepositorio.contarPorIdUnidadEducativa(
      id,
    );
    if (result > 0) {
      throw new PreconditionFailedException(
        `No se puede eliminar, la unidad educativa tiene a uno o más directores o estudiantes vinculados, debe darlos de baja primero para eliminarla.`,
      );
    }
    await this.unidadEducativaRepositorio.eliminar(unidadEducativa);
    return { id };
  }
}
