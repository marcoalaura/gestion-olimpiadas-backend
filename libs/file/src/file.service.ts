import * as fs from 'fs';
import * as chmodr from 'chmodr';
import { spawn } from 'child_process';

import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { MAX_SIZE_LOGO } from '../../../src/common/constants';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class FileService {
  constructor(private readonly logger: PinoLogger) {}

  base64ToFile(base64: string, ruta: string, format: string): any {
    return new Promise((resolve) => {
      const buffer = Buffer.from(base64, 'base64');
      const filePath = `${ruta}/${Date.now()}.${format}`;
      fs.writeFileSync(filePath, buffer);
      resolve(filePath);
    });
  }

  getSizeFromString = function (texto: string) {
    const buffer = Buffer.from(texto);
    const arraybuffer = Uint8Array.from(buffer).buffer;
    return arraybuffer.byteLength;
  };

  bufferToPdf(buffer: any) {
    return new Promise((resolve, reject) => {
      const ruta = process.env.RUTA_REPORTES;
      this.crearCarpeta(ruta);
      const nombrePdf = Date.now();
      const file = `${ruta}/${nombrePdf}`;
      const libreOffice = 'libreoffice7.2';
      fs.writeFileSync(file, buffer);
      const cmd = spawn(libreOffice, [
        '--headless',
        '--convert-to',
        'pdf',
        file,
        '--outdir',
        `${ruta}`,
      ]);

      cmd.stdout.on('data', (data: any) => {
        console.log(`convert: ${data}`);
        this.logger.info('Conversion pdf con LibreOffice');
      });

      cmd.stderr.on('data', (data: any) => {
        console.log(`error: ${data}`);
        if (Buffer.isBuffer(data)) {
          console.log('Buffer warning: ', data.toString());
          this.logger.warn(data.toString());
        } else {
          console.log('Error LibreOffice', data);
          this.logger.error(data);
        }
      });

      cmd.on('error', (error: any) => {
        this.logger.error(error.message);
        if (error.message === `spawn ${libreOffice} ENOENT`) {
          reject(`Se requiere ${libreOffice} para poder mostrar el reporte`);
        }
        reject(error.message);
      });

      cmd.on('close', (code: any) => {
        console.log(`archivo cerrado correctamente ${code}`);
        resolve(`${file}.pdf`);
      });
    });
  }

  crearCarpeta(ruta: string) {
    return new Promise(function (resolve) {
      if (!fs.existsSync(ruta)) {
        fs.mkdirSync(ruta);
        chmodr(ruta, 0o777, (err: any) => {
          if (err) {
            throw new PreconditionFailedException(
              'Error no se logró dar permisos suficientes al directorio.',
            );
          } else {
            console.log(`Directorio ${ruta} creado con permisos correctos.`);
          }
        });
      }
      resolve(true);
    });
  }

  validarTamanoLogo(texto: string) {
    if (this.getSizeFromString(texto) > MAX_SIZE_LOGO) {
      throw new PreconditionFailedException(
        'El tamaño de la imagen es muy grande.',
      );
    }
    if (!texto.startsWith('data:image/')) {
      throw new PreconditionFailedException('Selecciona una imagen');
    }
  }
}
