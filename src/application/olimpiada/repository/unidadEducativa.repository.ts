import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { UnidadEducativaDto } from '../dto/unidadEducativa.dto';
import { UnidadEducativa } from '../entity/UnidadEducativa.entity';
import { Distrito } from '../entity/Distrito.entity';
import { GetJsonData } from '../../../common/lib/json.module';
import { Inscripcion } from '../entity/Inscripcion.entity';

@EntityRepository(UnidadEducativa)
export class UnidadEducativaRepository extends Repository<UnidadEducativa> {
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const query = getRepository(UnidadEducativa)
      .createQueryBuilder('ue')
      .leftJoinAndSelect('ue.distrito', 'di')
      .leftJoinAndSelect('di.departamento', 'de')
      .select([
        'ue.id',
        'ue.codigoSie',
        'ue.nombre',
        'ue.tipoUnidadEducativa',
        'ue.areaGeografica',
        'ue.seccion',
        'ue.localidad',
        'ue.estado',
        'di.id',
        'di.nombre',
        'de.id',
        'de.nombre',
      ])
      .orderBy('ue.nombre', orden)
      .skip(saltar)
      .take(limite);

    if (parametros?.estado) {
      query.andWhere('ue.estado = :estado', { estado: parametros.estado });
    }
    if (parametros?.codigoSie) {
      query.andWhere('ue.codigo_sie::varchar ilike :sie', {
        sie: `%${parametros.codigoSie}%`,
      });
    }
    if (parametros?.idDepartamento) {
      query.andWhere('de.id = :idDe', { idDe: parametros.idDepartamento });
    }
    if (parametros?.idDistrito) {
      query.andWhere('di.id = :idDi', { idDi: parametros.idDistrito });
    }
    if (parametros?.areaGeografica) {
      query.andWhere('ue.areaGeografica = :area', {
        area: parametros.areaGeografica,
      });
    }
    if (parametros?.tipoUnidadEducativa) {
      query.andWhere('ue.tipoUnidadEducativa = :tipo', {
        tipo: parametros.tipoUnidadEducativa,
      });
    }
    if (parametros?.nombre) {
      query.andWhere(
        'ue.nombre ilike :nombre or ue.codigo_sie::varchar ilike :nombre',
        { nombre: `%${parametros.nombre}%` },
      );
    }

    return query.getManyAndCount();
  }

  async listarPublico(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const query = getRepository(UnidadEducativa)
      .createQueryBuilder('ue')
      .leftJoinAndSelect('ue.distrito', 'di')
      .leftJoinAndSelect('di.departamento', 'de')
      .select(['ue.id', 'ue.nombre'])
      .orderBy('ue.nombre', orden)
      .skip(saltar)
      .take(limite)
      .where('ue.estado = :activo', { activo: 'ACTIVO' });

    if (parametros?.idDistrito) {
      query.andWhere('di.id = :idDi', { idDi: parametros.idDistrito });
    }
    if (parametros?.nombre) {
      query.andWhere('ue.nombre ilike :nombre', {
        nombre: `%${parametros.nombre}%`,
      });
    }

    return query.getManyAndCount();
  }

  async buscar(idUnidadEducativa, params) {
    const query = getRepository(UnidadEducativa)
      .createQueryBuilder('ue')
      .leftJoinAndSelect('ue.distrito', 'distrito')
      .leftJoinAndSelect('distrito.departamento', 'de')
      .select([
        'ue.id',
        'ue.nombre',
        'ue.tipoUnidadEducativa',
        'ue.areaGeografica',
        'ue.codigoSie',
        'ue.seccion',
        'ue.localidad',
        'ue.estado',
        'distrito.id',
        'distrito.nombre',
        'de.id',
        'de.nombre',
      ])
      .where('ue.id = :idUnidadEducativa', {
        idUnidadEducativa,
      });
    if (params.idDistrito) {
      query.andWhere('distrito.id = :idDistrito', {
        idDistrito: params.idDistrito,
      });
    }
    if (params.idDepartamento) {
      query.andWhere('de.id = :idDepartamento', {
        idDepartamento: params.idDepartamento,
      });
    }
    return query.getOne();
  }
  async buscarPorId(id: string) {
    return getRepository(UnidadEducativa)
      .createQueryBuilder('ue')
      .leftJoinAndSelect('ue.distrito', 'distrito')
      .leftJoinAndSelect('distrito.departamento', 'de')
      .select([
        'ue.id',
        'ue.nombre',
        'ue.tipoUnidadEducativa',
        'ue.areaGeografica',
        'ue.codigoSie',
        'ue.seccion',
        'ue.localidad',
        'ue.estado',
        'distrito.id',
        'distrito.nombre',
        'de.id',
        'de.nombre',
      ])
      .where('ue.id = :id', { id })
      .getOne();
  }

  async contarPorCodigoSie(codigoSie: number, id: string) {
    const query = getRepository(UnidadEducativa)
      .createQueryBuilder('ue')
      .where('ue.codigoSie = :codigoSie', { codigoSie });

    if (id) {
      query.andWhere('ue.id <> :id', { id });
    }
    return query.getCount();
  }

  async crearActualizar(
    unidadEducativaDto: UnidadEducativaDto,
    usuarioAuditoria: string,
  ) {
    const {
      id,
      nombre,
      codigoSie,
      tipoUnidadEducativa,
      areaGeografica,
      idDistrito,
      seccion,
      localidad,
      estado,
    } = unidadEducativaDto;

    const distrito = new Distrito();
    distrito.id = idDistrito;

    const unidadEducativa = new UnidadEducativa();
    unidadEducativa.nombre = nombre;
    unidadEducativa.tipoUnidadEducativa = tipoUnidadEducativa;
    unidadEducativa.areaGeografica = areaGeografica;
    unidadEducativa.seccion = seccion;
    unidadEducativa.localidad = localidad;
    unidadEducativa.estado = estado;
    unidadEducativa.distrito = distrito;

    if (id) {
      unidadEducativa.id = id;
      unidadEducativa.usuarioActualizacion = usuarioAuditoria;
    } else {
      unidadEducativa.codigoSie = codigoSie;
      unidadEducativa.usuarioCreacion = usuarioAuditoria;
    }

    return this.save(unidadEducativa);
  }

  async actualizarEstado(id: string, estado: string, usuarioAuditoria: string) {
    return getRepository(UnidadEducativa)
      .createQueryBuilder()
      .update(UnidadEducativa)
      .set({ estado, usuarioActualizacion: usuarioAuditoria })
      .where('id = :id', { id })
      .execute();
  }

  async contarPorIdDistrito(idDistrito: string) {
    return getRepository(UnidadEducativa)
      .createQueryBuilder('ue')
      .leftJoinAndSelect('ue.distrito', 'di')
      .where('di.id = :id', { id: idDistrito })
      .getCount();
  }

  async contarPorIdUnidadEducativa(idUnidadEducativa: string) {
    return getRepository(Inscripcion)
      .createQueryBuilder('i')
      .leftJoinAndSelect('i.unidadEducativa', 'ue')
      .where('ue.id = :id', { id: idUnidadEducativa })
      .getCount();
  }

  async listarCodigoSie(limite: any) {
    return getRepository(UnidadEducativa)
      .createQueryBuilder('ue')
      .select(['ue.codigoSie'])
      .distinctOn(['ue.codigoSie'])
      .take(limite)
      .getMany();
  }

  async eliminar(unidadEducativa: UnidadEducativa) {
    return this.remove(unidadEducativa);
  }
}
