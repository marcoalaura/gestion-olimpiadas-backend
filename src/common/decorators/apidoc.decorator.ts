import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { SuccessResponseDto } from './../../common/dto/success-response.dto';
import { Messages } from '../../common/constants/response-messages';

export const ApiDocSuccessList = (Descripcion = '', ModelDTO) => {
  return applyDecorators(
    ApiOperation({ summary: Descripcion }),
    ApiExtraModels(ModelDTO),
    ApiOkResponse({
      schema: {
        properties: {
          finalizado: {
            type: 'boolean',
            example: true,
          },
          mensaje: {
            type: 'string',
            example: Messages.SUCCESS_LIST,
          },
          datos: {
            type: 'object',
            properties: {
              total: {
                type: 'number',
                example: 1,
              },
              filas: {
                type: 'array',
                items: { $ref: getSchemaPath(ModelDTO) },
              },
            },
          },
        },
      },
    }),
  );
};

export const ApiDocSuccesGetById = (Descripcion = '', ModelDTO) => {
  return applyDecorators(
    ApiOperation({ summary: Descripcion }),
    ApiExtraModels(ModelDTO),
    ApiOkResponse({
      schema: {
        properties: {
          finalizado: {
            type: 'boolean',
            example: true,
          },
          mensaje: {
            type: 'string',
            example: Messages.SUCCESS_LIST,
          },
          datos: {
            $ref: getSchemaPath(ModelDTO),
          },
        },
      },
    }),
  );
};

export const ApiDocSuccessCreate = (Descripcion = '', ModelDTO) => {
  return applyDecorators(
    ApiOperation({ summary: Descripcion }),
    ApiExtraModels(SuccessResponseDto),
    ApiExtraModels(ModelDTO),
    ApiOkResponse({
      schema: {
        properties: {
          finalizado: {
            type: 'boolean',
            example: true,
          },
          mensaje: {
            type: 'string',
            example: Messages.SUCCESS_CREATE,
          },
          datos: {
            $ref: getSchemaPath(ModelDTO),
          },
        },
      },
    }),
  );
};

export const ApiDocSuccessUpdate = (Descripcion = '', ModelDTO) => {
  return applyDecorators(
    ApiOperation({ summary: Descripcion }),
    ApiExtraModels(SuccessResponseDto),
    ApiExtraModels(ModelDTO),
    ApiOkResponse({
      schema: {
        properties: {
          finalizado: {
            type: 'boolean',
            example: true,
          },
          mensaje: {
            type: 'string',
            example: Messages.SUCCESS_UPDATE,
          },
          datos: {
            $ref: getSchemaPath(ModelDTO),
          },
        },
      },
    }),
  );
};

export const ApiDocSuccessDelete = (Descripcion = '', ModelDTO) => {
  return applyDecorators(
    ApiOperation({ summary: Descripcion }),
    ApiExtraModels(ModelDTO),
    ApiOkResponse({
      schema: {
        properties: {
          finalizado: {
            type: 'boolean',
            example: true,
          },
          mensaje: {
            type: 'string',
            example: Messages.SUCCESS_DELETE,
          },
          datos: {
            $ref: getSchemaPath(ModelDTO),
          },
        },
      },
    }),
  );
};
