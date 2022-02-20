import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { ParametroService } from './parametro.service';
import { ParametroDto } from './dto/parametro.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Parametro } from './parametro.entity';
import { JwtAuthGuard } from '../../core/authentication/guards/jwt-auth.guard';
import { CasbinGuard } from '../../core/authorization/guards/casbin.guard';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { AbstractController } from 'src/common/dto/abstract-controller.dto';

@Controller('parametros')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class ParametroController extends AbstractController {
  constructor(private parametroServicio: ParametroService) {
    super();
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.parametroServicio.listar(paginacionQueryDto);
    return this.successList(result);
  }

  @Get('/:grupo')
  async listarPorGrupo(@Param() params) {
    const { grupo } = params;
    const result = await this.parametroServicio.listarPorGrupo(grupo);
    return this.successList(result);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async crear(@Body() parametroDto: ParametroDto) {
    const result = await this.parametroServicio.crear(parametroDto);
    return this.successCreate(result);
  }
}
