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
import { AreaService } from '../service/area.service';
import { AreaDto, AreaRespuestaDto } from '../dto/area.dto';
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard';
import {
  ApiDocSuccessList,
  ApiDocSuccesGetById,
  ApiDocSuccessCreate,
  ApiDocSuccessUpdate,
  ApiDocSuccessDelete,
} from '../../../common/decorators/apidoc.decorator';
@Controller('areas')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class AreaController extends AbstractController {
  constructor(private areaService: AreaService) {
    super();
  }

  // GET areas
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiDocSuccessList('Listar áreas', AreaRespuestaDto)
  @Get()
  async recuperar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.areaService.recuperar(paginacionQueryDto);
    return this.successList(result);
  }
  // GET areas super usuario
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiDocSuccessList('Listar áreas', AreaRespuestaDto)
  @Get('listar')
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.areaService.listar(paginacionQueryDto);
    return this.successList(result);
  }

  // GET area
  @ApiDocSuccesGetById('Obtener área por Id', AreaRespuestaDto)
  @Get(':id')
  async buscarPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.areaService.buscarPorId(id);
    return this.successList(result);
  }

  // create area
  @ApiDocSuccessCreate('Crear área', AreaRespuestaDto)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async crear(@Req() req, @Body() areaDto: AreaDto) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.areaService.crear(areaDto, usuarioAuditoria);
    return this.successCreate(result);
  }

  // update area
  @ApiDocSuccessUpdate('Actualizar área', AreaRespuestaDto)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch(':id')
  async actualizar(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() areaDto: AreaDto,
  ) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.areaService.actualizar(
      id,
      areaDto,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  // activar area
  @ApiDocSuccessUpdate('Activar área', AreaRespuestaDto)
  @Patch('/activacion/:id')
  async activar(@Req() req, @Param('id', new ParseUUIDPipe()) id: string) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.areaService.activar(id, usuarioAuditoria);
    return this.successUpdate(result);
  }

  // inactivar area
  @ApiDocSuccessUpdate('Inactivar área', AreaRespuestaDto)
  @Patch('/inactivacion/:id')
  async inactivar(@Req() req, @Param('id', new ParseUUIDPipe()) id: string) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.areaService.inactivar(id, usuarioAuditoria);
    return this.successUpdate(result);
  }

  // delete area
  @ApiDocSuccessDelete('Eliminar área', AreaRespuestaDto)
  @Delete(':id')
  async eliminar(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.areaService.eliminar(id);
    return this.successDelete(result);
  }
}
