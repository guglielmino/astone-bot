'use strict';

import chai from 'chai';
import sinon from 'sinon';
import { ObjectID } from 'mongodb';
import StorageProvider from './storage-provivider-test-extensions';

// Tell chai that we'll be using the "should" style assertions.
chai.should();
const { expect } = chai;

describe('AuctionProvider', () => {
  let storageProvider;

  beforeEach((done) => {
    storageProvider = StorageProvider();

    storageProvider
      .connect({
        mongo: {
          uri: 'mongodb://192.168.99.100:27017/astone-test'
        }
      })
      .then((db) => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  afterEach((done) => {
    storageProvider.dropDb();
    done();
  });


  it('Should returns auctions starting in next 5 min', (done) => {
    const refDate = new Date('2016-12-16T09:00:00.000Z');

    storageProvider
      .readFixture('starting-auctions.json',
        (err) => {
          storageProvider
            .auctionProvider
            .getStarting(refDate, 5)
            .then((auctions) => {
              auctions.length.should.be.equal(1);
              auctions[0].title.should.be.equal('GameBoy');
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
  });

  it('Should returns auctions starting now', (done) => {
    const refDate = new Date('2016-12-16T09:00:00.000Z');

    storageProvider
      .readFixture('starting-auctions.json',
        (err) => {
          storageProvider
            .auctionProvider
            .getStarting(refDate, 0)
            .then((auctions) => {
              auctions.length.should.be.equal(1);
              auctions[0].title.should.be.equal('VIC 20');
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
  });

  it('Should returns auctions without start date', (done) => {
    storageProvider
      .readFixture('new-auctions.json',
        (err) => {
          storageProvider
            .auctionProvider
            .getNewAuctions()
            .then((auctions) => {
              auctions.length.should.be.equal(2);
              done();
            })
            .catch((err) => {
              done(err);
            });
        });
  });

  it('Should create an auction with specific owner data', (done) => {
    storageProvider
      .auctionProvider
      .save({ owner: { username: 'guglielmino', chatId: '12344444' }, title: 'A sample auction' })
      .then((res) => {
        res.should.not.be.null;
        return storageProvider
          .auctionProvider
          .getAuctionById(res);
      })
      .then((auction) => {
        auction.owner.username.should.be.equal('guglielmino');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
