import {
  Body,
  Controller,
  ParseUUIDPipe,
  Delete,
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
} from '@nestjs/common';
import { GradoEscolaridadService } from '../service/gradoEscolaridad.service';
import {
  GradoEscolaridadDto,
  GradoEscolaridadRespuestaDto,
} from '../dto/gradoEscolaridad.dto';
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { AbstractController } from 'src/common/dto/abstract-controller.dto';
import {
  ApiDocSuccessList,
  ApiDocSuccesGetById,
  ApiDocSuccessCreate,
  ApiDocSuccessUpdate,
  ApiDocSuccessDelete,
} from '../../../common/decorators/apidoc.decorator';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';

@Controller('grados-escolares')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class GradoEscolaridadController extends AbstractController {
  constructor(private gradoEscolaridadService: GradoEscolaridadService) {
    super();
  }

  // GET grados
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiDocSuccessList(
    'Obtener lista de grados escolares',
    GradoEscolaridadRespuestaDto,
  )
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.gradoEscolaridadService.listar(
      paginacionQueryDto,
    );
    return this.successList(result);
  }

  // GET grado
  @ApiDocSuccesGetById(
    'Obtener un grado escolar por UUID',
    GradoEscolaridadRespuestaDto,
  )
  @Get(':id')
  async buscarPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.gradoEscolaridadService.buscarPorId(id);
    return this.successList(result);
  }

  // create grado
  @ApiDocSuccessCreate(
    'Crear un nuevo grado escolar',
    GradoEscolaridadRespuestaDto,
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  async crear(
    @Req() req: Request,
    @Body() gradoEscolaridadDto: GradoEscolaridadDto,
  ) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.gradoEscolaridadService.crear(
      gradoEscolaridadDto,
      usuarioAuditoria,
    );
    return this.successCreate(result);
  }

  // update grado
  @ApiDocSuccessUpdate(
    'Actualizar un grado escolar',
    GradoEscolaridadRespuestaDto,
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch(':id')
  async actualizar(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() gradoEscolaridadDto: GradoEscolaridadDto,
  ) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.gradoEscolaridadService.actualizar(
      id,
      gradoEscolaridadDto,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  // activar gradoEscolaridad
  @ApiDocSuccessUpdate('Activar un grado escolar', GradoEscolaridadRespuestaDto)
  @Patch('/activacion/:id')
  async activar(@Req() req, @Param('id', new ParseUUIDPipe()) id: string) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.gradoEscolaridadService.activar(
      id,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  // inactivar gradoEscolaridad
  @ApiDocSuccessUpdate(
    'Inactivar un grado escolar',
    GradoEscolaridadRespuestaDto,
  )
  @Patch('/inactivacion/:id')
  async inactivar(@Req() req, @Param('id', new ParseUUIDPipe()) id: string) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.gradoEscolaridadService.inactivar(
      id,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  // delete grado
  @ApiDocSuccessDelete(
    'Eliminar un grado escolar',
    GradoEscolaridadRespuestaDto,
  )
  @Delete(':id')
  async eliminar(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.gradoEscolaridadService.eliminar(id);
    return this.successDelete(result);
  }
}
