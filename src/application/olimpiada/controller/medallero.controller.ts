import {
  Body,
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
import { MedalleroService } from '../service/medallero.service';
import { MedalleroPosicionRespuestaDto } from '../dto/medalleroPosicion.dto';
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';
import { PaginacionQueryDto } from '../../../common/dto/paginacion-query.dto';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';
import { ApiDocSuccessList } from '../../../common/decorators/apidoc.decorator';
import { MedalleroPosicionRuralRespuestaDto } from '../dto/medalleroPosicionRural.dto';
import { ObtencionMedalleroService } from '../service/obtencion-medallero.service';
import { ApiTags } from '@nestjs/swagger';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';
import { PinoLogger } from 'nestjs-pino';

@Controller()
@UseGuards(JwtAuthGuard, CasbinGuard)
export class MedalleroController extends AbstractController {
  static staticLogger: PinoLogger;

  constructor(
    private medalleroService: MedalleroService,
    private obtencionMedalleroService: ObtencionMedalleroService,
    private readonly logger: PinoLogger,
  ) {
    super();
    this.logger.setContext(MedalleroController.name);
    MedalleroController.staticLogger = this.logger;
  }

  // medalleroPosiciones
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiDocSuccessList(
    'Listar medallero posiciones',
    MedalleroPosicionRespuestaDto,
  )
  @Get('/etapasAreaGrado/:id/medalleroPosiciones')
  async listarMedalleroPosicion(
    @Param() params,
    @Query() paginacionQueryDto: PaginacionQueryDto,
  ) {
    const idEtapaAreaGrado = params.id;
    const result = await this.medalleroService.listarPosicion(
      idEtapaAreaGrado,
      paginacionQueryDto,
    );
    return this.successList(result);
  }

  // medalleroPosicionesRural
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiDocSuccessList(
    'Listar medallero posiciones rural',
    MedalleroPosicionRuralRespuestaDto,
  )
  @Get('/etapasAreaGrado/:id/medalleroPosicionesRurales')
  async listarMedalleroPosicionRural(
    @Param() params,
    @Query() paginacionQueryDto: PaginacionQueryDto,
  ) {
    const idEtapaAreaGrado = params.id;
    const result = await this.medalleroService.listarPosicionRural(
      idEtapaAreaGrado,
      paginacionQueryDto,
    );
    return this.successList(result);
  }

  // medallerosGenerar
  @ApiTags('Medallero')
  @Patch('/medallero/etapa/:id')
  async obtencionMedallero(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
  ) {
    const usuarioAuditoria = this.getIdUser(req);

    const result = await this.obtencionMedalleroService.obtencionMedallero(
      id,
      usuarioAuditoria,
    );
    this.logger.info(
      `Usuario con id: ${usuarioAuditoria} generó el medallero de la etapa con id: ${id}`,
    );
    return this.successList(result);
  }

  // medallerosGeneradosListar
  @ApiTags('Medallero')
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/medallero/etapa/:idEtapa/listar')
  async listarMedallerosGenerados(
    @Req() req: Request,
    @Param() params,
    @Query() paginacionQueryDto: PaginacionQueryDto,
  ) {
    const { idEtapa } = params;
    const olimpiada = await this.obtencionMedalleroService.getOlimpiadaByEtapa(
      idEtapa,
    );
    params.filtro = `idOlimpiada:${olimpiada.id}`;
    const nivel = this.getNivel(req, params);
    const result = await this.obtencionMedalleroService.listarMedallerosGenerados(
      paginacionQueryDto,
      nivel,
    );
    return this.successList(result);
  }

  // medalleroGenerado
  @ApiTags('Medallero')
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/medallero/etapaAreaGrado/:idEtapaAreaGrado')
  async listarMedalleroUnico(
    @Param('idEtapaAreaGrado') idEtapaAreaGrado: string,
    @Query('idDepartamento') idDepartamento?: string,
    @Query('idDistrito') idDistrito?: string,
  ) {
    const result = await this.obtencionMedalleroService.listarMedalleroUnico(
      idEtapaAreaGrado,
      idDepartamento,
      idDistrito,
    );
    return this.successList(result);
  }

  // medalleroComiteDepartamental
  @ApiTags('Medallero')
  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch('medallero/comiteDepartamental')
  async medalleroComiteDepartamental(@Req() req: Request, @Body() body: any) {
    const usuarioAuditoria = this.getIdUser(req);

    const result = await this.obtencionMedalleroService.medalleroComiteDepartamental(
      usuarioAuditoria,
      body,
    );
    this.logger.info(
      `El usuario con id: ${usuarioAuditoria} desempató lo siguiente: ${JSON.stringify(
        body.posiciones,
      )}`,
    );
    return this.successUpdate(result);
  }

  // Acta PDF
  @ApiTags('Medallero')
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('medallero/etapa/:idEtapa/acta')
  async acta(
    @Param('idEtapa') idEtapa: string,
    @Req() req: Request,
    @Query('idArea') idArea: string,
    @Query('idDepartamento') idDepartamento?: string,
  ) {
    const usuarioAuditoria = this.getIdUser(req);
    const result = await this.obtencionMedalleroService.acta(
      idEtapa,
      idArea,
      idDepartamento,
    );
    this.logger.info(
      `El usuario id ${usuarioAuditoria} generó su acta respectivo`,
    );
    return this.successList(result);
  }
}
