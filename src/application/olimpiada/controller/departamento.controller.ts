import {
  Controller,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DepartamentoService } from '../service/departamento.service';
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ApiDocSuccessList } from 'src/common/decorators/apidoc.decorator';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { SeccionDto } from '../dto/seccion.dto';
import { LocalidadDto } from '../dto/localidad.dto';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';

@Controller()
@UseGuards(JwtAuthGuard, CasbinGuard)
export class DepartamentoController extends AbstractController {
  constructor(private departamentoService: DepartamentoService) {
    super();
  }

  // GET departamentos
  @ApiOperation({ summary: 'Obtener lista de departamentos' })
  @Get('departamentos')
  async listar() {
    const result = await this.departamentoService.listar();
    return this.successList(result);
  }

  // GET secciones
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiDocSuccessList('Listar secciones', SeccionDto)
  @Get('secciones')
  async listarSecciones(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.departamentoService.listarSecciones(
      paginacionQueryDto,
    );
    return this.successList(result);
  }

  // GET localidades
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiDocSuccessList('Listar localidades', LocalidadDto)
  @Get('localidades')
  async listarLocalidades(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.departamentoService.listarLocalidades(
      paginacionQueryDto,
    );
    return this.successList(result);
  }
}
