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
import { EtapaService } from '../service/etapa.service';
import { GestionEtapaService } from '../service/gestionEtapa.service';
import { EtapaAreaGradoService } from '../service/etapaAreaGrado.service';
import { SorteoPreguntaService } from '../service/sorteoPregunta.service';
import { EtapaDto, EtapaRespuestaDto } from '../dto/etapa.dto';
import { EtapaAreaGradoPorEtapaRespuestaDto } from '../dto/etapaAreaGrado.dto';
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

@Controller('etapas')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class EtapaController extends AbstractController {
  constructor(
    private etapaService: EtapaService,
    private gestionEtapaService: GestionEtapaService,
    private etapaAreaGradoService: EtapaAreaGradoService,
    private sorteoPreguntaService: SorteoPreguntaService,
  ) {
    super();
  }

  // GET etapa
  @ApiDocSuccesGetById('Obtener una etapa por UUID', EtapaRespuestaDto)
  @Get(':id')
  async buscarPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.etapaService.buscarPorId(id);
    return this.successList(result);
  }

  // create etapa
  @ApiDocSuccessCreate('Crear una nueva etapa', EtapaRespuestaDto)
  @UsePipes(ValidationPipe)
  @Post()
  async crear(@Req() req: Request, @Body() etapaDto: EtapaDto) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.etapaService.crear(etapaDto, usuarioAuditoria);
    return this.successCreate(result);
  }

  // update etapa
  @ApiDocSuccessUpdate('Actualizar una etapa', EtapaRespuestaDto)
  @UsePipes(ValidationPipe)
  @Patch(':id')
  async actualizar(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() etapaDto: EtapaDto,
  ) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.etapaService.actualizar(
      id,
      etapaDto,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  // GET etapas
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiDocSuccessList('Obtener lista de etapas', EtapaRespuestaDto)
  @Get(':estado/operaciones')
  async listarEstados(@Param('estado') estado: string) {
    const result = await this.gestionEtapaService.listarOperaciones(estado);
    return this.successList(result);
  }

  // estado etapa
  @ApiDocSuccessUpdate(
    'Servicio para actualizar el estado de una etapa',
    EtapaDto,
  )
  @Patch(':id/estados')
  async actualzarEstado(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: EtapaDto,
  ) {
    const idEtapa = id;
    const data: any = { ...body };
    data.idEtapa = idEtapa;
    data.usuarioAuditoria = this.getIdUser(req);
    const result = await this.gestionEtapaService.actualizarEstado(data);
    return this.successUpdate(result);
  }

  // cerrar etapa
  @ApiDocSuccessUpdate('Cerrar etapa', EtapaRespuestaDto)
  @Patch('/cerrar/:id')
  async cerrar(@Req() req, @Param('id', new ParseUUIDPipe()) id: string) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.etapaService.cerrar(id, usuarioAuditoria);
    return this.successUpdate(result);
  }

  // delete etapa
  @ApiDocSuccessDelete('Eliminar una etapa', EtapaRespuestaDto)
  @Delete(':id')
  async eliminar(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.etapaService.eliminar(id);
    return this.successDelete(result);
  }

  @ApiDocSuccessList(
    'Obtener lista de etapaAreaGrados por etapa',
    EtapaAreaGradoPorEtapaRespuestaDto,
  )
  @Get('/:id/etapaAreaGrados')
  async listarEtapaAreaGradoPorEtapa(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
    @Query() paginacionQueryDto: PaginacionQueryDto,
  ) {
    const query = await this.etapaService.adicionarIdOlimpiada(
      id,
      paginacionQueryDto,
    );
    const nivel = this.getNivel(req, query);
    const result = await this.etapaAreaGradoService.listarEtapaAreaGradoPorEtapa(
      id,
      nivel,
    );
    return this.successList(result);
  }

  @Post('/:id/sorteoPreguntas')
  async sortearPreguntas(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.sorteoPreguntaService.sortearPreguntas(
      id,
      usuarioAuditoria,
    );
    return this.successList(result);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/:id/etapasAreaGrado')
  async listarEtapasAreaGrado(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() paginacionQueryDto: PaginacionQueryDto,
  ) {
    const result = await this.etapaAreaGradoService.listar(
      id,
      paginacionQueryDto,
    );
    return this.successList(result);
  }

  @Post('/:id/sorteoPreguntas/rezagados')
  async sortearPreguntasRezagados(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.sorteoPreguntaService.sortearPreguntasRezagados(
      id,
      usuarioAuditoria,
    );
    return this.successList(result);
  }
}
