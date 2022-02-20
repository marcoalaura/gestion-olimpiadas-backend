import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { EntityRepository, getRepository, Repository } from 'typeorm';
import { DistritoDto } from '../dto/distrito.dto';
import { Distrito } from '../entity/Distrito.entity';
import { Departamento } from '../entity/Departamento.entity';
import { GetJsonData } from '../../../common/lib/json.module';

@EntityRepository(Distrito)
export class DistritoRepository extends Repository<Distrito> {
  async listar(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const query = getRepository(Distrito)
      .createQueryBuilder('di')
      .leftJoinAndSelect('di.departamento', 'de')
      .select([
        'di.id',
        'di.nombre',
        'di.codigo',
        'di.estado',
        'de.id',
        'de.nombre',
      ])
      .orderBy('di.nombre', orden)
      .skip(saltar)
      .take(limite);

    if (parametros?.estado) {
      query.andWhere('di.estado = :estado', { estado: parametros.estado });
    }
    if (parametros?.idDepartamento) {
      query.andWhere('de.id = :idDe', { idDe: parametros.idDepartamento });
    }
    if (parametros?.nombre) {
      query.andWhere('di.nombre ilike :nombre', {
        nombre: `%${parametros.nombre}%`,
      });
    }

    return query.getManyAndCount();
  }

  async listarPublico(paginacionQueryDto: PaginacionQueryDto) {
    const { limite, saltar, filtro, orden } = paginacionQueryDto;
    const parametros = filtro ? GetJsonData(filtro) : null;

    const query = getRepository(Distrito)
      .createQueryBuilder('di')
      .leftJoinAndSelect('di.departamento', 'de')
      .select(['di.id', 'di.nombre'])
      .orderBy('di.nombre', orden)
      .skip(saltar)
      .take(limite)
      .where('di.estado = :activo', { activo: 'ACTIVO' });

    if (parametros?.idDepartamento) {
      query.andWhere('de.id = :idDe', { idDe: parametros.idDepartamento });
    }
    if (parametros?.nombre) {
      query.andWhere('di.nombre ilike :nombre', {
        nombre: `%${parametros.nombre}%`,
      });
    }

    return query.getManyAndCount();
  }

  async buscarPorId(id: string) {
    return getRepository(Distrito)
      .createQueryBuilder('distrito')
      .leftJoinAndSelect('distrito.departamento', 'departamento')
      .select([
        'distrito.id',
        'distrito.nombre',
        'distrito.codigo',
        'distrito.estado',
        'departamento.id',
        'departamento.nombre',
      ])
      .where('distrito.id = :id', { id })
      .getOne();
  }

  async contarPorCodigo(codigo: number, id: string) {
    const query = getRepository(Distrito)
      .createQueryBuilder('distrito')
      .where('distrito.codigo = :codigo', { codigo });

    if (id) {
      query.andWhere('distrito.id <> :id', { id });
    }
    return query.getCount();
  }

  async crearActualizar(distritoDto: DistritoDto, usuarioAuditoria: string) {
    const { id, nombre, codigo, idDepartamento, estado } = distritoDto;

    const departamento = new Departamento();
    departamento.id = idDepartamento;

    const distrito = new Distrito();
    distrito.nombre = nombre;
    distrito.codigo = codigo;
    distrito.estado = estado;
    distrito.departamento = departamento;

    if (id) {
      distrito.id = id;
      distrito.usuarioActualizacion = usuarioAuditoria;
    } else {
      distrito.usuarioCreacion = usuarioAuditoria;
    }

    return this.save(distrito);
  }

  async actualizarEstado(id: string, estado: string, usuarioAuditoria: string) {
    return getRepository(Distrito)
      .createQueryBuilder()
      .update(Distrito)
      .set({ estado, usuarioActualizacion: usuarioAuditoria })
      .where('id = :id', { id })
      .execute();
  }

  async eliminar(distrito: Distrito) {
    return this.remove(distrito);
  }
}
