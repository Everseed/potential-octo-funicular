import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      name: 'PrepAI API',
      version: '1.0',
      status: 'active',
    };
  }

  @Get('stats')
  getStats() {
    return [];
  }
}
