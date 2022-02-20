import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Patch,
  Delete,
  Param,
  Query,
  Req,
  Request,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OlimpiadaService } from './olimpiada.service';
import { EtapaService } from './service/etapa.service';
import { AbstractController } from 'src/common/dto/abstract-controller.dto';
import { OlimpiadaDto, OlimpiadaActualizacionDto } from './dto/olimpiada.dto';
import { JwtAuthGuard } from '../../core/authentication/guards/jwt-auth.guard';
import { successResponse } from '../../common/lib/http.module';
import { Messages } from '../../common/constants/response-messages';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import {
  ApiDocSuccessList,
  ApiDocSuccesGetById,
  ApiDocSuccessCreate,
  ApiDocSuccessUpdate,
  ApiDocSuccessDelete,
} from '../../common/decorators/apidoc.decorator';
import { EtapaRespuestaDto } from './dto/etapa.dto';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';

@Controller('olimpiadas')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class OlimpiadaController extends AbstractController {
  constructor(
    private olimpiadaServicio: OlimpiadaService,
    private etapaService: EtapaService,
  ) {
    super();
  }
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  @ApiDocSuccessList('Listar olimpiadas', OlimpiadaDto)
  async recuperar(
    @Req() req: Request,
    @Query() paginacionQueryDto: PaginacionQueryDto,
  ) {
    return this.successList(
      await this.olimpiadaServicio.recuperar(
        paginacionQueryDto,
        this.getIdUser(req),
        this.getIdRol(req),
        this.getRol(req),
      ),
    );
  }

  // Listar olimpiadas bandeja super usuario
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('listar')
  @ApiDocSuccessList('Listar olimpiadas', OlimpiadaDto)
  async listar(
    @Req() req: Request,
    @Query() paginacionQueryDto: PaginacionQueryDto,
  ) {
    return this.successList(
      await this.olimpiadaServicio.listar(
        paginacionQueryDto,
        this.getIdUser(req),
        this.getIdRol(req),
        this.getRol(req),
      ),
    );
  }

  @Get(':uuid')
  @ApiDocSuccesGetById('Obtener olimpiada por Id', OlimpiadaDto)
  async buscarPorId(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    const result = await this.olimpiadaServicio.buscarPorId(uuid);
    return this.successList(result);
  }

  @Post()
  @ApiDocSuccessCreate('Crear olimpiada', OlimpiadaDto)
  @UsePipes(ValidationPipe)
  async guardar(@Req() req: Request, @Body() olimpiadaDto: OlimpiadaDto) {
    const idUsuario = this.getIdUser(req);
    return this.successCreate(
      await this.olimpiadaServicio.crear(olimpiadaDto, idUsuario),
    );
  }

  @UsePipes(ValidationPipe)
  @Patch(':uuid')
  @ApiDocSuccessUpdate('Actualizar olimpiada', OlimpiadaDto)
  async update(
    @Req() req: Request,
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() olimpiadaDto: OlimpiadaActualizacionDto,
  ) {
    const usuarioAuditoria = this.getIdUser(req);
    return this.successUpdate(
      await this.olimpiadaServicio.actualizar(
        uuid,
        olimpiadaDto,
        usuarioAuditoria,
      ),
    );
  }

  @ApiDocSuccessUpdate('Inactivar olimpiada', OlimpiadaDto)
  @Patch('/inactivacion/:id')
  async inactivar(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.olimpiadaServicio.activarDesactivar(
      id,
      'INACTIVO',
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  @ApiDocSuccessUpdate('Activar olimpiada', OlimpiadaDto)
  @Patch('/activacion/:id')
  async activar(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.olimpiadaServicio.activarDesactivar(
      id,
      'ACTIVO',
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  @Delete(':uuid')
  @ApiDocSuccessDelete('Eliminar olimpiada', OlimpiadaDto)
  async remove(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return successResponse(
      await this.olimpiadaServicio.eliminar(uuid),
      Messages.SUCCESS_DELETE,
    );
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/:idOlimpiada/etapas')
  @ApiDocSuccessList('Obtener lista de etapas por olimpiada', EtapaRespuestaDto)
  async listarEtapasPorOlimpiada(
    @Req() req: Request,
    @Query() paginacionQueryDto: PaginacionQueryDto,
    @Param('idOlimpiada', new ParseUUIDPipe()) idOlimpiada: string,
  ) {
    const query = await this.olimpiadaServicio.adicionarIdOlimpiada(
      idOlimpiada,
      paginacionQueryDto,
    );
    const nivel = this.getNivel(req, query);

    const result = await this.etapaService.listarEtapasPorOlimpiada(
      idOlimpiada,
      nivel,
    );
    return this.successList(result);
  }
}
