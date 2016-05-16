'use strict';

import logger from './services/logger';
import Koa from 'koa';
import config from './config';
import Promise from 'bluebird';
import api from './api';
import StorageProvider from './services/storage/mongodb';
import RepeatingScheduler from './services/scheduler/RepeatingScheduler';
import TelegramChatter from './services/bot/telegram-chatter';
import i18n from 'i18n';
import AuctionManager from './services/domain/auction-manager';
import AuctionTimer from './services/domain/auction-timer';

import commands from './app.commands';

import Telegram from './bot-api/telegram';

const request = Promise.promisify(require('request'));
const telegram = new Telegram(request, config.telegram.api_key);

const storageProvider = new StorageProvider(config);


const sched = new RepeatingScheduler();

i18n.configure({
	locales:['en', 'it'],
	directory: __dirname + '/res/locales',
	register: global
});

storageProvider
	.connect(config)
	.then((db) => {
		logger.debug("Db connected, configuring providers");

		const chatter = new TelegramChatter(logger);
		const auctionManager = new AuctionManager(storageProvider.auctionProvider);
		const auctionTimer = new AuctionTimer(telegram, i18n, auctionManager);
		commands(chatter, telegram, i18n, auctionManager);

		let lastupdateId = 0;

		if (!config.telegram.use_webhook) {
			sched.schedule(() => {
				telegram.getUpdates(lastupdateId, 100, 1000)
					.then((res) => {
						if (res.result) {
							res.result.forEach((req) => {
								lastupdateId = chatter.processRequest(req);
							});
						}
					})
					.catch((error) => {
						logger.error("getUpdates => " + error);
					});
			}, 1000);
		}
	});


