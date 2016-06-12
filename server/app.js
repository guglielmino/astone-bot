'use strict';

import logger from './services/logger';
import config from './config';
import bluebird from 'bluebird';
import redis from 'redis';
import {EventEmitter} from 'events';

import web from './web';
import * as urlConsts from './web/url-consts';

import StorageProvider from './services/storage/mongodb';
import RepeatingScheduler from './services/scheduler/RepeatingScheduler';
import StateManager from './services/bot/state-manager';
import TelegramChatter from './services/bot/telegram-chatter';
import i18n from 'i18n';

import ManagerFactory from './services/domain/manager-factory';

import AuctionChant from './services/domain/auction-chant';
import AuctionTimer from './services/domain/auction-timer';
import AuctionEvents from './services/domain/auction-events';

import commands from './app.commands';
import Telegram from './bot-api/telegram';
import PayPal from './services/payment/paypal';


const paypal = new PayPal({
  env: config.paypal.env,
  client_id: config.paypal.client_id,
  client_secret: config.paypal.client_secret,
  returnUrl: urlConsts.API_PAYPAL_SUCCESS,
  cancelUrl: urlConsts.API_PAYPAL_CANCEL
});


const request = bluebird.promisify(require('request'));
const telegram = new Telegram(request, config.telegram.api_key);

const storageProvider = new StorageProvider(config);
const sched = new RepeatingScheduler();

// We want all dates in UTC
process.env.TZ = 'UTC';


i18n.configure({
  locales: ['en', 'it'],
  directory: __dirname + '/res/locales',
  register: global
});

storageProvider
  .connect(config)
  .then((db) => {
    logger.debug('Db connected, configuring providers');

    bluebird.promisifyAll(redis.RedisClient.prototype);
    const redisClient = redis.createClient({
      host: config.redis.host,
      port: config.redis.port,
      db: config.redis.db
    });
    const stateManager = StateManager(redisClient);
    const chatter = new TelegramChatter(stateManager);

    const managerFactory = ManagerFactory(storageProvider);
    const eventEmitter = new EventEmitter();
    const auctionChant = AuctionChant(telegram,
      managerFactory.getAuctionManager());
    const auctionTimer = new AuctionTimer(auctionChant, eventEmitter);
    const closeAuctionUrl = config.base_url + urlConsts.PAGE_PAYPAL_GETPAYURL;
    const auctionEvents = new AuctionEvents(telegram, i18n,
      managerFactory.getAuctionManager(), eventEmitter, closeAuctionUrl);

    auctionTimer.start();
    commands(chatter, telegram, managerFactory);

    let lastupdateId = 0;

    if (!config.telegram.use_webhook) {
      logger.debug("Using polling updates");
      sched.schedule(() => {
        telegram.getUpdates(lastupdateId, 100, 0)
          .then((res) => {
            if (res.result) {
              res.result.forEach((req) => {
                lastupdateId = chatter.processRequest(req);
                lastupdateId = req.update_id + 1;
              });
            }
            else {
              logger.error(JSON.stringify(res));
            }
          })
          .catch((error) => {
            logger.error("getUpdates => " + error);
          });
      }, 2000);
    }
    else {
      logger.debug("Using webook");
    }

    web(managerFactory.getAuctionManager(), chatter, paypal, config);
  })
  .catch((err) => {
    logger.error("Startup error: " + err.message);
  });



