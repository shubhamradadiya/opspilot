import { DataSource, type DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
import { Environment } from 'src/constants/app.constant';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST as string,
  port: +(process.env.DB_PORT as string),
  username: process.env.DB_USERNAME as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_DATABASE as string,
  synchronize: process.env.ENVIRONMENT !== Environment.PRODUCTION,
  logging: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/**/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
