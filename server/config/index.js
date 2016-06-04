'use strict';

const config = {
	env: process.env.NODE_ENV || 'development',
	base_url: process.env.BASE_URL || 'https://bidbot.localtunnel.me',
	cipher_password: process.env.CIPHER_PWD || 'password',
	server: {
		host: process.env.HOST || '0.0.0.0',
		port: process.env.NODE_PORT || 9001
	},
	telegram: {
		api_key: process.env.BOT_KEY,
		use_webhook : process.env.USE_WEBHOOK|| false
	},
	mongo: {
		uri: process.env.MONGO_URI
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