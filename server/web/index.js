'use strict';

import Koa from 'koa';
import Router from 'koa-router';
import convert from 'koa-convert';
import bodyParser from 'koa-bodyparser';
import views from'koa-views';
import serve from 'koa-static';

import telegramRoutes from './telegram.route';
import messengerRoutes from './messenger.routes';

import paymetRoutes from './payment.route';
import pagesRoutes from './pages.route';
import logger from '../services/logger';

export default (auctionManager, chatter, paypal, config) => {
	const app = new Koa();

	app.use(convert(bodyParser()));

  app.use(views(__dirname + '/views', {
    map: {
      html: 'swig'
    }
  }));

  if(config.env === 'development') {
    app.use(serve(__dirname + '/public'));
  }

	const router = new Router();

	telegramRoutes(router, chatter);
  messengerRoutes(router, config, logger);
	paymetRoutes(router, auctionManager, paypal, config);
  pagesRoutes(router, auctionManager, config);

	app.use(router.routes());

	(async() => {
		app.listen(config.server.port, () => {
			logger.debug(`App started on port ${config.server.port} with environment ${config.env}`);
		});
	})();

};



