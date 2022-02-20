import {
  Body,
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Query,
  HttpCode,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { AuthorizationService } from './authorization.service';
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';
import { CasbinGuard } from '../guards/casbin.guard';

@Controller('autorizacion')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class AuthorizationController extends AbstractController {
  constructor(private readonly authorizationService: AuthorizationService) {
    super();
  }

  @Post('/politicas')
  async crearPolitica(@Body() politica) {
    const result = this.authorizationService.crearPolitica(politica);
    return this.successCreate(result);
  }

  @Patch('/politicas')
  async actualizarPolitica(@Body() politica, @Query() query) {
    const result = this.authorizationService.actualizarPolitica(
      query,
      politica,
    );
    return this.successUpdate(result);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/politicas')
  async listarPoliticas(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.authorizationService.listarPoliticas(
      paginacionQueryDto,
    );
    return this.successList(result);
  }

  @Delete('/politicas')
  @HttpCode(204)
  async eliminarPolitica(@Query() query) {
    const result = this.authorizationService.eliminarPolitica(query);
    return this.successDelete(result);
  }

  @Get('/politicas/roles')
  async obtenerRoles() {
    const result = await this.authorizationService.obtenerRoles();
    return this.successList(result);
  }
}
