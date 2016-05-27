'use strict';

import Router from 'koa-router';
import convert from 'koa-convert';
import bodyParser from 'koa-bodyparser';
import telegramRoutes from './telegram.route';

export default (app, chatter, paypal) => {
	app.use(convert(bodyParser()));

	const router = new Router();

	telegramRoutes(router, chatter, paypal);

	app.use(router.routes());
};



