import {
  Controller,
  ParseUUIDPipe,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AreaService } from '../service/area.service';
import { GradoEscolaridadService } from '../service/gradoEscolaridad.service';
import { DepartamentoService } from '../service/departamento.service';
import { DistritoService } from '../service/distrito.service';
import { UnidadEducativaService } from '../service/unidadEducativa.service';
import { OlimpiadaService } from '../olimpiada.service';
import { EtapaService } from '../service/etapa.service';
import { EtapaAreaGradoService } from '../service/etapaAreaGrado.service';
import { PublicacionResultadoService } from '../service/publicacionResultado.service';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { AbstractController } from 'src/common/dto/abstract-controller.dto';

@Controller('publicos')
export class PublicoController extends AbstractController {
  constructor(
    private readonly areaService: AreaService,
    private readonly gradoEscolaridadService: GradoEscolaridadService,
    private readonly departamentoService: DepartamentoService,
    private readonly distritoService: DistritoService,
    private readonly unidadEducativaService: UnidadEducativaService,
    private readonly olimpiadaServicio: OlimpiadaService,
    private readonly etapaService: EtapaService,
    private readonly etapaAreaGradoService: EtapaAreaGradoService,
    private readonly publicacionResultadoService: PublicacionResultadoService,
  ) {
    super();
  }

  // @UsePipes(new ValidationPipe({ transform: true }))
  // @Get('area')
  // async listarArea(@Query() paginacionQueryDto: PaginacionQueryDto) {
  //   const result = await this.areaService.listar(paginacionQueryDto);
  //   return this.successList(result);
  // }

  // @UsePipes(new ValidationPipe({ transform: true }))
  // @Get('gradoEscolar')
  // async listarGradoEscolar(@Query() paginacionQueryDto: PaginacionQueryDto) {
  //   const result = await this.gradoEscolaridadService.listar(
  //     paginacionQueryDto,
  //   );
  //   return this.successList(result);
  // }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('departamento')
  async listarDepartamento() {
    const result = await this.departamentoService.listar();
    return this.successList(result);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('distrito')
  async listarDistrito(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.distritoService.listarPublico(paginacionQueryDto);
    return this.successList(result);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('unidadEducativa')
  async listarUnidadEducativa(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.unidadEducativaService.listarPublico(
      paginacionQueryDto,
    );
    return this.successList(result);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('olimpiada')
  async recuperarOlimpiada(@Query() paginacionQueryDto: PaginacionQueryDto) {
    const result = await this.olimpiadaServicio.recuperarPublico(
      paginacionQueryDto,
    );
    return {
      finalizado: true,
      mensaje: 'Registro(s) obtenido(s) con exito!',
      datos: result,
    };
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/olimpiada/:idOlimpiada/etapas')
  async listarEtapasPorOlimpiada(
    @Query() paginacionQueryDto: PaginacionQueryDto,
    @Param('idOlimpiada', new ParseUUIDPipe()) idOlimpiada: string,
  ) {
    const result = await this.etapaService.listarEtapasPorOlimpiadaPublico(
      idOlimpiada,
      paginacionQueryDto,
    );
    return this.successList(result);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/etapa/:idEtapa/eag')
  async listarEAGPorEtapa(
    @Query() paginacionQueryDto: PaginacionQueryDto,
    @Param('idEtapa', new ParseUUIDPipe()) idEtapa: string,
  ) {
    const result = await this.etapaAreaGradoService.listarPublico(
      idEtapa,
      paginacionQueryDto,
    );
    return this.successList(result);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/eag/:id/clasificados')
  async ConsultaResultadoClasificados(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() paginacionQueryDto: PaginacionQueryDto,
  ) {
    const result = await this.publicacionResultadoService.ConsultaResultadoClasificados(
      id,
      paginacionQueryDto,
    );
    return {
      finalizado: true,
      mensaje: 'Registro(s) obtenido(s) con exito!',
      datos: result,
    };
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/eag/:id/medalleros')
  async ConsultaResultadoMedalleros(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query() paginacionQueryDto: PaginacionQueryDto,
  ) {
    const result = await this.publicacionResultadoService.ConsultaResultadoMedalleros(
      id,
      paginacionQueryDto,
    );
    return {
      finalizado: true,
      mensaje: 'Registro(s) obtenido(s) con exito!',
      datos: result,
    };
  }
}
