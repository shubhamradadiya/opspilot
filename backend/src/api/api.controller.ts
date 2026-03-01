import { Controller, Get, Render } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('api')
export class ApiController {
  /**
   * API changelogs
   */
  @Get('changelogs')
  @ApiExcludeEndpoint()
  @Render('api/change-logs')
  async apiChangeLogs() {
    return null;
  }
}
