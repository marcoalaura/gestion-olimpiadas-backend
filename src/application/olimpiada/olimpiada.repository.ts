import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { EntityRepository, getRepository, In, Repository } from 'typeorm';
import { PreconditionFailedException } from '@nestjs/common';

import { Olimpiada } from './entity/Olimpiada.entity';
import { Etapa } from './entity/Etapa.entity';
import { OlimpiadaDto, OlimpiadaActualizacionDto } from './dto/olimpiada.dto';
import { EntityNotFoundException } from '../../common/exceptions/entity-not-found.exception';
import { Messages } from '../../common/constants/response-messages';
import * as dayjs from 'dayjs';
import { Rol } from '../../common/constants';
import { Status } from '../../common/constants';

@EntityRepository(Olimpiada)
export class OlimpiadaRepository extends Repository<Olimpiada> {
  async listar(
    paginacionQueryDto: PaginacionQueryDto,
    id: string,
    idRol: string,
    rol: string,
  ) {
    const { limite, saltar } = paginacionQueryDto;
    const query = getRepository(Olimpiada)
      .createQueryBuilder('olimpiada')
      .leftJoinAndSelect('olimpiada.usuarioOlimpiada', 'ur')
      .select([
        'olimpiada.id',
        'olimpiada.nombre',
        'olimpiada.fechaInicio',
        'olimpiada.fechaFin',
        'olimpiada.sigla',
        'olimpiada.gestion',
        'olimpiada.estado',
        'olimpiada.leyenda',
      ]);
    if (rol !== Rol.SUPER_ADMIN) {
      query.where(
        '(olimpiada.estado = :estado or olimpiada.estado = :cerrado) and ur.estado = :estado and ur.idUsuario = :id and ur.idRol = :idRol',
        { estado: Status.ACTIVE, cerrado: Status.CLOSED, id, idRol },
      );
    }
    query.orderBy({
      'olimpiada.gestion': 'DESC',
      'olimpiada.fechaInicio': 'DESC',
    });
    query.skip(saltar);
    query.take(limite);
    return query.getManyAndCount();
  }

  async listarBandeja(
    paginacionQueryDto: PaginacionQueryDto,
    id: string,
    idRol: string,
    rol: string,
  ) {
    const { limite, saltar } = paginacionQueryDto;
    const query = getRepository(Olimpiada)
      .createQueryBuilder('olimpiada')
      .leftJoinAndSelect('olimpiada.usuarioOlimpiada', 'ur')
      .select([
        'olimpiada.id',
        'olimpiada.nombre',
        'olimpiada.fechaInicio',
        'olimpiada.fechaFin',
        'olimpiada.sigla',
        'olimpiada.gestion',
        'olimpiada.estado',
        'olimpiada.leyenda',
        'olimpiada.logo',
      ]);
    if (rol !== Rol.SUPER_ADMIN) {
      query.where(
        'olimpiada.estado = :estado and ur.estado = :estado and ur.idUsuario = :id and ur.idRol = :idRol',
        { estado: Status.ACTIVE, id, idRol },
      );
    }
    query.orderBy({
      'olimpiada.gestion': 'DESC',
      'olimpiada.fechaInicio': 'DESC',
    });
    query.skip(saltar);
    query.take(limite);
    return query.getManyAndCount();
  }

  async listarPublico(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar } = paginacionQueryDto;
    const query = getRepository(Olimpiada)
      .createQueryBuilder('olimpiada')
      .innerJoin('olimpiada.etapas', 'etapa')
      .select(['olimpiada.id', 'olimpiada.nombre', 'olimpiada.gestion'])
      .where('(olimpiada.estado = :activo or olimpiada.estado = :cerrado)', {
        activo: Status.ACTIVE,
        cerrado: Status.CLOSED,
      })
      .andWhere('(etapa.estado = :publicado or etapa.estado = :cerrado)', {
        publicado: Status.PUBLICACION_RESULTADOS,
        cerrado: Status.CLOSED,
      });
    query.orderBy({
      'olimpiada.gestion': 'DESC',
    });
    query.skip(saltar);
    query.take(limite);
    return query.getManyAndCount();
  }

  async crear(olimpiadaDto: OlimpiadaDto, usuarioAuditoria: string) {
    olimpiadaDto.usuarioCreacion = usuarioAuditoria;
    olimpiadaDto.fechaInicio = new Date(
      dayjs(olimpiadaDto.fechaInicio).format(),
    );
    olimpiadaDto.fechaFin = new Date(
      dayjs(olimpiadaDto.fechaFin).endOf('day').format(),
    );
    await this.save(olimpiadaDto);
    return olimpiadaDto;
  }

  async actualizar(
    id: string,
    olimpiadaDto: OlimpiadaActualizacionDto,
    usuarioAuditoria: string,
  ) {
    olimpiadaDto.usuarioActualizacion = usuarioAuditoria;
    const olimpiada = await this.preload({
      ...olimpiadaDto,
      id: id,
    });
    if (!olimpiada) {
      throw new EntityNotFoundException(Messages.EXCEPTION_NOT_FOUND);
    }

    let olimpiada_ = await getRepository(Olimpiada)
      .createQueryBuilder('olimpiada')
      .where('nombre = :nombre AND id <>:id', {
        nombre: olimpiadaDto.nombre,
        id: olimpiada.id,
      })
      .getOne();
    if (olimpiada_) {
      throw new PreconditionFailedException(
        'Ya existe una olimpiada con el mismo nombre',
      );
    }

    olimpiada_ = await getRepository(Olimpiada)
      .createQueryBuilder('olimpiada')
      .where('sigla = :sigla AND id <>:id', {
        sigla: olimpiadaDto.sigla,
        id: olimpiada.id,
      })
      .getOne();

    if (olimpiada_) {
      throw new PreconditionFailedException(
        'Ya existe una olimpiada con la misma sigla',
      );
    }
    await this.save(olimpiada);
    return olimpiada;
  }

  async buscarPorId(id: string, estado = null) {
    return this.findOne({
      id,
      estado: estado
        ? In([estado])
        : In([Status.ACTIVE, Status.INACTIVE, Status.CLOSED]),
    });
  }

  async buscarPorNombre(nombre: string) {
    return this.findOne({
      nombre,
      estado: Status.ACTIVE,
    });
  }

  async buscarPorSigla(sigla: string) {
    return this.findOne({
      sigla,
      estado: Status.ACTIVE,
    });
  }

  async etapasOlimpiada(idOlimpiada: string) {
    return getRepository(Etapa)
      .createQueryBuilder('etapa')
      .where('id_olimpiada = :idOlimpiada', {
        idOlimpiada,
      })
      .getMany();
  }

  async eliminar(olimpiada: Olimpiada) {
    return this.remove(olimpiada);
  }

  async actualizarEstado(id: string, estado: string, usuarioAuditoria: string) {
    return this.createQueryBuilder('olimpiada')
      .update(Olimpiada)
      .set({ estado, usuarioActualizacion: usuarioAuditoria })
      .where('id = :id', { id })
      .execute();
  }
}
