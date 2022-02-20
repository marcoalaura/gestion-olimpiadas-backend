import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AbstractController } from '../../common/dto/abstract-controller.dto';
import { JwtAuthGuard } from '../../core/authentication/guards/jwt-auth.guard';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UsuarioService } from './usuario.service';
import { Messages } from '../../common/constants/response-messages';
import { ParamUuidDto } from '../../common/dto/params-uuid.dto';
import { ActualizarContrasenaDto } from './dto/actualizar-contrasena.dto';
import { ActualizarUsuarioRolDto } from './dto/actualizar-usuario-rol.dto';
import { FiltrosUsuarioDto } from './dto/filtros-usuario.dto';

import { EntityUnauthorizedException } from '../../common/exceptions/entity-unauthorized.exception';
import { Public } from '../../common/decorators/public.decorator';
import { CasbinOff } from '../../common/decorators/casbin-off.decorator';
import { CasbinGuard } from '../../core/authorization/guards/casbin.guard';

@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('usuarios')
export class UsuarioController extends AbstractController {
  constructor(private usuarioService: UsuarioService) {
    super();
  }
  // GET users
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get()
  async listar(@Query() paginacionQueryDto: FiltrosUsuarioDto) {
    const result = await this.usuarioService.listar(paginacionQueryDto);
    return this.successList(result);
  }

  @CasbinOff()
  @Get('roles')
  async obtenerRol(@Request() req: any) {
    const respuesta = {};
    Object.assign(respuesta, {
      rol: req.user.rol,
      idRol: req.user.idRol,
      nivel: req.user.nivel,
    });
    return this.successList(respuesta);
  }

  @Get('perfil')
  async obtenerPerfil(@Request() req: any) {
    const idUsuario = this.getIdUser(req);
    const result = await this.usuarioService.buscarUsuarioId(idUsuario);
    return this.successList(result);
  }

  //create user
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async crear(@Req() req, @Body() usuarioDto: CrearUsuarioDto) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.usuarioService.crear(
      usuarioDto,
      usuarioAuditoria,
    );
    return this.successCreate(result);
  }

  // activar usuario
  @Patch('/activacion/:id')
  @UsePipes(ValidationPipe)
  async activar(@Req() req, @Param() params: ParamUuidDto) {
    const { id: idUsuario } = params;
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.usuarioService.activar(
      idUsuario,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  // inactivar usuario
  @Patch('/inactivacion/:id')
  async inactivar(@Req() req: any, @Param() param: ParamUuidDto) {
    const { id: idUsuario } = param;
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.usuarioService.inactivar(
      idUsuario,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  @CasbinOff()
  @UsePipes(ValidationPipe)
  @Patch('/contrasena')
  async actualizarContrasena(
    @Req() req: any,
    @Body() body: ActualizarContrasenaDto,
  ) {
    const idUsuario = this.getIdUser(req);
    const { contrasenaActual, contrasenaNueva } = body;
    const result = await this.usuarioService.actualizarContrasena(
      idUsuario,
      contrasenaActual,
      contrasenaNueva,
    );
    return this.successUpdate(result);
  }

  @UsePipes(ValidationPipe)
  @Patch('/contrasena/:id')
  async restaurarContrasena(@Req() req: any, @Param() param: ParamUuidDto) {
    const usuarioAuditoria = this.getIdUser(req);
    const { id: idUsuario } = param;
    const result = await this.usuarioService.restaurarContrasena(
      idUsuario,
      usuarioAuditoria,
    );
    return this.successUpdate(result, Messages.SUCCESS_RESTART_PASSWORD);
  }

  //update user
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async actualizarDatos(
    @Param() param: ParamUuidDto,
    @Body() usuarioDto: ActualizarUsuarioRolDto,
    @Req() req: any,
  ) {
    const usuarioAuditoria = this.getIdUser(req);
    const { id: idUsuario } = param;
    const result = await this.usuarioService.actualizarDatos(
      idUsuario,
      usuarioDto,
      usuarioAuditoria,
    );

    if (idUsuario === req.user.id) {
      throw new EntityUnauthorizedException(
        'Debe ingresar nuevamente para que se apliquen los cambios.',
      );
    }

    return this.successUpdate(result);
  }

  @Public()
  @CasbinOff()
  @Get('desbloqueo')
  @UsePipes(ValidationPipe)
  async desbloquearCuenta(@Query() query: ParamUuidDto) {
    const { id: idDesbloqueo } = query;
    const result = await this.usuarioService.desbloquearCuenta(idDesbloqueo);
    return this.successCreate(result, Messages.SUCCESS_ACCOUNT_UNLOCK);
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  @Get('/:uuid')
  async obtenerusuario(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    const result = await this.usuarioService.obtenerDetallesUsuario(uuid);
    return this.successList(result);
  }
}
