'use strict';

import logger from './services/logger';

import bluebird from 'bluebird';
import redis from 'redis';

import web from './web';
import * as urlConsts from './web/url-consts';

import StorageProvider from './services/storage/mongodb';
import RepeatingScheduler from './services/scheduler/RepeatingScheduler';
import StateManager from './services/bot/state-manager';
import TelegramReqParser from './services/bot/telegram-req-parser';
import TelegramChatter from './services/bot/telegram-chatter';
import i18n from 'i18n';

import ManagerFactory from './services/domain/manager-factory';

import AuctionAges from './services/domain/auction-ages';
import AuctionChant from './services/domain/auction-chant';
import AuctionTimer from './services/domain/auction-timer';
import AuctionEvents from './services/domain/auction-events';
import AuctionStartNotification from './services/domain/notifications/auction-start-notification';
import AuctionPayNotification from './services/domain/notifications/auction-pay-notification';

import commands from './app.commands';
import Telegram from './bot-api/telegram';
import PayPal from './services/payment/paypal';

import config from './config';

const paypal = new PayPal({
  env: config.paypal.env,
  client_id: config.paypal.client_id,
  client_secret: config.paypal.client_secret,
  returnUrl: urlConsts.API_PAYPAL_SUCCESS,
  cancelUrl: urlConsts.API_PAYPAL_CANCEL
});


const request = bluebird.promisify(require('request'));
const telegram = new Telegram(request, config.telegram.api_key);

const storageProvider = new StorageProvider();
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
    const telegramReqParser = TelegramReqParser();
    const chatter = new TelegramChatter(stateManager, telegramReqParser);

    const managerFactory = ManagerFactory(storageProvider);

    const auctionAges = AuctionAges();
    const auctionChant = AuctionChant(telegram,
      managerFactory.getAuctionManager(), auctionAges);

    const auctionTimer = new AuctionTimer(auctionChant);
    auctionTimer.schedule(ticks => auctionChant.make(new Date()));

    const auctionStartNotification = AuctionStartNotification(telegram, managerFactory);
    auctionTimer.schedule(ticks => {
      if (ticks % 60 === 0) {
        auctionStartNotification.sendNotification(new Date(), config.base_url + '/pages/auction/');
      }
    });

    const auctionPayNotification = AuctionPayNotification(telegram, managerFactory);
    auctionTimer.schedule(ticks => {
      if (ticks % 60 === 0) {
        auctionPayNotification.sendNotification(new Date(), urlConsts.PAGE_PAYPAL_GETPAYURL, config.cipher_password);
      }
    });

    const closeAuctionUrl = config.base_url + urlConsts.PAGE_PAYPAL_GETPAYURL;
    const auctionEvents = new AuctionEvents(telegram, i18n,
      managerFactory.getAuctionManager(), closeAuctionUrl);

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

    telegram.getMe().then(info => {
      logger.info(`${info.result.username} ready to answer!!`);
    });

    web(managerFactory.getAuctionManager(), chatter, paypal, config);
  })
  .catch((err) => {
    logger.error("Startup error: " + err.message + "\n" + err.stack);
  });



