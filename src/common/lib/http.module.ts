import { Response } from 'express';
import { SuccessResponseDto } from '../dto/success-response.dto';
import { TotalRowsResponseDto } from '../dto/total-rows-response.dto';

export const totalRowsResponse = function (data): TotalRowsResponseDto {
  const [filas, total] = data;
  return { total, filas };
};

export const successResponse = function (
  data,
  mensaje = 'ok',
): SuccessResponseDto {
  return {
    finalizado: true,
    mensaje,
    datos: data,
  };
};

export const sendRefreshToken = (res: Response, token: string) => {
  const ttl = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN, 10);
  res.cookie(process.env.REFRESH_TOKEN_NAME, token, {
    httpOnly: true,
    secure: JSON.parse(process.env.REFRESH_TOKEN_SECURE),
    // domain: '.app.com',
    expires: new Date(Date.now() + ttl),
    path: process.env.REFRESH_TOKEN_PATH,
    sameSite: 'strict',
  });
};
