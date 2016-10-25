'use strict';

import program from 'commander';
import bluebird from 'bluebird';

import Telegram from './bot-api/telegram';
import config from './config';
import StorageProvider from './services/storage/mongodb';
import ManagerFactory from './services/domain/manager-factory';
import AuctionApprover from './services/domain/auction-approver';

import * as urlConsts from './web/url-consts';


const request = bluebird.promisify(require('request'));
const telegram = new Telegram(request, config.telegram.api_key);

function connect() {
  return new Promise((resolve, reject) => {
    const storageProvider = new StorageProvider();
    storageProvider
      .connect(config)
      .then((db) => {
        const managerFactory = ManagerFactory(storageProvider);
        resolve({ db: db, manager: managerFactory });

      })
      .catch(err => {
        reject(err);
      });
  });
}


const funcs = {};

funcs.list = function () {
  connect()
    .then(obj => {
      let managerFactory = obj.manager;
      managerFactory
        .getAuctionManager()
        .getNewAuctions()
        .then(auctions => {
          if (auctions && auctions.length > 0) {
            auctions.forEach(auction => {
              let auctionUrl = config.base_url + new String(urlConsts.PAGE_AUCTION_DETAILS).replace(':auid', auction._id);
              console.log(`${auctionUrl} - ${auction.title} `);
            });
          } else {
            console.log('No auctions waiting for approval found');
          }
          obj.db.close();
        })
        .catch(err => {
          console.log(err);
        });
    });
};

funcs.approve = function (auctionId, date) {
  let startDate = null;
  if (date) {
    startDate = new Date(date);
  }
  else {
    console.log("A StartDate is needed");
    return;
  }

  connect()
    .then(obj => {

      let managerFactory = obj.manager;
      const approver = AuctionApprover(telegram, managerFactory.getAuctionManager());

      approver
        .approve(auctionId, date)
        .then(res => {
          obj.db.close();
        })
        .catch(err => console.log);
    });
};

funcs.reject = function(auctionId) {
  connect()
    .then(obj => {

      let managerFactory = obj.manager;
      const approver = AuctionApprover(telegram, managerFactory.getAuctionManager());

      approver
        .reject(auctionId)
        .then(res => {
          obj.db.close();
        })
        .catch(err => console.log);
    });
};

program
  .version('0.0.1')
  .option('-l, --list', 'List auctions waiting for approval', funcs.list)
  .option('-a, --approve <auctionId> [date]', 'Approve an auction')
  .action(function (date, options) {
    funcs.approve(options.approve, date);
  })
  .option('-r --reject <auctionId>', 'Reject auction', funcs.reject)
  .parse(process.argv);


