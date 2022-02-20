import { Injectable, PreconditionFailedException } from '@nestjs/common';
import * as carbone from '@alvaromq/carbone';
import * as fs from 'fs';
import { FileService } from '../../../libs/file/src';

@Injectable()
export class CarboneService {
  constructor(private fileService: FileService) {}

  createFileBase64(ruta: string, data: any, format: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const options = {
        lang: 'es-bo',
        convertTo: format,
      };
      carbone.render(
        ruta,
        data,
        options,
        function (err: any, resultado: { toString: (arg0: string) => any }) {
          if (err) return reject(err);
          const archivoBase64 = resultado.toString('base64');
          resolve(archivoBase64);
        },
      );
    });
  }

  createBuffer(ruta: string, data: any, format = null): Promise<string> {
    return new Promise((resolve, reject) => {
      const options = {
        lang: 'es-bo',
        convertTo: format,
      };
      carbone.render(ruta, data, options, function (err: any, result: any) {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }

  getBufferReporte = async (
    rutaTemplate: string,
    nombreArchivo: string,
    data: any,
    format: string,
  ) => {
    if (format === 'jpg') {
      const ruta = `${rutaTemplate}/${nombreArchivo}.odt`;
      return this.createBuffer(ruta, data, format);
    }

    if (format === 'pdf') {
      try {
        const ruta = `${rutaTemplate}/${nombreArchivo}.odt`;
        const buffer = await this.createBuffer(ruta, data);
        const pdf: any = await this.fileService.bufferToPdf(buffer);
        if (!fs.existsSync(pdf)) {
          throw new PreconditionFailedException('No se logró crear el pdf.');
        }
        return fs.readFileSync(pdf);
      } catch (error) {
        console.log('Error carbone pdf', error);
        throw new PreconditionFailedException(error);
      }
    }

    if (format === 'ods') {
      const ruta = `${rutaTemplate}/${nombreArchivo}.ods`;
      return this.createBuffer(ruta, data, format);
    }

    if (format === 'csv') {
      const ruta = `${rutaTemplate}/${nombreArchivo}CSV.ods`;
      return this.createBuffer(ruta, data, format);
    }

    throw new PreconditionFailedException('formato no compatible.');
  };
}
