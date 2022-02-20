import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  PreconditionFailedException,
  // Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiConsumes,
  ApiProduces,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import {
  // ApiDocSuccessList,
  ApiDocSuccessUpdate,
} from 'src/common/decorators/apidoc.decorator';
import { AbstractController } from 'src/common/dto/abstract-controller.dto';
import { PaginacionQueryDto } from 'src/common/dto/paginacion-query.dto';
import { ParamUuidDto } from 'src/common/dto/params-uuid.dto';
import { successResponse } from 'src/common/lib/http.module';
import { JwtAuthGuard } from 'src/core/authentication/guards/jwt-auth.guard';
import { PruebaOfflineDto } from '../dto/estudiante.dto';

import { ExamenOfflineService } from '../service/examenOffline.service';

@Controller('examenesOffline')
export class ExamenOfflineController extends AbstractController {
  constructor(
    private readonly examenOfflineService: ExamenOfflineService,
    private readonly logger: PinoLogger,
  ) {
    super();
  }

  // @ApiTags('Examenes Offline')
  // @ApiDocSuccessList('Listar estudiantes (director)', PruebaOfflineDto)
  // @UseGuards(JwtAuthGuard)
  // @Get('pruebas')
  // async obtenerPruebas(
  //   @Query() paginacionQueryDto: PaginacionQueryDto,
  //   @Req() req,
  // ) {
  //   const paginacion = Object.assign(
  //     new PaginacionQueryDto(),
  //     paginacionQueryDto,
  //   );
  //
  //   const datos = await this.examenOfflineService.recuperarExamenes(
  //     paginacion,
  //     req.user,
  //     {},
  //   );
  //   return {
  //     finalizado: true,
  //     mensaje: 'Registro(s) obtenido(s) con exito!',
  //     datos,
  //   };
  // }

  // @ApiTags('Examenes Offline')
  // @ApiDocSuccessList('Listar estudiantes (tecnico sie)', PruebaOfflineDto)
  // @UseGuards(JwtAuthGuard)
  // @UsePipes(ValidationPipe)
  // @Get('unidadEducativa/:id/pruebas')
  // async obtenerPruebasPorUnidadEducativa(
  //   @Param() params: ParamUuidDto,
  //   @Query() paginacionQueryDto: PaginacionQueryDto,
  //   @Req() req,
  // ) {
  //   const paginacion = Object.assign(
  //     new PaginacionQueryDto(),
  //     paginacionQueryDto,
  //   );
  //
  //   const datos = await this.examenOfflineService.recuperarExamenes(
  //     paginacion,
  //     req.user,
  //     params,
  //   );
  //   return {
  //     finalizado: true,
  //     mensaje: 'Registro(s) obtenido(s) con exito!',
  //     datos,
  //   };
  // }

  @ApiTags('Examenes Offline')
  @ApiConsumes('multipart/form-data')
  @ApiDocSuccessUpdate('Subir respuestas offine (director)', PruebaOfflineDto)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('file'))
  @UsePipes(ValidationPipe)
  @Patch('pruebas')
  async cargarPruebas(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body,
    @Req() req,
  ) {
    const result = await this.examenOfflineService.importar(
      req.query,
      files,
      req.user,
    );
    return {
      finalizado: true,
      mensaje: result.mensaje,
      datos: result,
    };
  }

  @ApiTags('Examenes Offline')
  @ApiConsumes('multipart/form-data')
  @ApiDocSuccessUpdate(
    'Subir respuestas offline (tecnico sie)',
    PruebaOfflineDto,
  )
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('archivo'))
  @UsePipes(ValidationPipe)
  @Patch('unidadEducativa/:id/pruebas')
  async cargarPruebasPorUnidadEducativa(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body,
    @Param() params: ParamUuidDto,
    @Req() req,
  ) {
    const result = await this.examenOfflineService.importar(
      req.query,
      files,
      req.user,
    );
    return {
      finalizado: true,
      mensaje: result.mensaje,
      datos: result,
    };
  }

  @ApiTags('Examenes Offline')
  @ApiOperation({ summary: 'Listar empaquetados' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      example: {
        finalizado: true,
        mensaje: 'Registro(s) obtenido(s) con exito!',
        datos: {
          total: 1,
          filas: [
            {
              id: '1861d738-63ed-4e0d-89f2-e7eb6d16c1f1',
              datos: {
                fecha: 1622143923500,
              },
              estado: 'ERROR',
            },
          ],
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Get(
    'olimpiada/:idOlimpiada/etapa/:idEtapa/unidadEducativa/:idUnidadEducativa/empaquetados',
  )
  async listarPorOlimpiadaUnidadEducativa(
    @Param() params: any,
    @Req() req: any,
    @Res() res: any,
  ) {
    const paginacion = Object.assign(new PaginacionQueryDto(), req.query);
    const resultados = await this.examenOfflineService.listarPorOlimpiadaUnidadEducativa(
      params.idOlimpiada,
      params.idEtapa,
      params.idUnidadEducativa,
      paginacion,
      req.user,
    );
    return res.json({
      finalizado: true,
      mensaje: 'Registro(s) obtenido(s) con exito!',
      datos: {
        resultados: resultados.descargas[0],
        filas: resultados.descargas[0],
        total: resultados.descargas[1],
      },
    });
  }

  @ApiTags('Examenes Offline')
  @ApiOperation({ summary: 'Obtener estado del empaquetado' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      example: {
        finalizado: true,
        mensaje: 'Registro obtenido con exito!',
        datos: {
          id: '1861d738-63ed-4e0d-89f2-e7eb6d16c1f1',
          datos: {
            fecha: 1622143923500,
          },
          ruta: 'SetupOlimpiadasDemo.zip',
          estado: 'ERROR',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    schema: {
      type: 'object',
      example: {
        finalizado: false,
        mensaje: '"Registro no encontrado.',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Get(
    'olimpiada/:idOlimpiada/etapa/:idEtapa/unidadEducativa/:idUnidadEducativa/empaquetados/:id',
  )
  async obtenerPorOlimpiadaUnidadEducativaId(
    @Param() params: any,
    @Req() req,
    @Res() res,
  ) {
    const descarga = await this.examenOfflineService.obtenerPorOlimpiadaUnidadEducativaId(
      params.idOlimpiada,
      params.idUnidadEducativa,
      params.idEtapa,
      params.id,
      req.user,
    );
    if (descarga.estado === 'ERROR') {
      return res.status(412).json({
        finalizado: false,
        mensaje: descarga.datos.mensaje,
        datos: { errores: [] },
      });
    }
    delete descarga.ruta;
    return res.json({
      finalizado: true,
      mensaje: 'Registro obtenido con exito!',
      datos: descarga,
    });
  }

  @ApiTags('Examenes Offline')
  @ApiOperation({ summary: 'Generar empaquetado' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      example: {
        finalizado: true,
        mensaje: 'Petición para generar empaquetado realizado con exito!',
        datos: {
          datos: {
            fecha: 1622138037863,
          },
          estado: 'CREADO',
          id: '63de34fc-6f21-4430-af47-aac21252a33b',
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post(
    'olimpiada/:idOlimpiada/etapa/:idEtapa/unidadEducativa/:idUnidadEducativa/empaquetados',
  )
  async generarEmpaquetadoPorUnidadEducativa(@Param() params: any, @Req() req) {
    const resultados = await this.examenOfflineService.generarEmpaquetado(
      params.idOlimpiada,
      params.idUnidadEducativa,
      params.idEtapa,
      req.user,
    );

    return {
      finalizado: true,
      mensaje: 'Petición para generar empaquetado realizado con exito!',
      datos: resultados,
    };
  }

  @ApiTags('Examenes Offline')
  @ApiProduces('application/zip')
  @ApiOperation({ summary: 'Obtener archivo empaquetado binario' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'binary',
    },
  })
  @ApiResponse({
    status: 412,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            finalizado: {
              type: 'boolean',
              example: false,
            },
            mensaje: {
              type: 'string',
              example: 'No existe el archivo empaquetado.',
            },
          },
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post(
    'olimpiada/:idOlimpiada/etapa/:idEtapa/unidadEducativa/:idUnidadEducativa/empaquetados/:id',
  )
  async descargarEmpaquetadoPorUnidadEducativa(
    @Param() params: any,
    @Res() res: any,
    @Req() req,
  ): Promise<any> {
    try {
      const descarga = await this.examenOfflineService.obtenerPorOlimpiadaUnidadEducativaId(
        params.idOlimpiada,
        params.idUnidadEducativa,
        params.idEtapa,
        params.id,
        req.user,
      );

      if (descarga.estado !== 'FINALIZADO') {
        throw new Error(descarga.datos?.mensaje || 'No disponible');
      }

      const respuesta = await this.examenOfflineService.descargarEmpaquetadoBinario(
        descarga,
      );

      const archivo = Buffer.from(respuesta.data, 'binary');

      const filename = descarga.ruta.split('/').pop();
      res.writeHead(200, {
        'Content-Type': respuesta.headers['content-type'],
        'Content-disposition': `attachment;filename=${filename}`,
        'Content-Length': archivo.length,
        'Keep-Alive': 'timeout=600',
      });
      res.end(archivo);
    } catch (error) {
      console.error(error.message);
      this.logger.error(
        { data: { error, stack: error.stack } },
        '[examenOffline]',
      );
      throw new PreconditionFailedException(
        'Archivo ejecutable no disponible.',
      );
    }
  }

  @ApiTags('Examenes Offline')
  @ApiOperation({ summary: 'Subir archivo de respuestas offline encriptado' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        idEtapaAreaGrado: {
          type: 'string',
          description: 'Identificador etapa-area-grado',
        },
        datosBinarios: {
          type: 'string',
          format: 'binary',
          description: 'Fragmento del archivo ODS',
        },
      },
    },
  })
  @ApiResponse({
    schema: {
      properties: {
        finalizado: {
          type: 'boolean',
          example: true,
        },
        mensaje: {
          type: 'string',
          example: 'Archivo recibido con exito!',
        },
        datos: {},
      },
    },
  })
  @UsePipes(ValidationPipe)
  @UseInterceptors(FilesInterceptor('datosBinarios'))
  @Post('/subirResultados')
  async subirArchivoResultados(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body,
    @Req() req,
  ) {
    // const usuarioAuditoria = this.getUser(req);

    const result = await this.examenOfflineService.importar(
      req.query,
      files,
      req.user,
    );
    return successResponse(result, result.mensaje);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('olimpiada/:idOlimpiada/etapa/:idEtapa/resultadoCronograma')
  async obtenerResultadoPruebaSegunCronograma(@Param() params: any) {
    const result = await this.examenOfflineService.obtenerResultadoPruebaSegunCronograma(
      params.idOlimpiada,
      params.idEtapa,
    );
    return this.successList(result);
  }
}
