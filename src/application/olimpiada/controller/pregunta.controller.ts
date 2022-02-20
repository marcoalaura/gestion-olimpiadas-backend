import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  ForbiddenException,
  PreconditionFailedException,
} from '@nestjs/common';

import { PreguntaService } from '../service/pregunta.service';
import { EtapaAreaGradoService } from '../service/etapaAreaGrado.service';
import {
  TipoPregunta,
  TipoRespuesta,
  NivelDificultad,
  Rol,
  Transition,
} from '../../../common/constants';
import { AbstractController } from 'src/common/dto/abstract-controller.dto';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import {
  PreguntaDto,
  PreguntaEstadoDto,
  PreguntaRespuestaDto,
} from '../dto/pregunta.dto';
import {
  ApiDocSuccessCreate,
  ApiDocSuccessDelete,
  ApiDocSuccessUpdate,
} from 'src/common/decorators/apidoc.decorator';
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';
import { CalificacionService } from '../service/calificacion.service';

@Controller()
@UseGuards(JwtAuthGuard, CasbinGuard)
export class PreguntaController extends AbstractController {
  constructor(
    private readonly preguntaService: PreguntaService,
    private readonly etapaAreaGradoService: EtapaAreaGradoService,
    private readonly calificacionService: CalificacionService,
  ) {
    super();
  }

  @ApiTags('Preguntas')
  @Get('/preguntas/tipoPreguntas')
  async listarTipoPreguntas() {
    const result = Object.values(TipoPregunta);
    return this.successList(result);
  }

  @ApiTags('Preguntas')
  @Get('/preguntas/tipoRespuestas')
  async listarTipoRespuestas() {
    const result = Object.values(TipoRespuesta);
    return this.successList(result);
  }

  @ApiTags('Preguntas')
  @Get('/preguntas/nivelesDificultad')
  async listarNivelDificultad() {
    const result = Object.values(NivelDificultad);
    return this.successList(result);
  }

  @ApiTags('Preguntas')
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/etapasAreaGrado/:id/preguntas')
  async listarPreguntas(
    @Req() req: Request,
    @Param() params,
    @Query() paginacionQueryDto: PaginacionQueryDto,
  ) {
    const query = await this.etapaAreaGradoService.adicionarIdOlimpiada(
      params.id,
      paginacionQueryDto,
    );
    const idEtapaAreaGrado = params.id;
    const result = await this.preguntaService.listarPreguntas(
      idEtapaAreaGrado,
      this.getRol(req),
      this.getIdUser(req),
      this.getNivel(req, query),
    );
    return this.successList(result);
  }

  @ApiTags('Preguntas')
  @Get('/etapa/:id/preguntas/resumenAprobadas')
  async resumenPreguntasAprobadasPorEtapa(@Req() req, @Param() params) {
    const idEtapa = params.id;
    const result = await this.preguntaService.resumenPreguntasAprobadasPorEtapa(
      idEtapa,
    );
    return this.successList(result);
  }

  @ApiTags('Preguntas')
  @Get('/etapa/:id/preguntas/resumenEstados')
  async resumenPreguntasPorEstadoPorEtapa(@Req() req, @Param() params) {
    const idEtapa = params.id;
    const result = await this.preguntaService.resumenPreguntasPorEstadoPorEtapa(
      idEtapa,
    );
    return this.successList(result);
  }

  @ApiDocSuccessCreate(
    'Servicio para crear preguntas en una etapa',
    PreguntaRespuestaDto,
  )
  @ApiTags('Preguntas')
  @HttpCode(201)
  @Post('/etapasAreaGrado/:id/preguntas')
  @UsePipes(ValidationPipe)
  async crearPregunta(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: PreguntaDto,
  ) {
    const idEtapaAreaGrado = id;
    const data: any = { ...body };
    data.idEtapaAreaGrado = idEtapaAreaGrado;
    data.usuarioAuditoria = this.getIdUser(req);
    const result = await this.preguntaService.crearPregunta(data);
    return this.successCreate(result);
  }

  @ApiDocSuccessUpdate(
    'Servicio para actualizar el estado de una pregunta',
    PreguntaRespuestaDto,
  )
  @ApiTags('Preguntas')
  @Patch('/preguntas/:id/estados')
  async actualzarEstado(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: PreguntaEstadoDto,
  ) {
    const operacion: any = body?.operacion?.toLocaleLowerCase();
    const rol = this.getRol(req);
    if (
      !(
        operacion === Transition.OBSERVAR ||
        operacion === Transition.APROBAR ||
        operacion === Transition.ENVIAR
      )
    ) {
      throw new PreconditionFailedException('Operacion invalida');
    } else if (
      !(
        (rol === Rol.COMITE_DOCENTE_CARGA && operacion === Transition.ENVIAR) ||
        (rol === Rol.COMITE_DOCENTE_VERIFICADOR &&
          (operacion === Transition.APROBAR ||
            operacion === Transition.OBSERVAR))
      )
    ) {
      throw new ForbiddenException();
    }
    const idPregunta = id;
    const data: any = { ...body };
    data.idPregunta = idPregunta;
    data.usuarioAuditoria = this.getIdUser(req);
    const result = await this.preguntaService.actualizarEstado(data);
    return this.successUpdate(result);
  }

  @ApiDocSuccessUpdate(
    'Servicio para actualizar los campos de una pregunta (ver campos en el metodo crear)',
    PreguntaRespuestaDto,
  )
  @ApiTags('Preguntas')
  @Put('/preguntas/:id')
  async actualzarPregunta(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: any,
  ) {
    const idPregunta = id;
    const data: any = { ...body };
    data.idPregunta = idPregunta;
    data.usuarioAuditoria = this.getIdUser(req);
    const result = await this.preguntaService.actualizarPregunta(data);
    return this.successUpdate(result);
  }

  @ApiDocSuccessUpdate(
    'Servicio para actualizar los campos de una pregunta (ver campos en el metodo crear)',
    PreguntaRespuestaDto,
  )
  @ApiTags('Preguntas')
  @Patch('/etapasAreaGrado/:id/preguntas/envioLotes')
  async enviarPreguntasLote(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    if (this.getRol(req) !== Rol.COMITE_DOCENTE_CARGA) {
      throw new ForbiddenException();
    }
    const data: any = {};
    data.idEtapaAreaGrado = id;
    data.usuarioAuditoria = this.getIdUser(req);
    const result = await this.preguntaService.enviarPreguntasLote(data);
    return this.successUpdate(result);
  }

  @ApiDocSuccessDelete('Servicio para actualizar el estado de una pregunta', {})
  @ApiTags('Preguntas')
  @HttpCode(204)
  @Delete('/preguntas/:id')
  async eliminarPregunta(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const idPregunta = id;
    const data: any = {};
    data.usuarioAuditoria = this.getIdUser(req);
    const result = await this.preguntaService.eliminarPregunta(idPregunta, req);
    return this.successDelete(result);
  }

  @ApiDocSuccessUpdate(
    'Servicio para modificar respuesta de una pregunta (impugnacion)',
    PreguntaRespuestaDto,
  )
  @ApiTags('Preguntas')
  @Patch('/preguntas/:id/impugnacion')
  async modificarPreguntaImpugnada(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: any,
  ) {
    const data: any = { ...body };
    data.idPregunta = id;
    data.usuarioAuditoria = this.getIdUser(req);
    const result = await this.preguntaService.actualizarPreguntaImpugnada(data);
    if (result.inscripciones && result.inscripciones.length) {
      this.calificacionService.calificarInscripciones(
        result.inscripciones,
        data.usuarioAuditoria,
      );
    }
    return this.successUpdate({ id: result.id });
  }
}
