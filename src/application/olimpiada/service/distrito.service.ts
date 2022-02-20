import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DistritoRepository } from '../repository/distrito.repository';
import { DepartamentoRepository } from '../repository/departamento.repository';
import { UnidadEducativaRepository } from '../repository/unidadEducativa.repository';
import { DistritoDto } from '../dto/distrito.dto';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { totalRowsResponse } from '../../../common/lib/http.module';
import { Status } from '../../../common/constants';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';

@Injectable()
export class DistritoService {
  constructor(
    @InjectRepository(DistritoRepository)
    private distritoRepositorio: DistritoRepository,
    @InjectRepository(DepartamentoRepository)
    private departamentoRepositorio: DepartamentoRepository,
    @InjectRepository(UnidadEducativaRepository)
    private unidadEducativaRepositorio: UnidadEducativaRepository,
  ) {}

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.distritoRepositorio.listar(paginacionQueryDto);
    return totalRowsResponse(result);
  }

  async listarPublico(paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.distritoRepositorio.listarPublico(
      paginacionQueryDto,
    );
    return totalRowsResponse(result);
  }

  async buscarPorId(id: string) {
    const distrito = await this.distritoRepositorio.buscarPorId(id);
    if (!distrito) {
      throw new EntityNotFoundException(`Distrito con id ${id} no encontrado`);
    }
    return distrito;
  }

  async crear(distritoDto: DistritoDto, usuarioAuditoria: string) {
    distritoDto.id = null;
    await this.validar(distritoDto);
    const result = await this.distritoRepositorio.crearActualizar(
      distritoDto,
      usuarioAuditoria,
    );
    const { id } = result;
    return { id };
  }

  async actualizar(
    id: string,
    distritoDto: DistritoDto,
    usuarioAuditoria: string,
  ) {
    const distrito = await this.distritoRepositorio.buscarPorId(id);
    if (!distrito) {
      throw new EntityNotFoundException(`Distrito con id ${id} no encontrado`);
    }

    distritoDto.id = id;
    await this.validar(distritoDto);
    const result = await this.distritoRepositorio.crearActualizar(
      distritoDto,
      usuarioAuditoria,
    );
    return { id: result.id };
  }

  async validar(distritoDto: DistritoDto) {
    const departamento = await this.departamentoRepositorio.buscarPorId(
      distritoDto.idDepartamento,
    );
    if (!departamento) {
      throw new EntityNotFoundException(
        `Departamento con id ${distritoDto.idDepartamento} no encontrado`,
      );
    }
    const distritos = await this.distritoRepositorio.contarPorCodigo(
      distritoDto.codigo,
      distritoDto.id,
    );
    if (distritos > 0) {
      throw new PreconditionFailedException(
        `Distrito con código ${distritoDto.codigo} ya se encuentra registrado`,
      );
    }
    return true;
  }

  async activar(id: string, usuarioAuditoria: string) {
    const area = await this.distritoRepositorio.buscarPorId(id);
    if (area) {
      await this.distritoRepositorio.actualizarEstado(
        id,
        Status.ACTIVE,
        usuarioAuditoria,
      );
      return { id };
    }
    throw new EntityNotFoundException(`Distrito con id ${id} no encontrado`);
  }

  async inactivar(id: string, usuarioAuditoria: string) {
    const area = await this.distritoRepositorio.buscarPorId(id);
    if (area) {
      await this.distritoRepositorio.actualizarEstado(
        id,
        Status.INACTIVE,
        usuarioAuditoria,
      );
      return { id };
    }
    throw new EntityNotFoundException(`Distrito con id ${id} no encontrado`);
  }

  async eliminar(id: string) {
    const distrito = await this.distritoRepositorio.buscarPorId(id);
    if (!distrito) {
      throw new EntityNotFoundException(`Distrito con id ${id} no encontrado`);
    }
    const result = await this.unidadEducativaRepositorio.contarPorIdDistrito(
      id,
    );
    if (result > 0) {
      throw new PreconditionFailedException(
        `No se puede eliminar, el distrito tiene unidades educativas registradas`,
      );
    }
    await this.distritoRepositorio.eliminar(distrito);
    return { id };
  }
}
