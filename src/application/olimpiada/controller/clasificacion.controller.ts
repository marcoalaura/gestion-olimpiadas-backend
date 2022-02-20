import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Request,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EtapaAreaGradoService } from '../service/etapaAreaGrado.service';
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { ObtenerClasificadosService } from '../service/obtencion-clasificados.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('clasificados')
@UseGuards(JwtAuthGuard)
export class ClasificadosController extends AbstractController {
  constructor(
    private obtenerClasificadosService: ObtenerClasificadosService,
    private etapaAreaGradoService: EtapaAreaGradoService,
  ) {
    super();
  }

  // medalleroPosiciones
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('etapa/:id')
  async listarClasificados(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() paginacionQueryDto: PaginacionQueryDto,
    @Req() req,
  ) {
    const result = await this.obtenerClasificadosService.obtenerClasificados(
      this.getNivel(req, paginacionQueryDto),
    );
    return this.successList(result);
  }

  @ApiTags('Clasificados')
  @Patch('etapa/:id')
  async generarClasificados(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
  ) {
    console.log('clasificando a la etapa', id);
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.obtenerClasificadosService.obtencionClasificados(
      id,
      usuarioAuditoria,
    );
    return this.successList(result);
  }
}
