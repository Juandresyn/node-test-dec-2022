import * as dotenv from 'dotenv';

import errors from '../assets/i18n/en/errors';
import messages from '../assets/i18n/en/messages';

dotenv.config();

const isTestEnvironment = process.env.NODE_ENV === 'test';

export default {
  errors,
  messages,
  name: 'Juandres BE test',
  version: '1.0',
  host: process.env.HOST || '127.0.0.1',
  environment: process.env.NODE_ENV || 'development',
  port: (isTestEnvironment ? process.env.TEST_APP_PORT : process.env.PORT) || '8000',
  pagination: {
    page: 1,
    maxRows: 20,
  },
  db: {
    host: isTestEnvironment ? process.env.TEST_DB_HOST : process.env.DB_HOST,
    port: isTestEnvironment ? process.env.TEST_DB_PORT : process.env.DB_PORT,
    username: isTestEnvironment ? process.env.TEST_DB_USERNAME : process.env.DB_USERNAME,
    password: isTestEnvironment ? process.env.TEST_DB_PASSWORD : process.env.DB_PASSWORD,
    database: isTestEnvironment ? process.env.TEST_DB_NAME : process.env.DB_NAME,
  },
  logging: {
    dir: process.env.LOGGING_DIR || 'logs',
    level: process.env.LOGGING_LEVEL || 'debug',
  },
};
