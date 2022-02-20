import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
  Req,
  UseGuards,
  ParseUUIDPipe,
  PreconditionFailedException,
  ForbiddenException,
} from '@nestjs/common';
import { EstudianteService } from '../service/estudiante.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import {
  EstudianteDto,
  EstudianteExamenDto,
  EstudianteCreacionDto,
} from '../dto/estudiante.dto';

import {
  ApiDocSuccessList,
  ApiDocSuccesGetById,
  ApiDocSuccessCreate,
} from '../../../common/decorators/apidoc.decorator';
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { ParamUuidDto } from '../../../common/dto/params-uuid.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SuccessResponseDto } from '../../../common/dto/success-response.dto';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard';

import { isSubArray } from '../../../common/lib/array.module';

@Controller('estudiantes')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class EstudianteController extends AbstractController {
  constructor(private readonly estudianteService: EstudianteService) {
    super();
  }

  @Get('')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiDocSuccessList('Listar estudiantes', EstudianteDto)
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Prohibido' })
  async obtenerEstudiantes(
    @Query() paginacionQueryDto: PaginacionQueryDto,
  ): Promise<SuccessResponseDto> {
    const result = await this.estudianteService.obtenerEstudiantes(
      paginacionQueryDto,
    );
    return {
      finalizado: true,
      mensaje: 'Registro(s) obtenido(s) con exito!',
      datos: result,
    };
  }

  @Get(':id')
  @ApiDocSuccesGetById('Obtener estudiante por id', EstudianteDto)
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Prohibido' })
  async ObtenerEstudianteId(
    @Param() params: ParamUuidDto,
  ): Promise<SuccessResponseDto> {
    const result = await this.estudianteService.encontrarPorId(params.id);
    return {
      finalizado: true,
      mensaje: 'Registro(s) obtenido(s) con exito!',
      datos: result,
    };
  }

  @Post()
  @ApiDocSuccessCreate('Crear estudiante', EstudianteDto)
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Prohibido' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async CrearEstudiante(
    @Req() req,
    @Body() estudianteDto: EstudianteCreacionDto,
  ) {
    const usuarioAuditoria = this.getIdUser(req);
    return this.successCreate(
      await this.estudianteService.crear(estudianteDto, usuarioAuditoria),
    );
  }

  @Get(':id/examenes')
  @ApiOperation({ summary: 'Obtener examenes disponibles del estudiante' })
  @ApiDocSuccessList(
    'Listar exámenes disponibles del estudiante por olimpiada y etapa vigente',
    EstudianteExamenDto,
  )
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Prohibido' })
  async obtenerEstudianteExamenes(
    @Req() req,
    @Param() params: ParamUuidDto,
  ): Promise<SuccessResponseDto> {
    const idOlimpiada = req?.query?.idOlimpiada;
    if (!idOlimpiada) {
      throw new PreconditionFailedException(
        'El parametro olimpiada es requerido',
      );
    }
    const result = await this.estudianteService.encontrarExamenes(
      params.id,
      idOlimpiada,
    );
    return {
      finalizado: true,
      mensaje: 'Registro(s) obtenido(s) con exito!',
      datos: {
        total: result.length,
        filas: result,
      },
    };
  }

  @Get(':id/examenes/historicos')
  async obtenerEstudianteExamenesHistoricos(
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const result = await this.estudianteService.encontrarExamenesHistoricos(id);
    return {
      finalizado: true,
      mensaje: 'Registro(s) obtenido(s) con exito!',
      datos: {
        total: result.length,
        filas: result,
      },
    };
  }

  @Get(':id/examenes/calendarios')
  async encontrarExamenesEnCalendarioVigente(
    @Req() req,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    const userOlimpiadas = req.user?.nivel?.map((key: any) => key.idOlimpiada);
    if (!isSubArray(userOlimpiadas, [req.query?.idOlimpiada])) {
      throw new ForbiddenException();
    }
    const params = req.query;
    const result = await this.estudianteService.encontrarExamenesEnCalendarioVigente(
      id,
      params,
    );
    return {
      finalizado: true,
      mensaje: 'Registro(s) obtenido(s) con exito!',
      datos: {
        total: result.length,
        filas: result,
      },
    };
  }

  @Get(':ciRude/detalles')
  async ObtenerEstudiantePorCIRude(@Param() params: any) {
    const result = await this.estudianteService.buscarEstudiantePorCiRude(
      params.ciRude,
    );
    return {
      finalizado: true,
      mensaje: 'Registro(s) obtenido(s) con exito!',
      datos: result,
    };
  }

  @Get(':id/olimpiadas')
  async obtenerOlimpiadas(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this.estudianteService.obtenerOlimpiadas(id);
    return this.successList(result);
  }
}
