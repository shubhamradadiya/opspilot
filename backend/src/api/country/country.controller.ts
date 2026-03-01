import { Controller, Get, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Country } from './entity/country.entity';
import { CountryService } from './country.service';

@ApiTags('Countries')
@Controller('api/v1')
@UsePipes(ValidationPipe)
export class CountryController {
  constructor(private countryService: CountryService) {}

  /**
   * Country List
   * @returns
   */
  @ApiOperation({
    summary: 'Country List',
    description: `Country List`,
  })
  @Get('country')
  async getCountries() {
    const data = await this.countryService.getCountries();

    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: plainToInstance(Country, data, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      }),
    };
  }
}
