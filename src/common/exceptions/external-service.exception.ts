import { HttpException, HttpStatus } from '@nestjs/common';

export class ExternalServiceException extends HttpException {
  constructor(service, error) {
    const errorMessage =
      error?.response?.data || error.request || error.message;
    console.error('Error', errorMessage);
    super(
      `Ocurrio un error con el servicio de: ${service}`,
      HttpStatus.FAILED_DEPENDENCY,
    );
  }
}
