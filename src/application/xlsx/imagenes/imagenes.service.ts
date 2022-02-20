import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { resolve } from 'path';
import * as Fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';

const fs = Fs.promises;
const extensiones = process.env.SERVER_IMAGES_UPLOAD_EXT || 'jpg,jpeg';

@Injectable()
export class ImagenesService {
  reemplazarPalabras(texto, objMap) {
    const reg = new RegExp(Object.keys(objMap).join('|'), 'gi');
    texto = texto.replace(reg, (key) => {
      return objMap[key];
    });
    return texto;
  }

  validarRuta(ruta) {
    let rutaLimpia = '';
    const reemplazos = {
      ñ: 'n',
      Ñ: 'N',
      ',': '/',
    };
    if (typeof ruta === 'string') {
      rutaLimpia = this.reemplazarPalabras(ruta, reemplazos);
      rutaLimpia = rutaLimpia.replace(
        /([^A-Za-z0-9\-\/\.,ÁÉÍÓÚáéíóúäëïöü])|(\.){2,}/g,
        '_',
      );
    }
    return rutaLimpia;
  }

  filtrarErrorArchivo(error) {
    if (error.code === 'ENOENT') {
      throw new PreconditionFailedException('Carpeta o archivo no encontrado.');
    }
    if (error.code === 'EEXIST') {
      throw new PreconditionFailedException(
        'Ya existe un documento con el mismo nombre.',
      );
    }
  }

  // Metodo privado para busqueda recursiva
  private async buscarArchivosRecursivo(dir, regExp, rutaBase = '') {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    let files = await Promise.all(
      dirents.map((dirent) => {
        const res = resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
          return this.buscarArchivosRecursivo(res, regExp, rutaBase);
        }
        dirent.name = res.replace(rutaBase, '');
        return dirent;
      }),
    );
    files = Array.prototype.concat(...files);
    return files.filter((file) => {
      if (regExp && regExp.test) {
        regExp.lastIndex = 0;
        return regExp.test(path.basename(file.name));
      }
      return true;
    });
  }

  // Metodo para buscar archivo recursivamente
  async buscarArchivos(dir, regExp) {
    if (Fs.existsSync(dir)) {
      const rutaBase = path.resolve(dir);
      console.log(rutaBase);
      return await this.buscarArchivosRecursivo(dir, regExp, rutaBase);
    }
    return [];
  }

  // Metodo para listar los archivos y carpetas de un directorio
  async listarDirectorio(dir, regExp = null) {
    if (Fs.existsSync(dir)) {
      const dirents = Fs.readdirSync(dir, { withFileTypes: true });
      return dirents.filter((file) => {
        if (file.isFile() && regExp && regExp.test) {
          regExp.lastIndex = 0;
          return regExp.test(path.basename(file.name));
        }
        return true;
      });
    }
    return [];
  }

  // Metodo para busqueda recursiva (version 2 utilizando find)
  async buscarArchivosV2(dir, contiene, regExp = null) {
    const rutaBase = path.resolve(dir);
    const ls = spawnSync('find', [
      dir,
      '-type',
      'f',
      '-iregex',
      `.*\/.*${contiene}.*\\(${extensiones.split(',').join('\\|')}\\)$`,
    ]);
    const result = ls.stdout
      .toString()
      .split('\n')
      .filter((f) => f)
      .map((file) => {
        return {
          name: file.replace(rutaBase, ''),
        };
      });
    return result.filter((file) => {
      if (regExp && regExp.test) {
        regExp.lastIndex = 0;
        return regExp.test(path.basename(file.name));
      }
      return true;
    });
  }
}
