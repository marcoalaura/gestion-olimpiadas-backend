import {
  Controller,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RolService } from '../service/rol.service';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard';
import { CasbinGuard } from '../guards/casbin.guard';

@Controller('roles')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class RolController extends AbstractController {
  constructor(private rolService: RolService) {
    super();
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get()
  async listar(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.rolService.listar(paginacionQueryDto);
    return this.successList(result);
  }
}
