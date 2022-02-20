import {
  Controller,
  ParseUUIDPipe,
  Get,
  Param,
  Body,
  Post,
  Query,
  Request,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { InscripcionService } from '../service/inscripcion.service';
import { EtapaAreaGradoService } from '../service/etapaAreaGrado.service';
import {
  InscripcionListadoRepuestaDto,
  InscripcionCreacionDto,
  InscripcionDeleteDto,
} from '../dto/inscripcion.dto';

import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { AbstractController } from 'src/common/dto/abstract-controller.dto';
import {
  ApiDocSuccessList,
  ApiDocSuccesGetById,
  ApiDocSuccessCreate,
  ApiDocSuccessDelete,
  ApiDocSuccessUpdate,
} from '../../../common/decorators/apidoc.decorator';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';

@Controller()
@UseGuards(JwtAuthGuard, CasbinGuard)
export class InscripcionController extends AbstractController {
  constructor(
    private inscripcionService: InscripcionService,
    private etapaAreaGradoService: EtapaAreaGradoService,
  ) {
    super();
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiDocSuccessList(
    'Obtener lista de inscripciones',
    InscripcionListadoRepuestaDto,
  )
  @Get('etapasAreaGrado/:id/inscripciones')
  async listar(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() paginacionQueryDto: PaginacionQueryDto,
  ) {
    const query = await this.etapaAreaGradoService.adicionarIdOlimpiada(
      id,
      paginacionQueryDto,
    );
    const result = await this.inscripcionService.listar(
      id,
      this.getNivel(req, query),
    );
    return this.successList(result);
  }

  @ApiDocSuccesGetById(
    'Obtener una inscripción por UUID',
    InscripcionListadoRepuestaDto,
  )
  @Get('/inscripciones/:id')
  async buscarPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.inscripcionService.buscarPorId(id);
    return this.successList(result);
  }

  @Post('/inscripciones')
  @ApiDocSuccessCreate(
    'Guardar o actualizar inscripción',
    InscripcionListadoRepuestaDto,
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  async guardarOActualizar(
    @Req() req: Request,
    @Body() inscripcionCreacionDto: InscripcionCreacionDto,
  ) {
    const idUsuario = this.getIdUser(req);
    return this.successCreate(
      await this.inscripcionService.crearActualizar(
        inscripcionCreacionDto,
        idUsuario,
        null,
      ),
    );
  }

  @Patch('/inscripciones/:uuid')
  @ApiDocSuccessCreate('Actualizar inscripción', InscripcionListadoRepuestaDto)
  @UsePipes(new ValidationPipe({ transform: true }))
  async actualizar(
    @Req() req: Request,
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() inscripcionCreacionDto: InscripcionCreacionDto,
  ) {
    const idUsuario = this.getIdUser(req);
    return this.successUpdate(
      await this.inscripcionService.crearActualizar(
        inscripcionCreacionDto,
        idUsuario,
        uuid,
      ),
    );
  }

  @ApiDocSuccessUpdate('Inactivar olimpiada', InscripcionListadoRepuestaDto)
  @Patch('/inscripciones/inactivacion/:id')
  @UsePipes(ValidationPipe)
  async inactivar(@Req() req, @Param('id', new ParseUUIDPipe()) id: string) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.inscripcionService.activarDesactivar(
      id,
      'INACTIVO',
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  @ApiDocSuccessUpdate('Activar olimpiada', InscripcionListadoRepuestaDto)
  @Patch('/inscripciones/activacion/:id')
  @UsePipes(ValidationPipe)
  async activar(@Req() req, @Param('id', new ParseUUIDPipe()) id: string) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.inscripcionService.activarDesactivar(
      id,
      'ACTIVO',
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  @Delete('/inscripciones/:uuid')
  @ApiDocSuccessDelete('Eliminar olimpiada', InscripcionDeleteDto)
  async remove(
    @Req() req: Request,
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
  ) {
    const usuarioAuditoria = this.getIdUser(req);
    return this.successDelete(
      await this.inscripcionService.eliminar(uuid, usuarioAuditoria),
    );
  }
}
