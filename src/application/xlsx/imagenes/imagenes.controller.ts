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

import * as Fs from 'fs';
import * as FileType from 'file-type';
import * as Jimp from 'jimp';
// import * as crypto from 'crypto';
import { JwtAuthGuard } from '../../../core/authentication/guards/jwt-auth.guard';
import { CasbinGuard } from 'src/core/authorization/guards/casbin.guard';

import * as path from 'path';
import { ImagenesService } from './imagenes.service';

const fs = Fs.promises;
const directorioTemporalImages =
  process.env.SERVER_IMAGES_UPLOAD || './imageUploads';
fs.mkdir(directorioTemporalImages).catch(() => {
  // no hace nada
});

const extensiones = process.env.SERVER_IMAGES_UPLOAD_EXT || 'jpg,jpeg';

@Controller('preguntas')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class ImagenesController {
  constructor(private imagenesService: ImagenesService) {}

  @Get('/imagenes')
  async listDirectorio(@Req() req) {
    try {
      if (!req.query.ruta) req.query.ruta = '';
      const ruta = path.join(
        directorioTemporalImages,
        this.imagenesService.validarRuta(req.query.ruta),
      );

      req.query.contiene = this.imagenesService.validarRuta(req.query.contiene);
      const reg = new RegExp(
        `.*${req.query.contiene}.*(\\.${extensiones.split(',').join('|\\.')})$`,
        'ig',
      );
      let dir = [];
      if (!req.query.recursivo) {
        dir = await this.imagenesService.listarDirectorio(ruta, reg);
      } else {
        // dir = await this.imagenesService.buscarArchivos(ruta, reg);
        dir = await this.imagenesService.buscarArchivosV2(
          ruta,
          req.query.contiene,
          reg,
        );
      }
      const dirInfo = dir.map((file) => {
        const dataFile = Fs.lstatSync(path.join(ruta, file.name));
        return {
          nombre: file.name,
          tamano: dataFile.size,
          esDirectorio: dataFile.isDirectory(),
          esArchivo: dataFile.isFile(),
        };
      });
      return {
        finalizado: true,
        mensaje: 'Directorio obtenido corretamente.',
        datos: {
          total: dirInfo.length,
          filas: dirInfo,
        },
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new PreconditionFailedException('Carpeta no encontrada.');
      }
      console.error(error);
      throw new PreconditionFailedException(
        'No se puede obtener datos de la carpeta.',
      );
    }
  }

  @Get('/imagenes/archivos')
  async obtenerImagen(@Req() req, @Res() res) {
    const ruta = path.join(
      directorioTemporalImages,
      this.imagenesService.validarRuta(req.query.ruta),
    );
    return Fs.readFile(ruta, (error, archivo) => {
      if (error) {
        console.error(error);
        res.status(412).json({
          finalizado: false,
          mensaje: 'No se puede obtener datos de la carpeta.',
        });
        return false;
      }
      res.writeHead(200, {
        'Content-Type': 'image/jpg',
        'Content-Length': archivo.length,
        'Keep-Alive': 'timeout=600',
      });
      res.end(archivo);
      return true;
    });
  }

  @Post('/imagenes/carpetas')
  async crearCarpeta(@Req() req) {
    try {
      if (!req.body.carpeta || req.body.carpeta.indexOf('..') >= 0) {
        throw new Error('Ruta inválida.');
      }
      // req.body.carpeta = req.body.carpeta.replace(/([^A-Za-z0-9\-])/g, '_');
      let ruta = this.imagenesService.validarRuta(req.body.carpeta);
      if (req.body.ruta) {
        ruta = path.join(this.imagenesService.validarRuta(req.body.ruta), ruta);
      }
      ruta = path.join(directorioTemporalImages, ruta);
      Fs.mkdirSync(ruta);
      return {
        finalizado: true,
        mensaje: 'OK',
      };
    } catch (error) {
      if (error.code === 'EEXIST') {
        throw new PreconditionFailedException('La carpeta ya existe.');
      }
      if (error.code === 'ENAMETOOLONG') {
        throw new PreconditionFailedException('El nombre es demasiado largo.');
      }
      console.error(error);
      throw new PreconditionFailedException('Error al crear la carpeta');
    }
  }

  @Post('/imagenes/archivos')
  @UseInterceptors(FilesInterceptor('archivos'))
  async subirArchivo(
    @UploadedFiles() archivos: Express.Multer.File[],
    @Body() body,
  ) {
    try {
      if (!archivos[0]) {
        throw new PreconditionFailedException(
          'El archivo no fue recibido correctamente',
        );
      }
      if (
        archivos[0].size >
        (parseInt(process.env.SERVER_IMAGES_UPLOAD_SIZE) || 100) * 1024
      ) {
        throw new PreconditionFailedException(
          `El archivo excede los ${
            parseInt(process.env.SERVER_IMAGES_UPLOAD_SIZE) || 100
          } kB permitidos.`,
        );
      }
      const image = await Jimp.read(archivos[0].buffer);
      if (!image || !image.bitmap) {
        throw new PreconditionFailedException(
          `No se puede reconocer el archivo de imágen.`,
        );
      }
      if (
        image.bitmap.width >
        (parseInt(process.env.SERVER_IMAGES_UPLOAD_WIDTH) || 300)
      ) {
        throw new PreconditionFailedException(
          `El archivo de imágen excede los ${
            parseInt(process.env.SERVER_IMAGES_UPLOAD_WIDTH) || 300
          }px de ancho permitidos.`,
        );
      }
      if (
        image.bitmap.height >
        (parseInt(process.env.SERVER_IMAGES_UPLOAD_HEIGHT) || 200)
      ) {
        throw new PreconditionFailedException(
          `El archivo de imágen excede los ${
            parseInt(process.env.SERVER_IMAGES_UPLOAD_HEIGHT) || 200
          }px de alto permitidos.`,
        );
      }
      const tipo = await FileType(archivos[0].buffer);
      if (tipo.mime.indexOf('image/') !== 0) {
        throw new PreconditionFailedException(
          `El tipo del archivo no es una imágen`,
        );
      }
      if (
        !extensiones.split(',').find((ext) => {
          return tipo.mime.indexOf(`image/${ext}`) === 0;
        })
      ) {
        throw new PreconditionFailedException(
          `Solo se permiten archivos de imagen (.${extensiones
            .split(',')
            .join(', .')})`,
        );
      }
      // const hash = crypto
      //   .createHash('md5')
      //   .update(archivos[0].buffer)
      //   .digest('hex');
      // const md5 = `${hash.substr(0, 8)}-${hash.substr(8, 4)}-${hash.substr(
      //   12,
      //   4,
      // )}-${hash.substr(16, 4)}-${hash.substr(20)}`;
      let ruta = path.join(
        this.imagenesService.validarRuta(body.ruta),
        this.imagenesService.validarRuta(`${archivos[0].originalname}`),
      );
      ruta = path.join(directorioTemporalImages, ruta);
      Fs.writeFileSync(ruta, archivos[0].buffer);
      return {
        finalizado: true,
        mensaje: 'Archivo guardado correctamente',
      };
    } catch (error) {
      // console.error(error);
      if (error.message.indexOf('archivo') >= 0) {
        throw new PreconditionFailedException(error.message);
      }
      throw new PreconditionFailedException('No se guardó el archivo.');
    }
  }
}
