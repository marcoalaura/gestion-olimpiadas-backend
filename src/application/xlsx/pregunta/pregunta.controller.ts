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
  PreconditionFailedException,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';

import { PreguntaService } from './pregunta.service';

import * as Fs from 'fs';
import * as XLSX from 'xlsx';
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';
import { CasbinGuard } from '../../../core/authorization/guards/casbin.guard';

const fs = Fs.promises;

@Controller('preguntas')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class PreguntaController {
  constructor(private preguntaService: PreguntaService) {}

  @ApiTags('Preguntas')
  @ApiOperation({ summary: 'Subir archivo ODS en fragmentos' })
  @Get('/descargarEjemplo')
  async descargarEjemplo(@Req() req: Request, @Res() res) {
    const archivo = await this.preguntaService.generarEjemplo(req.query);
    res.writeHead(200, {
      'Content-Type': archivo.mime,
      'Content-disposition': `attachment;filename=${archivo.name}`,
      'Content-Length': archivo.buffer.length,
    });
    // res.end(Buffer.from(archivo, 'binary'));
    res.end(archivo.buffer);
  }

  @ApiTags('Preguntas')
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
    @Res() res: Response,
  ) {
    const archivo = await this.preguntaService.validarDatosFragmento(
      body,
      files,
    );

    // validar archivo unido-final
    if (archivo.esUltimo === 'true') {
      const headers = [
        'tipo',
        'nivel-dificultad',
        'tipo-respuesta',
        'respuestas',
      ];
      const workbook = XLSX.readFile(
        `${archivo.directorioTemporal}/${archivo.nombreArchivo}`,
      );
      // const workbook = XLSX.read(archivo, {type:'buffer'});
      if (!workbook || !workbook.SheetNames) {
        throw new PreconditionFailedException(
          'Formato de archivo desconocido.',
        );
      }
      if (workbook.SheetNames.length !== 1) {
        throw new PreconditionFailedException(
          'El archivo debe contener solamente una hoja.',
        );
      }
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonSheet = XLSX.utils.sheet_to_json(sheet);
      fs.unlink(`${archivo.directorioTemporal}/${archivo.nombreArchivo}`).catch(
        () => {
          /**/
        },
      );
      fs.unlink(
        `${archivo.directorioTemporal}/${archivo.nombreArchivo}.json`,
      ).catch(() => {
        /**/
      });
      const f = new Date();
      fs.writeFile(
        `${archivo.directorioTemporal}/${archivo.md5Actual}.result.json`,
        JSON.stringify({
          estado: `Procesando archivo ${archivo.nombreArchivo}`,
          fecha: f.getTime(),
          cantidad: 0,
        }),
      );
      if (jsonSheet.length < 1) {
        throw new PreconditionFailedException(
          `Error en el formato del archivo, ver archivo de ejemplo`,
        );
      }
      const validar = headers.filter(
        (r) => !Object.keys(jsonSheet[0]).includes(r),
      );
      if (validar.length > 0) {
        throw new PreconditionFailedException(
          `Columnas requeridas '${validar.join(', ')}'.`,
        );
      }

      // validar columnas del archivo asincronamente
      this.preguntaService
        .validarJsonODS(
          jsonSheet,
          headers,
          body.idEtapaAreaGrado,
          (cantidad) => {
            fs.writeFile(
              `${archivo.directorioTemporal}/${archivo.md5Actual}.result.json`,
              JSON.stringify({
                estado: `Procesando archivo ${archivo.nombreArchivo}`,
                fecha: f.getTime(),
                cantidad,
              }),
            );
          },
          req.user,
        )
        .then((resultados) => {
          fs.writeFile(
            `${archivo.directorioTemporal}/${archivo.md5Actual}.result.json`,
            JSON.stringify(resultados),
          );
        })
        .catch((error) => {
          fs.writeFile(
            `${archivo.directorioTemporal}/${archivo.md5Actual}.result.json`,
            JSON.stringify({
              error: error.message,
            }),
          );
        });

      // Enviar respuesta
      res.status(201).json({
        finalizado: true,
        mensaje: 'Archivo recibido con exito!',
        datos: {
          nombreArchivo: archivo.nombreArchivo,
          codigoArchivo: archivo.md5Actual,
          fecha: f.getTime(),
          json: {
            filas: jsonSheet.length,
            hoja: workbook.SheetNames[0],
          },
        },
      });
      return;
    }

    res.status(201).json({
      finalizado: true,
      mensaje: 'Fragmento guardado con exito!',
      datos: {
        nombreArchivo: body.nombreArchivo,
        recibido: files[0].size,
      },
    });
  }

  @ApiTags('Preguntas')
  @Get('/:codigoArchivo/estado')
  @UseInterceptors(FilesInterceptor('datosBinarios'))
  async verEstadoArchivoSubido(@Req() req, @Res() res: Response) {
    const resultado = await this.preguntaService.obtenerArchivoEstado(
      req.params,
    );

    res.status(200).json({
      finalizado: true,
      mensaje: 'Resultado de archivo subido',
      datos: resultado,
    });
  }
}
