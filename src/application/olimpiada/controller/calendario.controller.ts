import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CalendarioService } from '../service/calendario.service';
import { AbstractController } from 'src/common/dto/abstract-controller.dto';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import {
  ApiDocSuccessCreate,
  ApiDocSuccessDelete,
  ApiDocSuccessList,
  ApiDocSuccessUpdate,
} from 'src/common/decorators/apidoc.decorator';
import {
  CalendarioCrearDto,
  CalendarioActualizarDto,
  CalendarioIdRespuestaDto,
  CalendarioListaRespuetaDto,
} from '../dto/calendario.dto';
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';
import { TipoPlanificacion } from '../../../common/constants';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';

@Controller()
@UseGuards(JwtAuthGuard, CasbinGuard)
export class CalendarioController extends AbstractController {
  constructor(private readonly calendarioService: CalendarioService) {
    super();
  }

  @ApiTags('Calendarios')
  @Get('/calendarios/tiposPlanificacion')
  async listarTipoPlanificacion() {
    const result = Object.values(TipoPlanificacion);
    return this.successList(result);
  }

  @ApiDocSuccessList(
    'Servicio para listar calendarios de una etapa',
    CalendarioListaRespuetaDto,
  )
  @ApiTags('Calendarios')
  @Get('/etapas/:id/calendarios')
  async listarCalendariosPorEtapa(
    @Param() params,
    @Query() paginacionQueryDto: PaginacionQueryDto,
  ) {
    const idEtapaAreaGrado = params.id;
    const result = await this.calendarioService.listarCalendariosPorEtapa(
      idEtapaAreaGrado,
      paginacionQueryDto,
    );
    return this.successList(result);
  }

  @ApiDocSuccessList(
    'Servicio para listar calendarios de una etapa',
    CalendarioListaRespuetaDto,
  )
  @ApiTags('Calendarios')
  @Get('/etapasAreaGrado/:id/calendariosOnline')
  async listarCalendariosOnlinePorEAG(@Param() params) {
    const idEtapaAreaGrado = params.id;
    const result = await this.calendarioService.listarCalendariosOnlineActivosPorEAG(
      idEtapaAreaGrado,
    );
    return this.successList(result);
  }

  @ApiDocSuccessCreate(
    'Servicio para crear un calendario en una etapa-area-grado',
    CalendarioIdRespuestaDto,
  )
  @ApiTags('Calendarios')
  @Post('/etapasAreaGrado/:id/calendarios')
  @UsePipes(ValidationPipe)
  async crearCalendario(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: CalendarioCrearDto,
  ) {
    const idEtapaAreaGrado = id;
    const data: any = { ...body };
    data.idEtapaAreaGrado = idEtapaAreaGrado;
    data.usuarioAuditoria = this.getIdUser(req);
    const result = await this.calendarioService.crearCalendario(data);
    return this.successCreate(result);
  }

  @ApiDocSuccessUpdate(
    'Servicio para actualizar un calendario',
    CalendarioIdRespuestaDto,
  )
  @ApiTags('Calendarios')
  @Put('/calendarios/:id')
  async actualzarCalendario(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: CalendarioActualizarDto,
  ) {
    const idCalendario = id;
    const data: any = { ...body };
    data.idCalendario = idCalendario;
    data.usuarioAuditoria = this.getIdUser(req);
    const result = await this.calendarioService.actualizarCalendario(data);
    return this.successUpdate(result);
  }

  @ApiDocSuccessDelete('Servicio para actualizar el estado de una pregunta', {})
  @ApiTags('Calendarios')
  @HttpCode(204)
  @Delete('/calendarios/:id')
  async eliminarCalendario(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const data: any = {};
    data.usuarioAuditoria = this.getIdUser(req);
    const idCalendario = id;
    const result = await this.calendarioService.eliminarCalendario(
      idCalendario,
      data,
    );
    return this.successDelete(result);
  }
}
