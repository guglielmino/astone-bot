'use strict';

import program from 'commander';

import config from './config';
import StorageProvider from './services/storage/mongodb';
import ManagerFactory from './services/domain/manager-factory';

function connect() {

  return new Promise((resolve, reject) => {
    const storageProvider = new StorageProvider();
    storageProvider
      .connect(config)
      .then((db) => {
        const managerFactory = ManagerFactory(storageProvider);
        resolve({db: db, manager: managerFactory});

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
              console.log(`${auction._id } - ${auction.title} `);
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


funcs.approve = function (value, date) {
  console.log("approve " + value + " - " + date);

  let startDate = null;
  if(date) {
    startDate = new Date(date);
  }
  else {
    console.log("A StartDate is needed");
    return;
  }

  connect()
    .then(obj => {
      let managerFactory = obj.manager;
      managerFactory
        .getAuctionManager()
        .updateAuction(value, {startDate: startDate})
        .then(res => {
          if(res) {
            console.log("Auctions startDate set to " + startDate);
          }
        });
      obj.db.close();
    })
    .catch(err => {
      console.log(err);
    });
};

program
  .version('0.0.1')
  .option('-l, --list', 'List auctions waiting for approval', funcs.list)
  .option('-a, --approve <auctionId> [date]', 'Approve an auction')
  .action(function (date, options) {
    funcs.approve(options.approve, date);
  })
  .parse(process.argv);


