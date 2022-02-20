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
import { UnidadEducativaService } from '../service/unidadEducativa.service';
import {
  UnidadEducativaDto,
  UnidadEducativaRespuestaDto,
} from '../dto/unidadEducativa.dto';
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

@Controller('unidades-educativas')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class UnidadEducativaController extends AbstractController {
  constructor(private unidadEducativaService: UnidadEducativaService) {
    super();
  }

  // GET unidadEducativas
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiDocSuccessList('Listar unidades educativas', UnidadEducativaRespuestaDto)
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.unidadEducativaService.listar(paginacionQueryDto);
    return this.successList(result);
  }

  // GET unidadEducativa
  @ApiDocSuccesGetById(
    'Obtener unidad educativa por Id',
    UnidadEducativaRespuestaDto,
  )
  @Get(':id')
  async buscarPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.unidadEducativaService.buscarPorId(id);
    return this.successList(result);
  }

  // create unidadEducativa
  @ApiDocSuccessCreate('Crear área', UnidadEducativaRespuestaDto)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async crear(@Req() req, @Body() unidadEducativaDto: UnidadEducativaDto) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.unidadEducativaService.crear(
      unidadEducativaDto,
      usuarioAuditoria,
    );
    return this.successCreate(result);
  }

  // update unidadEducativa
  @ApiDocSuccessUpdate('Actualizar área', UnidadEducativaRespuestaDto)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async actualizar(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() unidadEducativaDto: UnidadEducativaDto,
  ) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.unidadEducativaService.actualizar(
      id,
      unidadEducativaDto,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  // activar unidadEducativa
  @ApiDocSuccessUpdate('Activar unidad educativa', UnidadEducativaRespuestaDto)
  @Patch('/activacion/:id')
  async activar(@Req() req, @Param('id', new ParseUUIDPipe()) id: string) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.unidadEducativaService.activar(
      id,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  // inactivar unidadEducativa
  @ApiDocSuccessUpdate(
    'Inactivar unidad educativa',
    UnidadEducativaRespuestaDto,
  )
  @Patch('/inactivacion/:id')
  async inactivar(@Req() req, @Param('id', new ParseUUIDPipe()) id: string) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.unidadEducativaService.inactivar(
      id,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  // delete unidadEducativa
  @ApiDocSuccessDelete('Eliminar área', UnidadEducativaRespuestaDto)
  @Delete(':id')
  async eliminar(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.unidadEducativaService.eliminar(id);
    return this.successDelete(result);
  }
}
