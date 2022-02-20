import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  Req,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AbstractController } from 'src/common/dto/abstract-controller.dto';
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';

import { CalificacionService } from '../service/calificacion.service';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';

@ApiTags('Calificacion Publicacion')
@Controller('/calificaciones')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class CalificacionController extends AbstractController {
  constructor(private readonly calificacionService: CalificacionService) {
    super();
  }

  @ApiOperation({
    summary:
      'Obtener lista examenes finalizados por unidad educativa, area y grado',
  })
  @Get('/etapas/a/:idEtapa')
  async listarCalificaciones(@Param() params) {
    // listar
    let resultados = [];
    if (params.idEtapa && params.idEtapa !== 'null') {
      resultados = await this.calificacionService.listar(params.idEtapa);
    }

    return {
      finalizado: true,
      mensaje: 'Registro(s) obtenido(s) con exito!',
      datos: {
        total: resultados.length,
        filas: resultados,
      },
    };
  }
  /*
  @Get('/etapas/:idEtapa')
  async listarCalificacionesa(
    @Query() paginacionQueryDto: PaginacionQueryDto,
    @Param() params,
  ) {
    const paginacion = {
      limite: 10,
      saltar: 0,
      pagina: 1,
      filtro: '',
      orden: '',
    };
    paginacion.limite = paginacionQueryDto.limite || 1000;
    paginacion.pagina = paginacionQueryDto.pagina || 1;
    paginacion.saltar = (paginacion.pagina - 1) * paginacion.limite;
    paginacion.filtro = paginacionQueryDto.filtro;
    paginacion.orden = paginacionQueryDto.orden;

    let resultados = {};
    if (params.idEtapa && params.idEtapa !== 'null') {
      resultados = await this.calificacionService.listarPaginacion(
        params.idEtapa,
        paginacion,
      );
    }

    return {
      finalizado: true,
      mensaje: 'Registro(s) obtenido(s) con exito!',
      datos: resultados,
    };
  }*/

  @Get('/etapas/:idEtapa')
  @UsePipes(new ValidationPipe({ transform: true }))
  async listarCalificacionesa(
    @Query() paginacionQueryDto: PaginacionQueryDto,
    @Param() params,
  ) {
    let resultados = {};
    if (params.idEtapa && params.idEtapa !== 'null') {
      resultados = await this.calificacionService.listarPaginacion(
        params.idEtapa,
        paginacionQueryDto,
      );
    }

    return {
      finalizado: true,
      mensaje: 'Registro(s) obtenido(s) con exito!',
      datos: resultados,
    };
  }

  @ApiOperation({
    summary: 'Calificar exámenes y publicar respuestas',
  })
  @Patch('/etapas/:idEtapa')
  async asignarCalificaciones(@Req() req, @Param() params, @Body() body) {
    // listar
    let resultados = [];
    const usuarioAuditoria = this.getIdUser(req);
    if (params.idEtapa && params.idEtapa !== 'null') {
      resultados = await this.calificacionService.calificar(
        params.idEtapa,
        usuarioAuditoria,
      );
    }

    return {
      finalizado: true,
      mensaje: 'Registro(s) obtenido(s) con exito!',
      datos: {
        total: resultados.length,
        filas: resultados,
      },
      body,
    };
  }
}
