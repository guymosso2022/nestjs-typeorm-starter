import { HttpException } from '@nestjs/common';

export class HttpExceptionFilter extends HttpException {
  statusCode: string;
  public constructor(message: string, statusCode: string, status: number) {
    super(message, status);

    this.statusCode = statusCode;
  }
}
