import {
  Body,
  Controller,
  ParseUUIDPipe,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EtapaAreaGradoService } from '../service/etapaAreaGrado.service';
import {
  EtapaAreaGradoDto,
  EtapaAreaGradoRespuestaDto,
} from '../dto/etapaAreaGrado.dto';
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';
import { AbstractController } from 'src/common/dto/abstract-controller.dto';
import {
  ApiDocSuccesGetById,
  ApiDocSuccessCreate,
  ApiDocSuccessUpdate,
  ApiDocSuccessDelete,
} from '../../../common/decorators/apidoc.decorator';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';

@Controller('etapasAreaGrado')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class EtapaAreaGradoController extends AbstractController {
  constructor(private etapaAreaGradoService: EtapaAreaGradoService) {
    super();
  }

  // GET etapaAreaGrado
  @ApiDocSuccesGetById(
    'Obtener un etapa-area-grado por UUID',
    EtapaAreaGradoRespuestaDto,
  )
  @Get(':id')
  async buscarPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.etapaAreaGradoService.buscarPorId(id);
    return this.successList(result);
  }

  // create etapaAreaGrado
  @ApiDocSuccessCreate(
    'Crear un nuevo etapa-area-grado',
    EtapaAreaGradoRespuestaDto,
  )
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async crear(
    @Req() req: Request,
    @Body() etapaAreaGradoDto: EtapaAreaGradoDto,
  ) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.etapaAreaGradoService.crear(
      etapaAreaGradoDto,
      usuarioAuditoria,
    );
    return this.successCreate(result);
  }

  // update etapaAreaGrado
  @ApiDocSuccessUpdate(
    'Actualizar un etapa-area-grado',
    EtapaAreaGradoRespuestaDto,
  )
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async actualizar(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() etapaAreaGradoDto: EtapaAreaGradoDto,
  ) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.etapaAreaGradoService.actualizar(
      id,
      etapaAreaGradoDto,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  // activar etapaAreaGrado
  @ApiDocSuccessUpdate(
    'Activar un etapa-area-grado',
    EtapaAreaGradoRespuestaDto,
  )
  @Patch('/activacion/:id')
  async activar(@Req() req, @Param('id', new ParseUUIDPipe()) id: string) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.etapaAreaGradoService.activar(
      id,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  // inactivar etapaAreaGrado
  @ApiDocSuccessUpdate(
    'Inactivar un etapa-area-grado',
    EtapaAreaGradoRespuestaDto,
  )
  @Patch('/inactivacion/:id')
  async inactivar(@Req() req, @Param('id', new ParseUUIDPipe()) id: string) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.etapaAreaGradoService.inactivar(
      id,
      usuarioAuditoria,
    );
    return this.successUpdate(result);
  }

  // delete etapaAreaGrado
  @ApiDocSuccessDelete(
    'Eliminar un etapa-area-grado',
    EtapaAreaGradoRespuestaDto,
  )
  @Delete(':id')
  async eliminar(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.etapaAreaGradoService.eliminar(id);
    return this.successDelete(result);
  }
}
