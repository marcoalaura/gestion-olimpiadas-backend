import {
  BadRequestException,
  PreconditionFailedException,
} from '@nestjs/common';
import { Messages } from '../constants/response-messages';
import { SuccessResponseDto } from './success-response.dto';
import {
  GetJsonData,
  ConvertJsonToFiltroQuery,
} from '../../common/lib/json.module';

export abstract class AbstractController {
  private makeResponse(data, message: string): SuccessResponseDto {
    return {
      finalizado: true,
      mensaje: message,
      datos: data,
    };
  }

  successList(data, message = Messages.SUCCESS_LIST): SuccessResponseDto {
    return this.makeResponse(data, message);
  }

  successUpdate(data, message = Messages.SUCCESS_UPDATE): SuccessResponseDto {
    return this.makeResponse(data, message);
  }

  successDelete(data, message = Messages.SUCCESS_DELETE): SuccessResponseDto {
    return this.makeResponse(data, message);
  }

  successCreate(data, message = Messages.SUCCESS_CREATE): SuccessResponseDto {
    return this.makeResponse(data, message);
  }

  getIdUser(req: any): string {
    if (req?.user?.id) {
      return req.user.id;
    }
    throw new BadRequestException(
      `Es necesario que este autenticado para consumir este recurso.`,
    );
  }

  getRol(req: any) {
    if (req?.user?.rol) {
      return req.user.rol;
    }
    throw new BadRequestException(
      `Es necesario que este autenticado para consumir este recurso.`,
    );
  }

  getIdRol(req: any) {
    if (req?.user?.idRol) {
      return req.user.idRol;
    }
    throw new BadRequestException(
      `Es necesario que este autenticado para consumir este recurso.`,
    );
  }

  // Para usar la funcion debe enviarse en el filtro idOlimpiada
  getNivel(req: any, paginacionQueryDto: any) {
    if (req?.user?.nivel) {
      const { filtro } = paginacionQueryDto;
      const parametros = filtro ? GetJsonData(filtro) : {};
      if (!parametros.idOlimpiada) {
        throw new PreconditionFailedException(
          'Debe seleccionar una olimpiada.',
        );
      }
      const usuarioRol = req.user.nivel.find((item: any) => {
        if (parametros.idOlimpiada == item.idOlimpiada) {
          return item;
        }
      });
      if (!usuarioRol && req.user.rol !== 'SUPER_ADMIN') {
        throw new PreconditionFailedException(
          'No tiene permisos pare realizar la operación.',
        );
      }
      Object.assign(parametros, usuarioRol);
      const filtroQuery = parametros
        ? ConvertJsonToFiltroQuery(parametros)
        : null;
      paginacionQueryDto.filtro = filtroQuery;
      return paginacionQueryDto;
    }
    throw new BadRequestException(
      `Es necesario que este autenticado para consumir este recurso.`,
    );
  }
}
