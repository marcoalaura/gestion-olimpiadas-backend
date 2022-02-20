import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AreaRepository } from '../repository/area.repository';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { AreaDto } from '../dto/area.dto';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { totalRowsResponse } from '../../../common/lib/http.module';
import { Status } from '../../../common/constants';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';
import { FileService } from '../../../../libs/file/src';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(AreaRepository)
    private areaRepositorio: AreaRepository,
    @InjectRepository(EtapaAreaGradoRepository)
    private etapaAreaGradoRepositorio: EtapaAreaGradoRepository,
    private fileService: FileService,
  ) {}

  async recuperar(paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.areaRepositorio.listar(paginacionQueryDto);
    return totalRowsResponse(result);
  }

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.areaRepositorio.listarBandeja(paginacionQueryDto);
    return totalRowsResponse(result);
  }

  async buscarPorId(id: string) {
    const area = await this.areaRepositorio.buscarPorId(id);
    if (!area) {
      throw new EntityNotFoundException(`Área con id ${id} no encontrado`);
    }
    return area;
  }

  async crear(areaDto: AreaDto, usuarioAuditoria: string) {
    areaDto.id = null;
    await this.validar(areaDto);
    // validar imagen
    if (areaDto.logo) {
      this.fileService.validarTamanoLogo(areaDto.logo);
    }
    const result = await this.areaRepositorio.crearActualizar(
      areaDto,
      usuarioAuditoria,
    );
    const { id } = result;
    return { id };
  }

  async actualizar(id: string, areaDto: AreaDto, usuarioAuditoria: string) {
    const area = await this.areaRepositorio.buscarPorId(id);
    if (!area) {
      throw new EntityNotFoundException(`Área con id ${id} no encontrado`);
    }
    areaDto.id = id;

    // validar imagen
    if (areaDto.logo) {
      this.fileService.validarTamanoLogo(areaDto.logo);
    }

    await this.validar(areaDto);
    const result = await this.areaRepositorio.crearActualizar(
      areaDto,
      usuarioAuditoria,
    );
    return { id: result.id };
  }

  async validar(areaDto: AreaDto) {
    const etapasJerarquia = await this.areaRepositorio.contarPorNombre(
      areaDto.nombre,
      areaDto.id,
    );
    if (etapasJerarquia > 0) {
      throw new PreconditionFailedException(
        `Otra area con nombre ${areaDto.nombre}, ya se encuentra registrada`,
      );
    }
    return true;
  }

  async activar(id: string, usuarioAuditoria: string) {
    const area = await this.areaRepositorio.buscarPorId(id);
    if (area) {
      await this.areaRepositorio.actualizarEstado(
        id,
        Status.ACTIVE,
        usuarioAuditoria,
      );
      return { id };
    }
    throw new EntityNotFoundException(`Área con id ${id} no encontrado`);
  }

  async inactivar(id: string, usuarioAuditoria: string) {
    const area = await this.areaRepositorio.buscarPorId(id);
    if (area) {
      await this.areaRepositorio.actualizarEstado(
        id,
        Status.INACTIVE,
        usuarioAuditoria,
      );
      return { id };
    }
    throw new EntityNotFoundException(`Área con id ${id} no encontrado`);
  }

  async eliminar(id: string) {
    const area = await this.areaRepositorio.buscarPorId(id);
    if (!area) {
      throw new EntityNotFoundException(`Área con id ${id} no encontrado`);
    }
    const result = await this.etapaAreaGradoRepositorio.contarPorIdArea(id);
    if (result > 0) {
      throw new PreconditionFailedException(
        `No se puede eliminar, el área tiene etapas registradas`,
      );
    }
    await this.areaRepositorio.eliminar(area);
    return { id };
  }
}
