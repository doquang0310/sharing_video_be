import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get('/tests')
  getHello(): string {
    return 'Hello World!';
  }
}