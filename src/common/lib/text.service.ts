import { hash, compare } from 'bcrypt';
import { v5, v4 } from 'uuid';
import zxcvbn from 'zxcvbn-typescript';
import { Configurations } from '../constants';

export class TextService {
  /**
   * Metodo para encriptar un password
   * @param password contraseña
   */
  static async encrypt(password: string) {
    const hashText = await hash(password, Configurations.SALT_ROUNDS);
    return hashText;
  }

  static nano(template: string, data: string): string {
    return template.replace(/\{([\w.]*)\}/g, function (str, key) {
      const keys = key.split('.');
      let v = data[keys.shift()];
      for (let i = 0, l = keys.length; i < l; i++) {
        v = v[keys[i]];
      }
      return typeof v !== 'undefined' && v !== null ? v : '';
    });
  }

  static async compare(passwordInPlainText, hashedPassword) {
    const isPasswordMatching = await compare(
      passwordInPlainText,
      hashedPassword,
    );
    return isPasswordMatching;
  }

  /**
   * Metodo para convertir un texto a formato uuid
   * @param text Texto
   * @param namespace Uuid base
   */
  static textToUuid(
    text: string,
    namespace = 'bb5d0ffa-9a4c-4d7c-8fc2-0a7d2220ba45',
  ): string {
    return v5(text, namespace);
  }

  static generateUuid(): string {
    return v4();
  }

  /**
   * Metodo para generar un texto aleatorio corto
   * @returns string
   */
  static generateShortRandomText(): string {
    const randomText = Math.random().toString(25).slice(-8).toUpperCase();
    return randomText;
  }

  static validateLevelPassword(password: string) {
    const result = zxcvbn(password);
    if (result.score >= Configurations.SCORE_PASSWORD) {
      return true;
    }
    return false;
  }

  static decodeBase64 = (base64) => {
    const text = TextService.atob(base64);
    return decodeURI(text);
  };

  static atob = (a) => Buffer.from(a, 'base64').toString('ascii');

  static btoa = (b) => Buffer.from(b).toString('base64');
}
