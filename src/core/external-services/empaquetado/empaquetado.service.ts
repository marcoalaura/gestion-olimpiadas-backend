import {
  HttpService,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { map } from 'rxjs/operators';
import { ExternalServiceException } from 'src/common/exceptions/external-service.exception';

@Injectable()
export class EmpaquetadoService {
  constructor(
    private httpService: HttpService,
    private readonly logger: PinoLogger,
  ) {}

  /**
   * Metodo para enviar datos necesarios en el empaquetado
   * @param datos
   */
  async enviarExamenesOffline(datos: any) {
    try {
      const offlineBody = datos;
      const respuesta = await this.httpService
        .post(
          `/api/examen/ejecutable/${datos.idUnidadEducativa}/etapa/${datos.idEtapa}`,
          offlineBody,
          {
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          },
        )
        .pipe(map((res) => res.data))
        .toPromise();
      return respuesta;
    } catch (error) {
      this.logger.error(
        { data: { error, stack: error.stack } },
        '[empaquetado.service]',
      );
      console.error('Servicio externo:', error.message);
      console.error(
        'api:',
        `${error.config.method} -> ${error.config.baseURL} -> ${error.config.url}`,
      );
      if (!error.response || error.response.status >= 500) {
        throw new ExternalServiceException('EMPAQUETADO:COMPILAR', error);
      }
      throw new PreconditionFailedException(error.response?.data?.error);
    }
  }

  async estadoExamenPorUnidadEducativa(
    idUnidadEducativa: string,
    idEtapa: string,
  ) {
    try {
      const respuesta = await this.httpService
        .get(`/api/examen/ejecutable/${idUnidadEducativa}/etapa/${idEtapa}`)
        .pipe(map((res) => res.data))
        .toPromise();
      return respuesta;
    } catch (error) {
      this.logger.error(
        { data: { error, stack: error.stack } },
        '[empaquetado.service]',
      );
      console.error('Servicio externo:', error.message);
      console.error(
        'api:',
        `${error.config.method} -> ${error.config.baseURL} -> ${error.config.url}`,
      );
      if (!error.response || error.response.status >= 500) {
        throw new ExternalServiceException('EMPAQUETADO:OBTENERARCHIVO', error);
      }
      throw new PreconditionFailedException(error.response?.data?.error);
    }
  }

  async obtenerEjecutablePorUnidadEducativa(url: string) {
    try {
      const headers = {
        'Content-Type': 'application/octet-stream',
      };
      const respuesta = await this.httpService
        .get(`${url}`, { responseType: 'arraybuffer', headers })
        .toPromise();
      return respuesta;
    } catch (error) {
      this.logger.error(
        { data: { error, stack: error.stack } },
        '[empaquetado.service]',
      );
      console.error('Servicio externo:', error.message);
      console.error(
        'api:',
        `${error.config.method} -> ${error.config.baseURL} -> ${error.config.url}`,
      );
      throw new ExternalServiceException(
        'EMPAQUETADO:OBTENEREJECUTABLE',
        error,
      );
    }
  }
}
