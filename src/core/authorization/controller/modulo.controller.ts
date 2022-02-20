import { Body, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Modulo } from '../entity/modulo.entity';
import { ModuloService } from '../service/modulo.service';
import { CrearModuloDto } from '../dto/crear-modulo.dto';

@Controller('modulos')
export class ModuloController extends AbstractController {
  constructor(private moduloService: ModuloService) {
    super();
  }

  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.moduloService.listar(paginacionQueryDto);
    return this.successList(result);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async crear(@Body() moduloDto: CrearModuloDto) {
    const result = await this.moduloService.crear(moduloDto);
    return this.successCreate(result);
  }
}
