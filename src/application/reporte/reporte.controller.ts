import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Res,
  Param,
  UsePipes,
  ValidationPipe,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { JwtAuthGuard } from '../../core/authentication/guards/jwt-auth.guard';
import { CasbinGuard } from '../../core/authorization/guards/casbin.guard';
import { AbstractController } from '../../common/dto/abstract-controller.dto';
import { ReporteQueryDto } from '../../common/dto/report-query.dto';
import { tipoArchivo } from '../../common/lib/tipoArchivo.module';
import { ReporteService } from './reporte.service';

@Controller('reporte')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class ReporteController extends AbstractController {
  static staticLogger: PinoLogger;

  constructor(
    private reporteService: ReporteService,
    private readonly logger: PinoLogger,
  ) {
    super();
  }

  @Get('generar/:tipo')
  @HttpCode(HttpStatus.OK)
  async generar(@Res() res: Response, @Param('tipo') tipo: string) {
    const nombreArchivo = `reporte${tipo}.pdf`;
    const plantillaHtml = 'src/templates/default.html';
    const rutaGuardadoPdf = `${process.env.PDF_PATH}${nombreArchivo}`;
    const configPagina = {
      pageSize: 'Letter',
      orientation: 'portrait',
      marginLeft: '0.5cm',
      marginRight: '0.5cm',
      marginTop: '0.5cm',
      marginBottom: '0.5cm',
      output: rutaGuardadoPdf,
    };
    const parametros = {
      titulo: `Pagina de Prueba ${tipo}`,
    };
    await this.reporteService.generar(
      plantillaHtml,
      parametros,
      rutaGuardadoPdf,
      configPagina,
    );

    if (tipo === 'base64') {
      const resultado = await this.reporteService.descargarBase64(
        rutaGuardadoPdf,
      );
      res.status(HttpStatus.OK).json({ data: resultado });
    } else {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${nombreArchivo}`,
      );
      res.download(rutaGuardadoPdf);
    }
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('frecuencia-porcentaje')
  @HttpCode(HttpStatus.OK)
  async obtenerFrecuenciasPorcentajes(
    @Query() reporteQueryDto: ReporteQueryDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const result = await this.reporteService.obtenerFrecuenciasPorcentaje(
      reporteQueryDto,
    );
    this.logger.info(
      `El usuario id ${this.getIdUser(
        req,
      )} generó el pdf de frecuencia porcentaje.`,
    );
    const { format } = reporteQueryDto;
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="frecuencia-porcentaje.${format}"`,
      'Content-Type': tipoArchivo(format),
    });
    res.end(result);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('promedio/departamento-area')
  @HttpCode(HttpStatus.OK)
  async obtenerPromedioDepartamentoArea(
    @Query() reporteQueryDto: ReporteQueryDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const result = await this.reporteService.obtenerPromedioDepartamentoArea(
      reporteQueryDto,
    );
    this.logger.info(
      `El usuario id ${this.getIdUser(req)} generó el pdf de promedio.`,
    );
    const { format } = reporteQueryDto;
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="promedio-departamento-area.${format}"`,
      'Content-Type': tipoArchivo(format),
    });
    res.end(result);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('promedio/anio-escolaridad/departamento-area')
  async obtenerPromedioAnioEscolaridadDepartamentoArea(
    @Query() reporteQueryDto: ReporteQueryDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const result = await this.reporteService.obtenerPromedioAnioEscolaridadDepartamentoArea(
      reporteQueryDto,
    );
    this.logger.info(
      `El usuario id ${this.getIdUser(
        req,
      )} generó el pdf de promedio anio escolaridad.`,
    );
    const { format } = reporteQueryDto;
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="promedio-anio-escolaridad.${format}"`,
      'Content-Type': tipoArchivo(format),
    });
    res.end(result);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('preguntas')
  async obtenerPreguntas(
    @Query() reporteQueryDto: ReporteQueryDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const result = await this.reporteService.obtenerPreguntas(reporteQueryDto);
    this.logger.info(
      `El usuario id ${this.getIdUser(req)} generó el pdf de preguntas.`,
    );
    const { format } = reporteQueryDto;
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="preguntas.${format}"`,
      'Content-Type': tipoArchivo(format),
    });
    res.end(result);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('preguntas/area-grado')
  async obtenerPreguntasAreaGrado(
    @Query() reporteQueryDto: ReporteQueryDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const result = await this.reporteService.obtenerPreguntasAreaGrado(
      reporteQueryDto,
    );
    this.logger.info(
      `El usuario id ${this.getIdUser(
        req,
      )} generó el pdf de preguntas - area -grado.`,
    );
    const { format } = reporteQueryDto;
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="preguntas.${format}"`,
      'Content-Type': tipoArchivo(format),
    });
    res.end(result);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('participacion')
  async obtenerParticipacion(
    @Query() reporteQueryDto: ReporteQueryDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const result = await this.reporteService.obtenerParticipacion(
      reporteQueryDto,
    );
    this.logger.info(
      `El usuario id ${this.getIdUser(req)} generó el pdf de participacion.`,
    );
    const { format } = reporteQueryDto;
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="participacion.${format}"`,
      'Content-Type': tipoArchivo(format),
    });
    res.end(result);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('participacion/tipo-prueba')
  async obtenerParticipacionTipoPrueba(
    @Query() reporteQueryDto: ReporteQueryDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const result = await this.reporteService.obtenerParticipacionTipoPrueba(
      reporteQueryDto,
    );
    this.logger.info(
      `El usuario id ${this.getIdUser(
        req,
      )} generó el pdf de participacion tipo prueba.`,
    );
    const { format } = reporteQueryDto;
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="participacion-tipo-prueba.${format}"`,
      'Content-Type': tipoArchivo(format),
    });
    res.end(result);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('clasificados')
  async obtenerClasificados(
    @Query() reporteQueryDto: ReporteQueryDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const result = await this.reporteService.obtenerClasificados(
      reporteQueryDto,
    );
    this.logger.info(
      `El usuario id ${this.getIdUser(req)} generó el pdf de clasificados.`,
    );
    const { format } = reporteQueryDto;
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="participacion.${format}"`,
      'Content-Type': tipoArchivo(format),
    });
    res.end(result);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('medalleros/area')
  async obtenerMedallerosArea(
    @Query() reporteQueryDto: ReporteQueryDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const result = await this.reporteService.obtenerMedallerosArea(
      reporteQueryDto,
    );
    this.logger.info(
      `El usuario id ${this.getIdUser(req)} generó el pdf de medalleros area.`,
    );
    const { format } = reporteQueryDto;
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="medallero-area.${format}"`,
      'Content-Type': tipoArchivo(format),
    });
    res.end(result);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('medalleros/departamento')
  async obtenerMedallerosDepartamento(
    @Query() reporteQueryDto: ReporteQueryDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const result = await this.reporteService.obtenerMedallerosDepartamento(
      reporteQueryDto,
    );
    this.logger.info(
      `El usuario id ${this.getIdUser(
        req,
      )} generó el pdf de medalleros por departamento.`,
    );
    const { format } = reporteQueryDto;
    res.writeHead(200, {
      'Content-Disposition': `attachment; filename="medallero-departamento.${format}"`,
      'Content-Type': tipoArchivo(format),
    });
    res.end(result);
  }
}
