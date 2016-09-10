'use strict';

require('dotenv').config();

const mongo_db_name = process.env.MONGO_DB || '/astone';

const config = {
  env: process.env.NODE_ENV || 'development',
  base_url: process.env.BASE_URL || 'http://localhost:9001',
  cipher_password: process.env.CIPHER_PWD || 'password',
  server: {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.NODE_PORT || 9001
  },
  telegram: {
    api_key: process.env.BOT_KEY || '00000',
    use_webhook: process.env.USE_WEBHOOK || false
  },
  messenger: {
    validation_token: process.env.FB_VALIDATION_CODE || ''
  },
  mongo: {
    uri: `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}${mongo_db_name}`
  },
  paypal: {
    env: process.env.PAYPAL_ENV,
    client_id: process.env.PAYPAL_CLIENT_ID,
    client_secret: process.env.PAYPAL_CLIENT_SECRET
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    db: process.env.REDIS_DB || 0
  }
};

export default Object.freeze(config);
