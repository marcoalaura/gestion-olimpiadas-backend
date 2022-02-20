import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RezagadosService } from '../service/rezagados.service';
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { isSubArray } from '../../../common/lib/array.module';
import { GetJsonData } from '../../../common/lib/json.module';

@Controller()
@UseGuards(JwtAuthGuard, CasbinGuard)
export class RezagadosController extends AbstractController {
  constructor(private rezagadosService: RezagadosService) {
    super();
  }

  @Post('/etapas/:id/rezagados')
  async habilitarRezagados(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const userOlimpiadas = req.user?.nivel?.map((key: any) => key.idOlimpiada);
    if (!isSubArray(userOlimpiadas, [req.query?.idOlimpiada])) {
      throw new ForbiddenException();
    }
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.rezagadosService.habilitarRezagados(
      id,
      usuarioAuditoria,
    );
    return this.successUpdate({ cantidadHabilitados: result.length });
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/etapas/:id/rezagados')
  async listarRezagados(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() paginacionQueryDto: PaginacionQueryDto,
  ) {
    const { idOlimpiada } = GetJsonData(paginacionQueryDto.filtro);
    const userOlimpiadas = req.user?.nivel?.map((key: any) => key.idOlimpiada);
    if (!isSubArray(userOlimpiadas, [idOlimpiada])) {
      throw new ForbiddenException();
    }
    const result = await this.rezagadosService.listarRezagados(
      id,
      idOlimpiada,
      paginacionQueryDto,
    );
    return this.successList(result);
  }
}
