import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GradoEscolaridadRepository } from '../repository/gradoEscolaridad.repository';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { GradoEscolaridadDto } from '../dto/gradoEscolaridad.dto';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { totalRowsResponse } from '../../../common/lib/http.module';
import { Status } from '../../../common/constants';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';

@Injectable()
export class GradoEscolaridadService {
  constructor(
    @InjectRepository(GradoEscolaridadRepository)
    private gradoEscolaridadRepositorio: GradoEscolaridadRepository,
    @InjectRepository(EtapaAreaGradoRepository)
    private etapaAreaGradoRepositorio: EtapaAreaGradoRepository,
  ) {}

  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.gradoEscolaridadRepositorio.listar(
      paginacionQueryDto,
    );
    return totalRowsResponse(result);
  }

  async buscarPorId(id: string) {
    const gradoEscolaridad = await this.gradoEscolaridadRepositorio.buscarPorId(
      id,
    );
    if (!gradoEscolaridad) {
      throw new EntityNotFoundException(
        `Grado de escolaridad con id ${id} no encontrado.`,
      );
    }
    return gradoEscolaridad;
  }

  async crear(
    gradoEscolaridadDto: GradoEscolaridadDto,
    usuarioAuditoria: string,
  ) {
    await this.validar(gradoEscolaridadDto);
    gradoEscolaridadDto.id = null;
    const result = await this.gradoEscolaridadRepositorio.crearActualizar(
      gradoEscolaridadDto,
      usuarioAuditoria,
    );
    return { id: result.id };
  }

  async actualizar(
    id: string,
    gradoEscolaridadDto: GradoEscolaridadDto,
    usuarioAuditoria: string,
  ) {
    await this.validar(gradoEscolaridadDto);
    const etapa = await this.gradoEscolaridadRepositorio.buscarPorId(id);
    if (!etapa) {
      throw new EntityNotFoundException(
        `Grado de escolaridad con id ${id} no encontrado.`,
      );
    }

    gradoEscolaridadDto.id = id;
    const result = await this.gradoEscolaridadRepositorio.crearActualizar(
      gradoEscolaridadDto,
      usuarioAuditoria,
    );
    return { id: result.id };
  }

  async validar(gradoEscolaridadDto: GradoEscolaridadDto) {
    if (!(gradoEscolaridadDto.orden > 0 && gradoEscolaridadDto.orden < 100)) {
      throw new PreconditionFailedException(
        `El orden del grado escolar, tiene que ser mayor a 0 y menor a 100.`,
      );
    }
    const gradoNombre = await this.gradoEscolaridadRepositorio.contarPorNombre(
      gradoEscolaridadDto.nombre,
      gradoEscolaridadDto.id,
    );
    if (gradoNombre > 0) {
      throw new PreconditionFailedException(
        `Otro grado con nombre ${gradoEscolaridadDto.nombre}, ya se encuentra registrado.`,
      );
    }
    const gradoOrden = await this.gradoEscolaridadRepositorio.contarPorOrden(
      gradoEscolaridadDto.orden,
      gradoEscolaridadDto.id,
    );
    if (gradoOrden > 0) {
      throw new PreconditionFailedException(
        `Otro grado con orden ${gradoEscolaridadDto.orden}, ya se encuentra registrado.`,
      );
    }
    return true;
  }

  async activar(id: string, usuarioAuditoria: string) {
    const grado = await this.gradoEscolaridadRepositorio.buscarPorId(id);
    if (grado) {
      await this.gradoEscolaridadRepositorio.actualizarEstado(
        id,
        Status.ACTIVE,
        usuarioAuditoria,
      );
      return { id };
    }
    throw new EntityNotFoundException(`Etapa con id ${id} no encontrado.`);
  }

  async inactivar(id: string, usuarioAuditoria: string) {
    const grado = await this.gradoEscolaridadRepositorio.buscarPorId(id);
    if (grado) {
      await this.gradoEscolaridadRepositorio.actualizarEstado(
        id,
        Status.INACTIVE,
        usuarioAuditoria,
      );
      return { id };
    }
    throw new EntityNotFoundException(`Etapa con id ${id} no encontrado.`);
  }

  async eliminar(id: string) {
    const gradoEscolaridad = await this.gradoEscolaridadRepositorio.buscarPorId(
      id,
    );
    if (!gradoEscolaridad) {
      throw new EntityNotFoundException(
        `Grado de escolaridad con id ${id} no encontrado.`,
      );
    }
    const result = await this.etapaAreaGradoRepositorio.contarPorIdGrado(id);
    if (result > 0) {
      throw new PreconditionFailedException(
        `No se puede eliminar, el grado de escolaridad tiene etapas registradas`,
      );
    }
    return this.gradoEscolaridadRepositorio.eliminar(gradoEscolaridad);
  }
}
