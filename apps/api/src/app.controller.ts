import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
    return this.appService.getStats();
  }
}