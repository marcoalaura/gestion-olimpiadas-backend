import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DistritoService } from '../service/distrito.service';
import { DistritoDto, DistritoRespuestaDto } from '../dto/distrito.dto';
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import {
  ApiDocSuccessList,
  ApiDocSuccesGetById,
  ApiDocSuccessCreate,
  ApiDocSuccessUpdate,
  ApiDocSuccessDelete,
} from '../../../common/decorators/apidoc.decorator';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';

@Controller('distritos')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class DistritoController extends AbstractController {
  constructor(private distritoService: DistritoService) {
    super();
  }

  // GET distritos
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiDocSuccessList('Listar distritos', DistritoRespuestaDto)
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.distritoService.listar(paginacionQueryDto);
    return this.successList(result);
  }

  // GET distrito
  @ApiDocSuccesGetById('Obtener distrito por Id', DistritoRespuestaDto)
  @Get(':id')
  async buscarPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.distritoService.buscarPorId(id);
    return this.successList(result);
  }

  // create distrito
  @ApiDocSuccessCreate('Crear distrito', DistritoRespuestaDto)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async crear(@Req() req, @Body() distritoDto: DistritoDto) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.distritoService.crear(
      distritoDto,
      usuarioAuditoria,
    );
    return this.successCreate(result);
  }

  // update distrito
  @ApiDocSuccessUpdate('Actualizar distrito', DistritoRespuestaDto)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async actualizar(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() distritoDto: DistritoDto,
  ) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.distritoService.actualizar(
      id,
      distritoDto,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  // activar distrito
  @ApiDocSuccessUpdate('Activar distrito', DistritoRespuestaDto)
  @Patch('/activacion/:id')
  async activar(@Req() req, @Param('id', new ParseUUIDPipe()) id: string) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.distritoService.activar(id, usuarioAuditoria);
    return this.successUpdate(result);
  }

  // inactivar distrito
  @ApiDocSuccessUpdate('Inactivar distrito', DistritoRespuestaDto)
  @Patch('/inactivacion/:id')
  async inactivar(@Req() req, @Param('id', new ParseUUIDPipe()) id: string) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.distritoService.inactivar(id, usuarioAuditoria);
    return this.successUpdate(result);
  }

  // delete distrito
  @ApiDocSuccessDelete('Eliminar distrito', DistritoRespuestaDto)
  @Delete(':id')
  async eliminar(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.distritoService.eliminar(id);
    return this.successDelete(result);
  }
}
