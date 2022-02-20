import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { ExternalServiceException } from '../../../../common/exceptions/external-service.exception';
import * as dayjs from 'dayjs';
import { PersonaDto } from 'src/application/persona/persona.dto';

@Injectable()
export class SegipService {
  constructor(private http: HttpService) {}

  /**
   * @title Contrastación
   * @description Metodo para verificar si la información de una persona coincide con un registro en el SEGIP
   * @param datosPersona Objeto de datos con la información de la persona
   */
  async contrastar(datosPersona: PersonaDto) {
    try {
      const datosCampos = {
        Complemento: '',
        NumeroDocumento: datosPersona.nroDocumento,
        Nombres: datosPersona.nombres,
        PrimerApellido: datosPersona.primerApellido || '--',
        SegundoApellido: datosPersona.segundoApellido || '--',
        FechaNacimiento: dayjs(datosPersona.fechaNacimiento).format(
          'DD/MM/YYYY',
        ),
      };
      if (datosPersona.nroDocumento.includes('-')) {
        datosCampos.NumeroDocumento = datosPersona.nroDocumento
          .split('-')
          .shift();
        datosCampos.Complemento =
          datosPersona.nroDocumento.split('-').pop() || '';
      }
      const campos = Object.keys(datosCampos)
        .map((dato) => {
          return `"${dato}":"${datosCampos[dato]}"`;
        })
        .join(', ');

      const urlContrastacion = encodeURI(
        `/v2/personas/contrastacion?tipo_persona=1&lista_campo={ ${campos} }`,
      );
      const respuesta = await this.http
        .get(urlContrastacion)
        .pipe(map((response) => response.data))
        .toPromise();

      const resultado = respuesta.ConsultaDatoPersonaContrastacionResult;
      if (resultado) {
        if (resultado.CodigoRespuesta === '2') {
          const losDatos = JSON.parse(resultado.ContrastacionEnFormatoJson);
          if (losDatos.NumeroDocumento === 0) {
            throw new Error(`Servicio Segip: Numero de documento no coincide`);
          } else if (losDatos.Complemento === 0) {
            throw new Error(`Servicio Segip: Complemento no coincide`);
          } else if (losDatos.Nombres === 0) {
            throw new Error(`Servicio Segip: Nombres no coincide`);
          } else if (losDatos.PrimerApellido === 0) {
            throw new Error(`Servicio Segip: Primero apellido no coincide`);
          } else if (losDatos.SegundoApellido === 0) {
            throw new Error(`Servicio Segip: Segundo apellido no coincide`);
          } else if (losDatos.FechaNacimiento === 0) {
            throw new Error(`Servicio Segip: Fecha de nacimiento no coincide`);
          }
          return {
            finalizado: true,
            mensaje: resultado.DescripcionRespuesta,
          };
        } else if (resultado.CodigoRespuesta === '3') {
          throw new Error(`Servicio Segip: ${resultado.DescripcionRespuesta}`);
        } else if (resultado.CodigoRespuesta === '4') {
          throw new Error(`Servicio Segip: ${resultado.DescripcionRespuesta}`);
        } else if (resultado.CodigoRespuesta === '1') {
          throw new Error(`Servicio Segip: ${resultado.DescripcionRespuesta}`);
        } else if (resultado.CodigoRespuesta === '0') {
          throw new Error(`Servicio Segip: ${resultado.DescripcionRespuesta}`);
        }
      }
      throw new Error(
        'Servicio Segip: No se han podido obtener los datos solicitados',
      );
    } catch (error) {
      console.log('error', error);
      if (error.message.startsWith('Servicio Segip:')) {
        return {
          finalizado: false,
          mensaje: error.message,
        };
      }
      throw new ExternalServiceException('SEGIP:CONTRASTACION', error);
      /* return {
        resultado: false,
        mensaje: 'Ocurrió un problema al obtener los datos de la persona',
      }; */
    }
  }
}
