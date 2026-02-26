import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entity/country.entity';
import axios from 'axios';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}

  /**
   * Store country
   * @returns
   */
  async storeCountriesAndCities() {
    try {
      // Get all countries from restcountries.com
      const countries = await axios.get(
        'https://restcountries.com/v3.1/all?fields=name,flags,idd,cca3,cca2',
      );

      // If countries data is not empty, then store the data in the database
      if (countries?.data?.length) {
        const data = countries.data.flatMap(ele => {
          if (!ele.idd.root) {
            if (['AQ', 'HM'].includes(ele.cca2)) {
              ele.idd.root = '+672';
            }
          }

          return {
            name: ele.name?.common || '',
            officialName: ele.name?.official || '',
            flagPng: ele.flags?.png || '',
            flagSvg: ele.flags?.svg || '',
            isoCode3: ele.cca3 || '',
            isoCode: ele.cca2 || '',
            phoneCode: ele.idd.root,
            suffixes: ele.idd.suffixes?.join(',') || '',
          };
        });

        // If data is not empty, then truncate the table and store the data in the database
        if (data.length) {
          await this.countryRepository.query('TRUNCATE TABLE countries RESTART IDENTITY CASCADE;');

          await this.countryRepository.save(data);
        }

        // Return the countries data
        return await this.countryRepository.find({ order: { name: 'ASC' } });
      }
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Oops! Country data not stored');
    }
  }

  /**
   * Get Country List
   * @returns
   */
  async getCountries() {
    // Get the countries data from the database
    const countries = await this.countryRepository.find({
      order: { name: 'ASC' },
    });

    // If countries data is empty, then store the data in the database
    if (!countries?.length) {
      return await this.storeCountriesAndCities();
    }

    // Return the countries data
    return countries;
  }
}
