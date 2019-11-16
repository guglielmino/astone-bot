'use strict';

import program from 'commander';
import requestsync from 'request';
import util from 'util';

import Telegram from './bot-api/telegram';
import config from './config';
import StorageProvider from './services/storage/mongodb';
import ManagerFactory from './services/domain/manager-factory';
import AuctionApprover from './services/domain/auction-approver';

import * as urlConsts from './web/url-consts';

const request = util.promisify(requestsync);
const telegram = new Telegram(request, config.telegram.api_key);

function connect() {
  return new Promise((resolve, reject) => {
    const storageProvider = StorageProvider();
    storageProvider
      .connect(config)
      .then((db) => {
        const managerFactory = ManagerFactory(storageProvider);
        resolve({ db, manager: managerFactory });
      })
      .catch((err) => {
        reject(err);
      });
  });
}


const funcs = {};

funcs.list = function () {
  connect()
    .then((obj) => {
      const managerFactory = obj.manager;
      managerFactory
        .getAuctionManager()
        .getNewAuctions()
        .then((auctions) => {
          if (auctions && auctions.length > 0) {
            auctions.forEach((auction) => {
              const auctionUrl = config.base_url + new String(urlConsts.PAGE_AUCTION_DETAILS).replace(':auid', auction._id);
              console.log(`${auctionUrl} - ${auction.title} `);
            });
          } else {
            console.log('No auctions waiting for approval found');
          }
          obj.db.close();
        })
        .catch((err) => {
          console.log(err);
        });
    });
};

funcs.approve = function (auctionId, date) {
  const today = new Date();
  let startDate = null;
  if (date) {
    startDate = new Date(date);
  } else {
    startDate = today.setDate(today.getDate() - 1);
  }

  connect()
    .then((obj) => {
      const managerFactory = obj.manager;
      const approver = AuctionApprover(telegram, managerFactory.getAuctionManager());

      approver
        .approve(auctionId, date)
        .then((res) => {
          obj.db.close();
        })
        .catch((err) => console.log(err));
    });
};

funcs.reject = function (auctionId) {
  connect()
    .then((obj) => {
      const managerFactory = obj.manager;
      const approver = AuctionApprover(telegram, managerFactory.getAuctionManager());

      approver
        .reject(auctionId)
        .then((res) => {
          obj.db.close();
        })
        .catch((err) => console.log(err));
    });
};

program
  .version('0.0.2')
  .option('-l, --list', 'List auctions waiting for approval', funcs.list)
  .option('-r, --reject <auctionId>', 'Reject auction', funcs.reject)
  .option('-a, --approve <auctionId> [date]', 'Approve an auction', (auctionId, date, options) => {
    funcs.approve(auctionId, null);
  })
  .parse(process.argv);
