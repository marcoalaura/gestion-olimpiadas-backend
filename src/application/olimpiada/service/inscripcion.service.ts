import {
  HttpException,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EtapaAreaGradoRepository } from '../repository/etapaAreaGrado.repository';
import { InscripcionRepository } from '../repository/inscripcion.repository';
import { InscripcionCreacionDto } from '../dto/inscripcion.dto';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { totalRowsResponse } from '../../../common/lib/http.module';
import { UnidadEducativaRepository } from '../repository/unidadEducativa.repository';
import { EstudianteRepository } from '../repository/estudiante.repository';
import * as fs from 'fs';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';
import { Status, tiposEtapa } from '../../../common/constants';

@Injectable()
export class InscripcionService {
  constructor(
    @InjectRepository(EtapaAreaGradoRepository)
    private etapaAreaGradoRepositorio: EtapaAreaGradoRepository,
    @InjectRepository(InscripcionRepository)
    private inscripcionRepositorio: InscripcionRepository,
    @InjectRepository(UnidadEducativaRepository)
    private unidadEducativaRepositorio: UnidadEducativaRepository,
    @InjectRepository(EstudianteRepository)
    private estudianteRepositorio: EstudianteRepository,
  ) {}

  async listar(
    idEtapaAreaGrado: string,
    paginacionQueryDto: PaginacionQueryDto,
  ) {
    const result = await this.inscripcionRepositorio.listar(
      idEtapaAreaGrado,
      paginacionQueryDto,
    );
    return totalRowsResponse(result);
  }

  async buscarPorId(id: string) {
    const inscripcion = await this.inscripcionRepositorio.buscarPorId(id);
    if (!inscripcion) {
      throw new EntityNotFoundException(
        `La inscripción con id ${id} no encontrada.`,
      );
    }
    return inscripcion;
  }

  async crearActualizar(
    inscripcionCreacionDto: InscripcionCreacionDto,
    usuarioAuditoria: string,
    id: string = null,
  ) {
    const etapaAreaGrado = await this.etapaAreaGradoRepositorio.buscarPorId(
      inscripcionCreacionDto.idEtapaAreaGrado,
    );
    if (!etapaAreaGrado) {
      throw new EntityNotFoundException(
        `No se encontró configuración para Etapa - Area - Grado`,
      );
    }
    if (etapaAreaGrado.etapa.tipo !== tiposEtapa.DISTRITAL) {
      throw new PreconditionFailedException(
        `Solo se puede registrar inscripciones en etapas de tipo ${tiposEtapa.DISTRITAL}.`,
      );
    }
    if (etapaAreaGrado.etapa.estado !== Status.CONFIGURACION_COMPETENCIA) {
      throw new PreconditionFailedException(
        `La etapa debe estar en estado ${Status.CONFIGURACION_COMPETENCIA} para crear y modificar inscripciones.`,
      );
    }

    const unidadEducativa = await this.unidadEducativaRepositorio.buscarPorId(
      inscripcionCreacionDto.idUnidadEducativa,
    );
    if (!unidadEducativa) {
      throw new EntityNotFoundException(`No se encontró la unidad educativa`);
    }
    if (!id && inscripcionCreacionDto.estudiante?.persona.nroDocumento != '') {
      const estudianteConOtroRude = await this.estudianteRepositorio.buscarEstudianteConDistintoRude(
        inscripcionCreacionDto.estudiante.persona.nroDocumento,
        inscripcionCreacionDto.estudiante.rude,
      );
      if (estudianteConOtroRude) {
        throw new PreconditionFailedException(
          `No se puede registrar. 
          El estudiante con número de documento ${inscripcionCreacionDto.estudiante.persona.nroDocumento} ya esta registrado con otro RUDE`,
        );
      }
    }

    const rudeOtroEstudiante = await this.estudianteRepositorio.buscarRudeConDistintoEstudiante(
      inscripcionCreacionDto.estudiante.persona.nroDocumento,
      inscripcionCreacionDto.estudiante.rude,
    );
    if (rudeOtroEstudiante) {
      throw new PreconditionFailedException(
        `No se puede registrar. 
        El RUDE ${inscripcionCreacionDto.estudiante.rude} ya esta registrado con otro estudiante`,
      );
    }

    // validación idImportación
    const codigos = await this.inscripcionRepositorio.buscarPorIdImportacion(
      etapaAreaGrado.etapa.id,
      inscripcionCreacionDto.idImportacion,
      id,
    );
    if (codigos.length > 0) {
      throw new PreconditionFailedException(
        `El identificador de inscripción  ${inscripcionCreacionDto.idImportacion} ya se encuentra registrado en la etapa`,
      );
    }

    // validación máximo un grado de escolaridad
    const gradosEscolares = await this.inscripcionRepositorio.buscarPorEtapaGrado(
      etapaAreaGrado.etapa.id,
      etapaAreaGrado.gradoEscolar.id,
      inscripcionCreacionDto.estudiante.rude,
    );
    if (gradosEscolares.length > 0) {
      throw new PreconditionFailedException(
        `El estudiante con RUDE ${inscripcionCreacionDto.estudiante.rude} ya esta registrado en otro grado escolar`,
      );
    }

    // validación máximo dos áreas
    const areas = await this.inscripcionRepositorio.buscarPorEtapa(
      etapaAreaGrado.etapa.id,
      inscripcionCreacionDto.estudiante.rude,
      id,
    );
    if (areas.length >= 2) {
      throw new PreconditionFailedException(
        `El el estudiante con RUDE ${inscripcionCreacionDto.estudiante.rude} ya esta registrado dos áreas`,
      );
    }
    const result = await this.inscripcionRepositorio.crearActualizar(
      inscripcionCreacionDto,
      usuarioAuditoria,
      id,
    );
    return result;
  }

  async eliminar(id: string, usuarioAuditoria: string) {
    const result = await this.inscripcionRepositorio.eliminar(
      id,
      usuarioAuditoria,
    );
    return {
      id: result.id,
      idImportacion: result.idImportacion,
    };
  }

  async guardarItems(
    items: any,
    idEtapaAreaGrado: string,
    usuarioAuditoria: string,
  ) {
    for (const item of items) {
      const resEstudiante = await this.estudianteRepositorio.guardarItem(
        item,
        usuarioAuditoria,
      );
      await this.inscripcionRepositorio.guardarItem(
        item,
        idEtapaAreaGrado,
        resEstudiante,
        usuarioAuditoria,
      );
    }
    return true;
  }

  async eliminarArchivo(rutaCsv: string) {
    try {
      return await fs.unlink(rutaCsv, function (err) {
        if (err) throw err;
      });
    } catch (e) {
      throw new HttpException(`El archivo ${rutaCsv}, no existe.`, 500);
    }
  }

  async activarDesactivar(id: string, estado, usuarioAuditoria: string) {
    const inscripcion_ = await this.inscripcionRepositorio.buscarPorId(id);
    if (!inscripcion_) {
      throw new EntityNotFoundException(
        `Inscripción con id ${id} no encontrado`,
      );
    }
    inscripcion_.usuarioActualizacion = usuarioAuditoria;
    inscripcion_.estado = estado;
    return this.inscripcionRepositorio.save(inscripcion_);
  }
}
