import winston from 'winston';

const logger = new winston.Logger({

	transports: [
		new winston.transports.Console({ json: false, timestamp: true, level: 'debug' }),
		new winston.transports.File({ filename: './app.log', json: false, level: 'debug' })
	],
	exceptionHandlers: [
		new (winston.transports.Console)({ json: false, timestamp: true }),
		new winston.transports.File({ filename: './exceptions.log', json: false })
	],
	exitOnError: false
});

module.exports = logger;
