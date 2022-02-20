import { TextService } from '../../common/lib/text.service';
import { Rol } from '../../core/authorization/entity/rol.entity';
import { UsuarioRol } from '../../core/authorization/entity/usuario-rol.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Persona } from '../persona/persona.entity';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { Usuario } from './usuario.entity';
import { PersonaDto } from '../persona/persona.dto';
import { Status } from '../../common/constants';
import { FiltrosUsuarioDto } from './dto/filtros-usuario.dto';
import { Departamento } from '../olimpiada/entity/Departamento.entity';
import { Distrito } from '../olimpiada/entity/Distrito.entity';
import { UnidadEducativa } from '../olimpiada/entity/UnidadEducativa.entity';
import { Area } from '../olimpiada/entity/Area.entity';
import { Etapa } from '../olimpiada/entity/Etapa.entity';
import { Olimpiada } from '../olimpiada/entity/Olimpiada.entity';
import { CrearUsuarioRolDto } from './dto/crear-usuario-rol.dto';

@EntityRepository(Usuario)
export class UsuarioRepository extends Repository<Usuario> {
  async listar(paginacionQueryDto: FiltrosUsuarioDto) {
    const {
      limite,
      saltar,
      filtro,
      rol,
      grupo,
      olimpiada,
    } = paginacionQueryDto;
    const queryBuilder = this.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .leftJoinAndSelect('usuarioRol.olimpiada', 'olimpiada')
      .leftJoinAndSelect('usuarioRol.departamento', 'departamento')
      .leftJoinAndSelect('usuarioRol.distrito', 'distrito')
      .leftJoinAndSelect('distrito.departamento', 'dd')
      .leftJoinAndSelect('usuarioRol.area', 'area')
      .leftJoinAndSelect('usuarioRol.unidadEducativa', 'unidadEducativa')
      .leftJoinAndSelect('usuarioRol.etapa', 'etapa')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .select([
        'usuario.id',
        'usuario.usuario',
        'usuario.correoElectronico',
        'usuario.estado',
        'usuarioRol',
        'rol.id',
        'rol.rol',
        'rol.nombre',
        'rol.grupo',
        'olimpiada.id',
        'olimpiada.nombre',
        'persona.nroDocumento',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
        'persona.fechaNacimiento',
        'persona.tipoDocumento',
        'persona.telefono',
        'departamento.id',
        'departamento.nombre',
        'distrito.id',
        'distrito.nombre',
        'dd.id',
        'dd.nombre',
        'area.id',
        'area.nombre',
        'unidadEducativa.id',
        'unidadEducativa.nombre',
        'etapa.id',
        'etapa.nombre',
      ])
      .skip(saltar)
      .take(limite);

    if (grupo) {
      queryBuilder.andWhere('rol.grupo IN(:...grupos)', { grupos: grupo });
    }
    if (olimpiada) {
      queryBuilder.andWhere('usuarioRol.idOlimpiada IN (:...olimpiada)', {
        olimpiada,
      });
    }
    if (rol) {
      queryBuilder.andWhere('rol.id IN(:...roles)', { roles: rol });
    }
    if (filtro) {
      queryBuilder.andWhere(
        '(persona.nroDocumento like :filtro or persona.nombres ilike :filtro or persona.primerApellido ilike :filtro or persona.segundoApellido ilike :filtro)',
        { filtro: `%${filtro}%` },
      );
    }

    return await queryBuilder.getManyAndCount();
  }

  async recuperarDetallesUsuario(idUsuario: string) {
    const queryBuilder = await this.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .leftJoinAndSelect('usuarioRol.olimpiada', 'olimpiada')
      .leftJoinAndSelect('usuarioRol.departamento', 'departamento')
      .leftJoinAndSelect('usuarioRol.distrito', 'distrito')
      .leftJoinAndSelect('distrito.departamento', 'dd')
      .leftJoinAndSelect('usuarioRol.area', 'area')
      .leftJoinAndSelect('usuarioRol.unidadEducativa', 'unidadEducativa')
      .leftJoinAndSelect('unidadEducativa.distrito', 'distritoU')
      .leftJoinAndSelect('distritoU.departamento', 'departamentoU')
      .leftJoinAndSelect('usuarioRol.etapa', 'etapa')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .select([
        'usuario.id',
        'usuario.usuario',
        'usuario.correoElectronico',
        'usuario.estado',
        'usuarioRol',
        'rol.id',
        'rol.rol',
        'rol.nombre',
        'rol.grupo',
        'olimpiada.id',
        'olimpiada.nombre',
        'persona.nroDocumento',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
        'persona.fechaNacimiento',
        'persona.tipoDocumento',
        'persona.telefono',
        'departamento.id',
        'departamento.nombre',
        'distrito.id',
        'distrito.nombre',
        'dd.id',
        'dd.nombre',
        'area.id',
        'area.nombre',
        'unidadEducativa.id',
        'unidadEducativa.nombre',
        'unidadEducativa.codigoSie',
        'distritoU.nombre',
        'departamentoU.nombre',
        'etapa.id',
        'etapa.nombre',
      ])
      .where('usuario.id = :idUsuario', { idUsuario });
    return queryBuilder.getOne();
  }

  recuperar() {
    return this.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .getMany();
  }

  buscarUsuario(usuario: string) {
    // return Usuario.findOne({ usuario });
    return this.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .where({ usuario: usuario })
      .getOne();
  }

  buscarUsuarioRolPorId(id: string) {
    return this.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.olimpiada', 'olimpiada')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .select([
        'usuario.id',
        'usuario.usuario',
        'usuario.contrasena',
        'usuario.correoElectronico',
        'usuario.estado',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
        'persona.tipoDocumento',
        'persona.nroDocumento',
        'persona.fechaNacimiento',
        'persona.telefono',
        'persona.id',
        'usuarioRol',
        'rol',
        'olimpiada.id',
        'olimpiada.nombre',
        'olimpiada.fechaInicio',
        'olimpiada.fechaFin',
      ])
      .where({ id })
      .andWhere(
        '(olimpiada.estado = :activo or olimpiada.estado = :cerrado )',
        { activo: 'ACTIVO', cerrado: 'CERRADO' },
      )
      .orderBy({ 'olimpiada.fechaInicio': 'DESC' })
      .getOne();
  }

  buscarUsuarioPorCI(persona: PersonaDto) {
    return this.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .where('persona.nroDocumento = :ci', { ci: persona.nroDocumento })
      .getOne();
  }

  buscarUsuarioPorNombre(persona: PersonaDto) {
    const ci = persona.nroDocumento.split('-');
    const queryBuilder = this.createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .where("split_part(persona.nroDocumento, '-', 1) = :nroDocumento", {
        nroDocumento: ci[0],
      })
      .andWhere('persona.fechaNacimiento = :fechaNacimiento', {
        fechaNacimiento: persona.fechaNacimiento,
      });
    /*
    if (persona.primerApellido) {
      queryBuilder.andWhere('persona.primer_apellido = :primerApellido', {
        primerApellido: persona.primerApellido,
      });
    }
    if (persona.segundoApellido) {
      queryBuilder.andWhere('persona.segundo_apellido = :segundoApellido', {
        segundoApellido: persona.segundoApellido,
      });
    }
    */
    return queryBuilder.getOne();
  }

  buscarUsuarioPorCorreo(correo: string) {
    return this.createQueryBuilder('usuario')
      .where('LOWER(usuario.correoElectronico) = LOWER(:correo)', { correo })
      .getOne();
  }
  async crear(
    usuarioDto: CrearUsuarioDto,
    roles: Array<CrearUsuarioRolDto>,
    usuarioAuditoria: string,
  ) {
    const usuarioRoles: UsuarioRol[] = roles.map((item) => {
      // Rol
      const rol = new Rol();
      rol.id = item.idRol;
      // UsuarioRol
      const usuarioRol = new UsuarioRol();
      usuarioRol.rol = rol;
      usuarioRol.usuarioCreacion = usuarioAuditoria;

      // olimpiada
      const olimpiada = new Olimpiada();
      olimpiada.id = item.idOlimpiada;
      usuarioRol.olimpiada = olimpiada;

      // departamento
      if (item.idDepartamento) {
        const departamento = new Departamento();
        departamento.id = item.idDepartamento;
        usuarioRol.departamento = departamento;
      }
      // distrito
      if (item.idDistrito) {
        const distrito = new Distrito();
        distrito.id = item.idDistrito;
        usuarioRol.distrito = distrito;
      }
      // unidadEducativa
      if (item.idUnidadEducativa) {
        const unidadEducativa = new UnidadEducativa();
        unidadEducativa.id = item.idUnidadEducativa;
        usuarioRol.unidadEducativa = unidadEducativa;
      }
      // area
      if (item.idArea) {
        const area = new Area();
        area.id = item.idArea;
        usuarioRol.area = area;
      }
      // etapa
      if (item.idEtapa) {
        const etapa = new Etapa();
        etapa.id = item.idEtapa;
        usuarioRol.etapa = etapa;
      }

      return usuarioRol;
    });

    // Persona
    const persona = new Persona();
    persona.nombres = usuarioDto?.persona?.nombres ?? null;
    persona.primerApellido = usuarioDto?.persona?.primerApellido ?? null;
    persona.segundoApellido = usuarioDto?.persona?.segundoApellido ?? null;
    persona.nroDocumento =
      usuarioDto?.persona?.nroDocumento ?? usuarioDto.usuario;
    persona.fechaNacimiento = usuarioDto?.persona?.fechaNacimiento ?? null;
    persona.telefono = usuarioDto?.persona?.telefono ?? null;
    persona.usuarioCreacion = usuarioAuditoria;
    // Usuario
    const usuario = new Usuario();
    usuario.persona = persona;
    usuario.usuarioRol = usuarioRoles;

    usuario.usuario = usuarioDto?.persona?.nroDocumento ?? usuarioDto.usuario;
    usuario.estado = usuarioDto?.estado ?? Status.CREATE;
    usuario.correoElectronico = usuarioDto?.correoElectronico;
    usuario.contrasena =
      usuarioDto?.contrasena ??
      (await TextService.encrypt(TextService.generateUuid()));
    usuario.usuarioCreacion = usuarioAuditoria;

    return this.save(usuario);
  }

  async actualizarContadorBloqueos(idUsuario, intento) {
    const usuario = new Usuario();
    usuario.id = idUsuario;
    usuario.intentos = intento;

    return this.save(usuario);
  }

  async actualizarDatosBloqueo(idUsuario, codigo, fechaBloqueo) {
    const usuario = new Usuario();
    usuario.id = idUsuario;
    usuario.codigoDesbloqueo = codigo;
    usuario.fechaBloqueo = fechaBloqueo;

    return this.save(usuario);
  }

  buscarPorCodigoDesbloqueo(codigo: string) {
    return this.createQueryBuilder('usuario')
      .select(['usuario.id', 'usuario.estado', 'usuario.fechaBloqueo'])
      .where('usuario.codigoDesbloqueo = :codigo', { codigo })
      .getOne();
  }

  actualizarDatosPersona(persona: PersonaDto) {
    return this.createQueryBuilder()
      .update(Persona)
      .set(persona)
      .where('nroDocumento = :nroDocumento', {
        nroDocumento: persona.nroDocumento,
      })
      .execute();
  }

  async runTransaction(op) {
    return this.manager.transaction(op);
  }
}
