import {
  HttpException,
  Injectable,
  PreconditionFailedException,
  Query,
} from '@nestjs/common';
import { UsuarioRepository } from './usuario.repository';
import { PersonaRepository } from './../persona/persona.repository';
import { Usuario } from './usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TotalRowsResponseDto } from '../../common/dto/total-rows-response.dto';
import { totalRowsResponse } from '../../common/lib/http.module';
import { Status, grupoRol } from '../../common/constants';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { TextService } from '../../common/lib/text.service';
import { MensajeriaService } from '../../core/external-services/mensajeria/mensajeria.service';
import { EntityNotFoundException } from '../../common/exceptions/entity-not-found.exception';
import { Messages } from '../../common/constants/response-messages';
import { AuthorizationService } from '../../core/authorization/controller/authorization.service';
import { ActualizarUsuarioDto } from './dto/actualizar-usuario.dto';
import { PersonaDto } from '../persona/persona.dto';
import { UsuarioRolRepository } from './usuario-rol.repository';
import { ActualizarUsuarioRolDto } from './dto/actualizar-usuario-rol.dto';
import { SegipService } from '../../core/external-services/iop/segip/segip.service';
import { ConfigService } from '@nestjs/config';
import { TemplateEmailService } from '../../common/templates/templates-email.service';
import { FiltrosUsuarioDto } from './dto/filtros-usuario.dto';
import { RolRepository } from '../../core/authorization/repository/rol.repository';
import { RolEnum } from '../../core/authorization/rol.enum';
import { EtapaRepository } from '../olimpiada/repository/etapa.repository';
import { DepartamentoRepository } from '../olimpiada/repository/departamento.repository';
import { DistritoRepository } from '../olimpiada/repository/distrito.repository';
import { OlimpiadaRepository } from '../olimpiada/olimpiada.repository';
import { UnidadEducativaRepository } from '../olimpiada/repository/unidadEducativa.repository';
import { AreaRepository } from '../olimpiada/repository/area.repository';
import { isUUID } from 'class-validator';
import { CrearUsuarioRolDto } from './dto/crear-usuario-rol.dto';

@Injectable()
export class UsuarioService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(UsuarioRepository)
    private usuarioRepositorio: UsuarioRepository,
    @InjectRepository(UsuarioRolRepository)
    private usuarioRolRepositorio: UsuarioRolRepository,
    private readonly mensajeriaService: MensajeriaService,
    private readonly authorizationService: AuthorizationService,
    private readonly segipServices: SegipService,
    @InjectRepository(PersonaRepository)
    private personaRepositorio: PersonaRepository,
    private configService: ConfigService,
    @InjectRepository(RolRepository)
    private rolRepositorio: RolRepository,
    @InjectRepository(OlimpiadaRepository)
    private olimpiadaRepositorio: OlimpiadaRepository,
    @InjectRepository(EtapaRepository)
    private etapaRepositorio: EtapaRepository,
    @InjectRepository(DepartamentoRepository)
    private departamentoRepositorio: DepartamentoRepository,
    @InjectRepository(DistritoRepository)
    private distritoRepositorio: DistritoRepository,
    @InjectRepository(UnidadEducativaRepository)
    private unidadEducativaRepositorio: UnidadEducativaRepository,
    @InjectRepository(AreaRepository)
    private areaRepositorio: AreaRepository,
  ) {}

  // GET USERS
  async listar(
    @Query() paginacionQueryDto: FiltrosUsuarioDto,
  ): Promise<TotalRowsResponseDto> {
    const resultado = await this.usuarioRepositorio.listar(paginacionQueryDto);
    return totalRowsResponse([this.filtrarRoles(resultado[0]), resultado[1]]);
  }

  async obtenerDetallesUsuario(usuario: string): Promise<any> {
    const resultado = await this.usuarioRepositorio.recuperarDetallesUsuario(
      usuario,
    );
    return this.filtrarRoles([resultado]);
  }

  async buscarUsuario(usuario: string): Promise<Usuario> {
    return this.usuarioRepositorio.buscarUsuario(usuario);
  }

  async crear(usuarioDto: CrearUsuarioDto, usuarioAuditoria: string) {
    const usuario = await this.usuarioRepositorio.buscarUsuarioPorCI(
      usuarioDto.persona,
    );
    if (!usuario) {
      // verificar si el usuario no esta registrado (nombres y apellidos)
      const duplicado = await this.usuarioRepositorio.buscarUsuarioPorNombre(
        usuarioDto.persona,
      );
      if (!duplicado) {
        // verificar si el correo no esta registrado
        const correo = await this.usuarioRepositorio.buscarUsuarioPorCorreo(
          usuarioDto.correoElectronico,
        );
        if (!correo) {
          // contrastacion segip
          const { persona } = usuarioDto;
          const contrastaSegip = await this.segipServices.contrastar(persona);
          if (contrastaSegip?.finalizado) {
            const contrasena = TextService.generateShortRandomText();
            usuarioDto.contrasena = await TextService.encrypt(contrasena);
            usuarioDto.estado = Status.ASIGNADO;
            // validar rol
            const nuevosRoles = await this.validar(usuarioDto.roles, null);
            const result = await this.usuarioRepositorio.crear(
              usuarioDto,
              nuevosRoles,
              usuarioAuditoria,
            );
            // enviar correo con credenciales
            const datosCorreo = {
              correo: usuarioDto.correoElectronico,
              asunto: Messages.SUBJECT_EMAIL_ACCOUNT_ACTIVE,
            };
            await this.enviarCorreoContrasenia(
              datosCorreo,
              usuarioDto.persona.nroDocumento,
              contrasena,
            );
            const { id, estado } = result;
            return { id, estado };
          }
          throw new PreconditionFailedException(contrastaSegip.mensaje);
        }
        throw new PreconditionFailedException(Messages.EXISTING_EMAIL);
      }
      throw new PreconditionFailedException(Messages.EXISTING_NAME);
    }
    throw new PreconditionFailedException(Messages.EXISTING_USER);
  }

  async validar(roles, idUsuario) {
    const olimpiadas = {};
    let nuevosRoles = [];
    for (const i in roles) {
      const item = roles[i];
      // olimpiada
      if (!item.idOlimpiada) {
        throw new PreconditionFailedException(
          `Roles[${i}].idOlimpiada es requerido`,
        );
      }
      if (!isUUID(item.idOlimpiada)) {
        throw new PreconditionFailedException(
          `Roles[${i}].idOlimpiada debe ser UUID`,
        );
      }
      const olimpiada = await this.olimpiadaRepositorio.buscarPorId(
        item.idOlimpiada,
      );
      if (!olimpiada) {
        throw new EntityNotFoundException(
          `Roles[${i}].idOlimpiada ${item.idOlimpiada} no encontrado`,
        );
      }
      // olimpiada repetida
      if (olimpiadas[item.idOlimpiada]) {
        throw new PreconditionFailedException(
          `No se permiten olimpiadas repetidas (${olimpiada.nombre})`,
        );
      }
      olimpiadas[item.idOlimpiada] = (olimpiadas[item.idOlimpiada] || 0) + 1;

      // usuarioRoles
      if (!item.usuarioRoles) {
        throw new PreconditionFailedException(
          `Roles[${i}].usuarioRoles es requerido`,
        );
      }
      const nuevosUsuarioRol: Array<CrearUsuarioRolDto> = await this.validarUsuarioRol(
        item.usuarioRoles,
        item.idOlimpiada,
        i,
        idUsuario,
      );
      nuevosRoles = nuevosRoles.concat(nuevosUsuarioRol);
    }
    return nuevosRoles;
  }

  // validar usuarioRol por olimpiada
  async validarUsuarioRol(
    usuarioRoles: any,
    idOlimpiada: string,
    posicion: string,
    idUsuario: string,
  ) {
    const roles = {};
    const nuevosRoles = [];
    for (const i in usuarioRoles) {
      const item = usuarioRoles[i];

      const nuevoRol: CrearUsuarioRolDto = {};

      let rol = null;
      // usuarioRol
      if (item.id) {
        const usuarioRol = await this.usuarioRolRepositorio.buscarPorId(
          item.id,
        );
        if (!usuarioRol) {
          throw new EntityNotFoundException(
            `Roles[${posicion}].usuarioRoles[${i}].id ${item.id} no encontrado`,
          );
        }
        if (
          usuarioRol.idUsuario != idUsuario ||
          usuarioRol.idOlimpiada != idOlimpiada
        ) {
          throw new EntityNotFoundException(
            `Roles[${posicion}].usuarioRoles[${i}] no pertenece al usuario`,
          );
        }
        rol = usuarioRol.rol;
        nuevoRol.id = item.id;
        nuevoRol.idRol = usuarioRol.idRol;
        nuevoRol.idOlimpiada = usuarioRol.idOlimpiada;
        nuevoRol.estado = item.estado;
        nuevoRol.idDepartamento = null;
        nuevoRol.idDistrito = null;
        nuevoRol.idUnidadEducativa = null;
        nuevoRol.idEtapa = null;
        nuevoRol.idArea = null;
      } else {
        // rol
        if (!item.idRol) {
          throw new PreconditionFailedException(
            `Roles[${posicion}].usuarioRoles[${i}].idRol es requerido`,
          );
        }
        if (!isUUID(item.idRol)) {
          throw new PreconditionFailedException(
            `Roles[${posicion}].usuarioRoles[${i}].idRol debe ser UUID`,
          );
        }
        const rolCrear = await this.rolRepositorio.buscarPorId(item.idRol);
        if (!rolCrear) {
          throw new EntityNotFoundException(
            `Roles[${posicion}].usuarioRoles[${i}].idRol ${item.idRol} no encontrado`,
          );
        }
        rol = rolCrear;

        // usuarioRol registrado
        const usuarioRol = await this.usuarioRolRepositorio.obtenerPorUsuarioOlimpiadaRol(
          idUsuario,
          idOlimpiada,
          item.idRol,
        );
        if (usuarioRol?.length > 0) {
          throw new EntityNotFoundException(
            `Roles[${posicion}].usuarioRoles[${i}].idRol ${item.idRol} ya se encuentra registrado`,
          );
        }
        nuevoRol.idRol = item.idRol;
        nuevoRol.idOlimpiada = idOlimpiada;
      }

      // rol repetido por competencia
      if (roles[rol.id]) {
        throw new PreconditionFailedException(
          `No se permiten roles repetidos por competencia (${rol.nombre})`,
        );
      }
      roles[rol.id] = (roles[rol.id] || 0) + 1;

      if (rol.grupo === grupoRol.ACTOR) {
        // obligatorios
        for (const j in rol.campos) {
          const campo = rol.campos[j];
          if (!item[campo]) {
            throw new PreconditionFailedException(
              `Roles[${posicion}].usuarioRoles[${i}].${campo} es requerido`,
            );
          }
          if (!isUUID(item[campo])) {
            throw new PreconditionFailedException(
              `Roles[${posicion}].usuarioRoles[${i}].${campo} debe ser UUID`,
            );
          }
          const objeto = await this.validarObjeto(
            item[campo],
            i,
            campo,
            posicion,
          );

          // etapa
          if (campo === 'idEtapa') {
            if (objeto.olimpiada.id !== idOlimpiada) {
              throw new EntityNotFoundException(
                `Roles[${posicion}].usuarioRoles[${i}].idEtapa con id ${item.idEtapa} no corresponde a la competencia con id ${idOlimpiada}`,
              );
            }
          }
          nuevoRol[campo] = item[campo];
        }
      }
      nuevosRoles.forEach((fila) => {
        // control misma área
        if (
          (rol.rol === RolEnum.COMITE_DOCENTE_CARGA ||
            rol.rol === RolEnum.COMITE_DOCENTE_VERIFICADOR) &&
          item.idEtapa === fila.idEtapa &&
          item.idArea !== fila.idArea
        ) {
          throw new PreconditionFailedException(
            `La verificación de preguntas debe ser de la misma área a la que el usuario está asignado para la carga de preguntas`,
          );
        }
      });
      nuevosRoles.push(nuevoRol);
    }
    return nuevosRoles;
  }

  async validarObjeto(id, posicion, campo, posicionO) {
    let repositorio;
    switch (campo) {
      case 'idDepartamento':
        repositorio = this.departamentoRepositorio;
        break;
      case 'idDistrito':
        repositorio = this.distritoRepositorio;
        break;
      case 'idUnidadEducativa':
        repositorio = this.unidadEducativaRepositorio;
        break;
      case 'idArea':
        repositorio = this.areaRepositorio;
        break;
      case 'idEtapa':
        repositorio = this.etapaRepositorio;
        break;
      default:
        repositorio = null;
        break;
    }
    if (!repositorio) {
      throw new HttpException('Error en asignación de campo obligatorio', 400);
    }
    const objeto = await repositorio.buscarPorId(id);
    if (!objeto) {
      throw new EntityNotFoundException(
        `Roles[${posicionO}].usuarioRoles[${posicion}].${campo} con id ${id} no encontrado`,
      );
    }
    return objeto;
  }

  private filtrarRoles(usuarios) {
    const resultado = [];
    usuarios.forEach((usuario) => {
      const objeto = {};
      usuario.usuarioRol.forEach((ur) => {
        const id = ur.olimpiada.id;
        if (!objeto[id]) {
          objeto[id] = { olimpiada: ur.olimpiada, usuarioRol: [] };
        }
        delete ur.olimpiada;
        objeto[id].usuarioRol.push(ur);
      });

      const usuarioRol = [];
      for (const prop in objeto) {
        usuarioRol.push(objeto[prop]);
      }
      usuario['olimpiadas'] = usuarioRol;
      delete usuario.usuarioRol;
      resultado.push(usuario);
    });
    return resultado;
  }

  async activar(idUsuario, usuarioAuditoria: string) {
    const usuario = await this.usuarioRepositorio.findOne(idUsuario);
    const statusValid = [Status.CREATE, Status.INACTIVE, Status.ASIGNADO];
    if (usuario && statusValid.includes(usuario.estado as Status)) {
      // cambiar estado al usuario y generar una nueva contrasena
      const contrasena = TextService.generateShortRandomText();
      const usuarioDto = new ActualizarUsuarioDto();
      usuarioDto.contrasena = await TextService.encrypt(contrasena);
      usuarioDto.estado = Status.ASIGNADO;
      usuarioDto.usuarioActualizacion = usuarioAuditoria;
      await this.usuarioRepositorio.update(idUsuario, usuarioDto);
      // si todo bien => enviar el mail con la contraseña generada
      const datosCorreo = {
        correo: usuario.correoElectronico,
        asunto: Messages.SUBJECT_EMAIL_ACCOUNT_ACTIVE,
      };
      await this.enviarCorreoContrasenia(
        datosCorreo,
        usuario.usuario,
        contrasena,
      );
      return { id: idUsuario, estado: usuarioDto.estado };
    }
    throw new EntityNotFoundException(Messages.INVALID_USER);
  }

  async inactivar(idUsuario: string, usuarioAuditoria: string) {
    const usuario = await this.usuarioRepositorio.findOne(idUsuario);
    if (usuario) {
      const usuarioDto = new ActualizarUsuarioDto();
      usuarioDto.usuarioActualizacion = usuarioAuditoria;
      usuarioDto.estado = Status.INACTIVE;
      await this.usuarioRepositorio.update(idUsuario, usuarioDto);
      return {
        id: idUsuario,
        estado: usuarioDto.estado,
      };
    }
    throw new EntityNotFoundException(Messages.INVALID_USER);
  }

  private async enviarCorreoContrasenia(datosCorreo, usuario, contrasena) {
    const url = this.configService.get('URL_FRONTEND');
    const template = TemplateEmailService.armarPlantillaActivacionCuenta(
      url,
      usuario,
      contrasena,
    );
    const result = await this.mensajeriaService.sendEmail(
      datosCorreo.correo,
      datosCorreo.asunto,
      template,
    );
    return result.finalizado;
  }

  async actualizarContrasena(idUsuario, contrasenaActual, contrasenaNueva) {
    const hash = TextService.decodeBase64(contrasenaActual);
    const usuario = await this.usuarioRepositorio.buscarUsuarioRolPorId(
      idUsuario,
    );
    if (usuario && (await TextService.compare(hash, usuario.contrasena))) {
      // validar que la contrasena nueva cumpla nivel de seguridad
      const contrasena = TextService.decodeBase64(contrasenaNueva);
      if (TextService.validateLevelPassword(contrasena)) {
        // guardar en bd
        const usuarioDto = new ActualizarUsuarioDto();
        usuarioDto.contrasena = await TextService.encrypt(contrasena);
        usuarioDto.estado = Status.ACTIVE;
        usuarioDto.usuarioActualizacion = idUsuario;
        await this.usuarioRepositorio.update(idUsuario, usuarioDto);
        return {
          id: idUsuario,
          estado: usuarioDto.estado,
        };
      }
      throw new PreconditionFailedException(Messages.INVALID_PASSWORD_SCORE);
    }
    throw new PreconditionFailedException(Messages.INVALID_CREDENTIALS);
  }

  async restaurarContrasena(idUsuario: string, usuarioAuditoria: string) {
    const usuario = await this.usuarioRepositorio.findOne(idUsuario);
    const statusValid = [Status.ACTIVE, Status.ASIGNADO];
    if (usuario && statusValid.includes(usuario.estado as Status)) {
      const contrasena = TextService.generateShortRandomText();
      const usuarioDto = new ActualizarUsuarioDto();
      usuarioDto.contrasena = await TextService.encrypt(contrasena);
      usuarioDto.estado = Status.ASIGNADO;
      usuarioDto.intentos = 0;
      usuarioDto.usuarioActualizacion = usuarioAuditoria;

      const op = async (transaction) => {
        const repositorio = transaction.getRepository(Usuario);
        await repositorio.update(idUsuario, usuarioDto);
        // si todo bien => enviar el mail con la contraseña generada
        const datosCorreo = {
          correo: usuario.correoElectronico,
          asunto: Messages.SUBJECT_EMAIL_ACCOUNT_RESET,
        };
        await this.enviarCorreoContrasenia(
          datosCorreo,
          usuario.usuario,
          contrasena,
        );
      };
      await this.usuarioRepositorio.runTransaction(op);
      return { id: idUsuario, estado: usuarioDto.estado };
    }
    throw new EntityNotFoundException(Messages.INVALID_USER);
  }

  async actualizarDatos(
    id: string,
    usuarioDto: ActualizarUsuarioRolDto,
    usuarioAuditoria: string,
  ) {
    // 1. verificar que exista el usuario
    const usuario = await this.usuarioRepositorio.buscarUsuarioRolPorId(id);
    if (usuario) {
      if (!(usuario?.estado === 'ACTIVO' || usuario?.estado === 'ASIGNADO'))
        throw new EntityNotFoundException(
          Messages.INVALID_UPDATE_USER_PERMISSIONS,
        );
      const { correoElectronico, roles } = usuarioDto;
      // 2. verificar que el email no este registrado
      const op = async (transaction) => {
        // usuario
        if (
          correoElectronico &&
          correoElectronico !== usuario.correoElectronico
        ) {
          const existe = await this.usuarioRepositorio.buscarUsuarioPorCorreo(
            correoElectronico,
          );
          if (existe) {
            throw new PreconditionFailedException(Messages.EXISTING_EMAIL);
          }
          const actualizarUsuarioDto = new ActualizarUsuarioDto();
          actualizarUsuarioDto.correoElectronico = correoElectronico;
          actualizarUsuarioDto.usuarioActualizacion = usuarioAuditoria;
          const repositoryUsuario = transaction.getCustomRepository(
            UsuarioRepository,
          );
          await repositoryUsuario.update(id, actualizarUsuarioDto);
        }
        // roles
        const nuevosRoles = await this.validar(roles, id);
        if (nuevosRoles.length > 0) {
          const repositoryUsuarioRol = transaction.getCustomRepository(
            UsuarioRolRepository,
          );
          // await repositoryUsuarioRol.inactivarUsuarioRol(id, usuarioAuditoria);
          await repositoryUsuarioRol.crearUsuarioRol(
            id,
            nuevosRoles,
            usuarioAuditoria,
          );
        }
        // persona
        const persona_ = await this.personaRepositorio.findOne(
          usuario.persona.id,
        );
        persona_.telefono = usuarioDto.persona.telefono;
        persona_.usuarioActualizacion = usuarioAuditoria;
        const repositoryPersona = transaction.getCustomRepository(
          this.personaRepositorio,
        );
        await repositoryPersona.save(persona_);
      };
      await this.usuarioRepositorio.runTransaction(op);

      return { id };
    }
    throw new EntityNotFoundException(Messages.INVALID_USER);
  }

  private async actualizarRoles(id, roles) {
    const usuarioRoles = await this.usuarioRolRepositorio.obtenerRolesPorUsuario(
      id,
    );
    const { inactivos, activos, nuevos } = this.verificarUsuarioRoles(
      usuarioRoles,
      roles,
    );
    // ACTIVAR roles inactivos
    if (inactivos.length > 0) {
      await this.usuarioRolRepositorio.activarOInactivar(
        id,
        inactivos,
        Status.ACTIVE,
      );
    }
    // INACTIVAR roles activos
    if (activos.length > 0) {
      await this.usuarioRolRepositorio.activarOInactivar(
        id,
        activos,
        Status.INACTIVE,
      );
    }
    // CREAR nuevos roles
    if (nuevos.length > 0) {
      await this.usuarioRolRepositorio.crear(id, nuevos);
    }
  }
  private verificarUsuarioRoles(usuarioRoles, roles) {
    const inactivos = roles.filter((rol) =>
      usuarioRoles.some(
        (usuarioRol) =>
          usuarioRol.rol.id === rol && usuarioRol.estado === Status.INACTIVE,
      ),
    );

    const activos = usuarioRoles
      .map((usuarioRol) =>
        roles.every(
          (rol) =>
            rol !== usuarioRol.rol.id && usuarioRol.estado === Status.ACTIVE,
        )
          ? usuarioRol.rol.id
          : null,
      )
      .filter(Boolean);

    const nuevos = roles.filter((rol) =>
      usuarioRoles.every((usuarioRol) => usuarioRol.rol.id !== rol),
    );

    return {
      activos,
      inactivos,
      nuevos,
    };
  }

  async buscarUsuarioId(idUsuario: string): Promise<any> {
    const usuario = await this.usuarioRepositorio.buscarUsuarioRolPorId(
      idUsuario,
    );
    let roles = [];
    if (usuario?.usuarioRol?.length) {
      roles = await Promise.all(
        usuario.usuarioRol.map(async (usuarioRol) => {
          const { id, rol, nombre, grupo } = usuarioRol.rol;
          if (usuarioRol.estado === Status.ACTIVE) {
            const modulos = await this.authorizationService.obtenerPermisosPorRol(
              rol,
            );
            return {
              idRol: id,
              rol,
              nombre,
              grupo,
              modulos,
            };
          }
          return false;
        }),
      );
      roles = roles.filter(Boolean);
    } else {
      throw new EntityNotFoundException(Messages.INVALID_USER);
    }
    return {
      id: usuario.id,
      usuario: usuario.usuario,
      estado: usuario.estado,
      roles,
      persona: usuario.persona,
    };
  }

  async buscarUsuarioPorCI(persona: PersonaDto): Promise<Usuario> {
    return this.usuarioRepositorio.buscarUsuarioPorCI(persona);
  }

  async actualizarContadorBloqueos(idUsuario: string, intento: number) {
    const usuario = await this.usuarioRepositorio.actualizarContadorBloqueos(
      idUsuario,
      intento,
    );
    return usuario;
  }

  async actualizarDatosBloqueo(idUsuario, codigo, fechaBloqueo) {
    const usuario = await this.usuarioRepositorio.actualizarDatosBloqueo(
      idUsuario,
      codigo,
      fechaBloqueo,
    );
    return usuario;
  }

  async desbloquearCuenta(codigo: string) {
    const usuario = await this.usuarioRepositorio.buscarPorCodigoDesbloqueo(
      codigo,
    );
    if (usuario?.fechaBloqueo) {
      const usuarioDto = new ActualizarUsuarioDto();
      usuarioDto.fechaBloqueo = null;
      usuarioDto.intentos = 0;
      usuarioDto.codigoDesbloqueo = null;
      await this.usuarioRepositorio.update(usuario.id, usuarioDto);
    }
    return { codigo };
  }

  async actualizarDatosPersona(datosPersona: PersonaDto) {
    const usuario = await this.usuarioRepositorio.actualizarDatosPersona(
      datosPersona,
    );
    return usuario;
  }
}
