import { UsuarioRol } from '../../core/authorization/entity/usuario-rol.entity';
import { EntityRepository, Repository, getRepository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Rol } from '../../core/authorization/entity/rol.entity';
import { Olimpiada } from '../olimpiada/entity/Olimpiada.entity';
import { Departamento } from '../olimpiada/entity/Departamento.entity';
import { Distrito } from '../olimpiada/entity/Distrito.entity';
import { UnidadEducativa } from '../olimpiada/entity/UnidadEducativa.entity';
import { Area } from '../olimpiada/entity/Area.entity';
import { Etapa } from '../olimpiada/entity/Etapa.entity';
import { Status } from '../../common/constants';
import { CrearUsuarioRolDto } from './dto/crear-usuario-rol.dto';

@EntityRepository(UsuarioRol)
export class UsuarioRolRepository extends Repository<UsuarioRol> {
  obtenerRolesPorUsuario(idUsuario: string) {
    return this.createQueryBuilder('usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .where('usuarioRol.id_usuario = :idUsuario', { idUsuario })
      .getMany();
  }

  obtenerRolesPorUsuarioOlimpiada(idUsuario: string) {
    return this.createQueryBuilder('usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .leftJoinAndSelect('usuarioRol.olimpiada', 'olimpiada')
      .leftJoinAndSelect('usuarioRol.unidadEducativa', 'unidadEducativa')
      .where('usuarioRol.id_usuario = :idUsuario', { idUsuario })
      .getMany();
  }

  buscarPorId(idUsuarioRol: string) {
    return this.createQueryBuilder('usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .where('usuarioRol.id = :idUsuarioRol', { idUsuarioRol })
      .getOne();
  }

  activarOInactivar(idUsuario, roles, estado) {
    return this.createQueryBuilder()
      .update(UsuarioRol)
      .set({ estado })
      .where('id_usuario = :idUsuario', { idUsuario })
      .andWhere('id_rol IN(:...ids)', { ids: roles })
      .execute();
  }

  crear(idUsuario, roles) {
    const usuarioRoles: UsuarioRol[] = roles.map((idRol) => {
      const usuario = new Usuario();
      usuario.id = idUsuario;

      const rol = new Rol();
      rol.id = idRol;

      const usuarioRol = new UsuarioRol();
      usuarioRol.usuario = usuario;
      usuarioRol.rol = rol;
      return usuarioRol;
    });

    return this.save(usuarioRoles);
  }

  async crearUsuarioRol(
    idUsuario,
    roles: Array<CrearUsuarioRolDto>,
    usuarioAuditoria,
  ) {
    const usuarioRoles: UsuarioRol[] = roles.map((item) => {
      const usuario = new Usuario();
      usuario.id = idUsuario;

      const rol = new Rol();

      const olimpiada = new Olimpiada();
      olimpiada.id = item.idOlimpiada;

      // UsuarioRol
      const usuarioRol = new UsuarioRol();
      if (item.id) {
        usuarioRol.id = item.id;
        usuarioRol.estado = item.estado;
        usuarioRol.usuarioActualizacion = usuarioAuditoria;
      } else {
        rol.id = item.idRol;
        usuarioRol.usuario = usuario;
        usuarioRol.rol = rol;
        usuarioRol.olimpiada = olimpiada;
        usuarioRol.usuarioCreacion = usuarioAuditoria;
      }

      // departamento
      const departamento = new Departamento();
      departamento.id = item.idDepartamento ? item.idDepartamento : null;
      usuarioRol.departamento = departamento;
      // distrito
      const distrito = new Distrito();
      distrito.id = item.idDistrito ? item.idDistrito : null;
      usuarioRol.distrito = distrito;
      // unidadEducativa
      const unidadEducativa = new UnidadEducativa();
      unidadEducativa.id = item.idUnidadEducativa
        ? item.idUnidadEducativa
        : null;
      usuarioRol.unidadEducativa = unidadEducativa;
      // area
      const area = new Area();
      area.id = item.idArea ? item.idArea : null;
      usuarioRol.area = area;
      // etapa
      const etapa = new Etapa();
      etapa.id = item.idEtapa ? item.idEtapa : null;
      usuarioRol.etapa = etapa;

      return usuarioRol;
    });

    return this.save(usuarioRoles);
  }

  async inactivarUsuarioRol(idUsuario: string, usuarioAuditoria: string) {
    return this.update(
      { idUsuario: idUsuario },
      { estado: Status.INACTIVE, usuarioActualizacion: usuarioAuditoria },
    );
  }

  eliminarRolesPorUsuarioOlimpiada(idUsuario: string) {
    return getRepository(UsuarioRol)
      .createQueryBuilder('usuarioRol')
      .delete()
      .from(UsuarioRol)
      .where('id_usuario = :idUsuario', { idUsuario })
      .execute();
  }
  obtenerOlimpiadasPorRolUsuario(idRol: string, idUsuario: string) {
    return this.createQueryBuilder('usuarioRol')
      .leftJoinAndSelect('usuarioRol.olimpiada', 'olimpiada')
      .select(['usuarioRol.id', 'olimpiada.id', 'olimpiada.nombre'])
      .where(
        'id_rol = :idRol and id_usuario = :idUsuario and usuarioRol.estado = :estado',
        {
          idRol,
          idUsuario,
          estado: 'ACTIVO',
        },
      )
      .getMany();
  }
  obtenerNiveles(idUsuario: string, idRol: string, rol: string) {
    const query = this.createQueryBuilder('usuarioRol')
      .where(
        'usuarioRol.id_usuario = :idUsuario and usuarioRol.id_rol = :idRol and usuarioRol.estado = :estado',
        {
          idUsuario,
          idRol,
          estado: 'ACTIVO',
        },
      )
      .select([])
      .addSelect('usuarioRol.idOlimpiada', 'idOlimpiada')
      .addSelect('usuarioRol.idEtapa', 'idEtapa')
      .addSelect('usuarioRol.idArea', 'idArea')
      .addSelect('usuarioRol.idUnidadEducativa', 'idUnidadEducativa');

    if (rol === 'DIRECTOR') {
      query.leftJoin('usuarioRol.unidadEducativa', 'unidadEducativa');
      query.leftJoin('unidadEducativa.distrito', 'distrito');
      query.leftJoin('distrito.departamento', 'departamento');
      query.addSelect('departamento.id', 'idDepartamento');
      query.addSelect('distrito.id', 'idDistrito');
    }

    if (rol === 'TECNICO_SIE_DISTRITO') {
      query.leftJoin('usuarioRol.distrito', 'distrito');
      query.leftJoin('distrito.departamento', 'departamento');
      query.addSelect('usuarioRol.idDistrito', 'idDistrito');
      query.addSelect('departamento.id', 'idDepartamento');
    }

    if (rol === 'TECNICO_SIE_DEPARTAMENTAL') {
      query.leftJoin('usuarioRol.departamento', 'departamento');
      query.addSelect('departamento.id', 'idDepartamento');
    }

    if (rol === 'COMITE_DEPARTAMENTAL') {
      query.leftJoin('usuarioRol.departamento', 'departamento');
      query.addSelect('departamento.id', 'idDepartamento');
    }

    return query.getRawMany();
  }

  obtenerPorUsuarioOlimpiadaRol(
    idUsuario: string,
    idOlimpiada: string,
    idRol: string,
  ) {
    return this.createQueryBuilder('usuarioRol')
      .where(
        'usuarioRol.idRol = :idRol and usuarioRol.idUsuario = :idUsuario and usuarioRol.idOlimpiada = :idOlimpiada',
        {
          idRol,
          idUsuario,
          idOlimpiada,
        },
      )
      .getMany();
  }
}
