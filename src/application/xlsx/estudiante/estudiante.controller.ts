import {
  ApiBody,
  ApiOperation,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';

import { EstudianteService } from './estudiante.service';

import { successResponse } from '../../../common/lib/http.module';
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';
import { AbstractController } from '../../../common/dto/abstract-controller.dto';

@Controller('inscripciones/estudiantes')
@UseGuards(JwtAuthGuard)
export class EstudianteController extends AbstractController {
  constructor(private estudianteService: EstudianteService) {
    super();
  }

  @ApiTags('Estudiantes')
  @ApiOperation({ summary: 'Descargar archivo de ejemplo' })
  @Get('/descargarEjemplo')
  async descargarEjemplo(@Req() req: Request, @Res() res) {
    const archivo = await this.estudianteService.generarEjemplo(req.query);
    res.writeHead(200, {
      'Content-Type': archivo.mime,
      'Content-disposition': `attachment;filename=${archivo.name}`,
      'Content-Length': archivo.buffer.length,
    });
    res.end(archivo.buffer);
  }

  @ApiTags('Estudiantes')
  @ApiOperation({ summary: 'Subir archivo ODS en fragmentos' })
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
        tamanioArchivo: {
          type: 'string',
          format: 'number',
          description: 'Tamaño del archivo completo',
        },
        nombreArchivo: {
          type: 'string',
          format: 'string',
          description: 'Nombre del archivo',
        },
        esUltimo: {
          type: 'string',
          format: 'boolean',
          description: 'Es el ultimo fragmento? [true|false]',
        },
        fragmentoActual: {
          type: 'string',
          format: 'number',
          description: 'Numero del fragmento actual',
        },
        totalFragmentos: {
          type: 'string',
          format: 'number',
          description: 'Cantidad de fragmentos',
        },
      },
    },
  })
  @ApiOkResponse({
    schema: {
      properties: {
        finalizado: {
          type: 'boolean',
          example: true,
        },
        mensaje: {
          type: 'string',
          example: 'Fragmento guardado con exito!',
        },
        datos: {
          type: 'object',
          properties: {
            nombreArchivo: {
              type: 'string',
              example: 'Ejemplo.ods',
            },
            recibido: {
              type: 'string',
              example: '12345678',
            },
          },
        },
      },
    },
  })
  @Post('/subirFragmento')
  @UseInterceptors(FilesInterceptor('datosBinarios'))
  async subirArchivoODSporPartes(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body,
    @Req() req,
  ) {
    const usuarioAuditoria = this.getIdUser(req);

    const result = await this.estudianteService.importar(
      body,
      files,
      usuarioAuditoria,
    );
    return successResponse(result, result.mensaje);
  }

  @ApiTags('Estudiantes')
  @Get('/:codigoArchivo/estado')
  @UseInterceptors(FilesInterceptor('datosBinarios'))
  async verEstadoArchivoSubido(@Req() req, @Res() res: Response) {
    const resultado = await this.estudianteService.obtenerArchivoEstado(
      req.params,
    );

    res.status(200).json({
      finalizado: true,
      mensaje: 'Resultado de archivo subido',
      datos: resultado,
    });
  }
}
