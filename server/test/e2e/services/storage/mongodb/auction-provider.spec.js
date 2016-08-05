'use strict';

import chai from 'chai';
import sinon from 'sinon';
import StorageProvider from './storage-provivider-test-extensions';

// Tell chai that we'll be using the "should" style assertions.
chai.should();
let expect = chai.expect;

describe('AuctionProvider', () => {
  let storageProvider;

  beforeEach((done) => {
    storageProvider = new StorageProvider();
    storageProvider
      .connect({
          mongo: {
            uri: 'mongodb://192.168.99.100:27017/astone-test'
          }
        }
      )
      .then((db) => {
        storageProvider
          .readFixture('starting-auctions.json',
            err => {
              done(err);
            });
      });
  });

  afterEach(() => {
    storageProvider.dropDb();
  });


  it('Should return auctions starting in next 5 min', (done) => {
    const refDate = new Date('2016-12-16T09:00:00.000Z');

    storageProvider
      .auctionProvider
      .getStarting(refDate, 5)
      .then(auctions => {
        auctions.length.should.be.equal(1);
        done();
      })
      .catch(err => {
        done(err);
      });

  });
});
