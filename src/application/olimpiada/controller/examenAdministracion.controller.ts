import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ExamenService } from '../service/examen.service';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';

@Controller('examenesAdministracion')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class ExamenAdministracionController extends AbstractController {
  constructor(private readonly examenService: ExamenService) {
    super();
  }

  @ApiTags('Examenes')
  // @ApiDocSuccessList('Listar estudiantes (director)', PruebaOfflineDto)
  //
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard)
  @Get('offline')
  async recuperarExamenesOffline(
    @Req() req: Request,
    @Query() paginacionQueryDto: PaginacionQueryDto,
  ) {
    console.log('desde el control', paginacionQueryDto);
    const result = await this.examenService.recuperarExamenesOffline(
      this.getNivel(req, paginacionQueryDto),
    );
    return this.successList(result);
  }
}
