import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ExamenService } from '../service/examen.service';
import { SorteoPreguntaService } from '../service/sorteoPregunta.service';

import { EstudianteExamenDetalle } from '../dto/estudiante.dto';
import { ApiDocSuccessUpdate } from '../../../common/decorators/apidoc.decorator';
import { ParamUuidDto } from '../../../common/dto/params-uuid.dto';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';
// import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';

@Controller('examenes')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class ExamenController extends AbstractController {
  constructor(
    private readonly examenService: ExamenService,
    private readonly sorteoPreguntaService: SorteoPreguntaService,
  ) {
    super();
  }

  @ApiTags('Examenes')
  @Patch(':id/iniciar')
  async iniciarExamen(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const idExamen = id;
    const data: any = {};
    data.usuarioAuditoria = this.getIdUser(req);
    data.metadata = { 'user-agent': req?.headers['user-agent'] };
    const result = await this.examenService.iniciarExamen(idExamen, data);
    return this.successList(result);
  }

  @ApiTags('Examenes')
  @Patch(':id/finalizar')
  async finalizarExamen(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const idExamen = id;
    const data: any = {};
    data.usuarioAuditoria = this.getIdUser(req);
    data.metadata = { 'user-agent': req?.headers['user-agent'] };
    const result = await this.examenService.finalizarExamen(idExamen, data);
    return this.successUpdate(result);
  }

  @ApiTags('Examenes')
  @Get(':id')
  async recuperarExamen(@Param('id', new ParseUUIDPipe()) id: string) {
    const idExamen = id;
    const data = {};
    const result = await this.examenService.recuperarExamen(idExamen, data);
    return this.successList(result);
  }

  @ApiTags('Examenes')
  @Get(':id/calificacion')
  async recuperarExamenCalificacion(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const idExamen = id;
    const result = await this.examenService.recuperarExamenCalificacion(
      idExamen,
    );
    return this.successList(result);
  }

  @ApiDocSuccessUpdate(
    'Actualizar respuestas de una pregunta',
    EstudianteExamenDetalle,
  )
  @ApiTags('Examenes')
  @Patch('detalle/:id')
  async guardarExamenDetallePorId(
    @Req() req,
    @Param() params: ParamUuidDto,
    @Body() body: EstudianteExamenDetalle,
  ) {
    const data: any = {};
    data.usuarioAuditoria = this.getIdUser(req);
    const result = await this.examenService.guardarRespuestaPorId(
      params.id,
      body.respuestas,
      data,
    );
    return {
      finalizado: true,
      mensaje: 'Respuestas guardadas correctamente',
      datos: result,
    };
  }

  @Post('/:id/reiniciar')
  async reiniciarPruebaOnline(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: any,
  ) {
    const usuarioAuditoria = this.getIdUser(req);
    await this.sorteoPreguntaService.reiniciarPruebaOnline(
      body.idEtapaAreaGrado,
      id,
      body.observacion,
      usuarioAuditoria,
    );
    return this.successList(null);
  }

  @ApiTags('Examenes')
  @Get(':id/comprobantes')
  async obtenerDatosExamenFinalizado(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const idExamen = id;
    const result = await this.examenService.obtenerDatosExamenFinalizado(
      idExamen,
    );
    return this.successList(result);
  }
}
