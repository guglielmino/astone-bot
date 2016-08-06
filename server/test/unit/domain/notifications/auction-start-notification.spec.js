'use strict';

import chai from 'chai';
import sinon from 'sinon';
import AuctionStartNotification from '../../../../services/domain/notifications/auction-start-notification';

import {ObjectID} from 'mongodb';

// Tell chai that we'll be using the "should" style assertions.
chai.should();
let expect = chai.expect;


describe('AuctionStartNotification', () => {
  let auctionStartNotification;
  let telegram;

  beforeEach(() => {
    telegram = {};
    telegram.sendMessage = sinon.stub();

    const userManager = {
      getAll: sinon.stub()
        .returns(
          Promise.resolve(require('../fixtures/users.json'))
        )
    };

    const auctionManager = {
      getStarting: sinon.stub().returns(
        Promise.resolve(require('../fixtures/starting-auctions.json'))
      )
    };


    const managerFactory = {
      getUserManager: function () {
        return userManager;
      },
      getAuctionManager: function () {
        return auctionManager;
      }
    };

    auctionStartNotification = AuctionStartNotification(telegram,
      managerFactory);
  });

  it('Should call sendMessage for all 3 users', (done) => {

    auctionStartNotification
      .sendNotification(new Date(), 'http://astone.gumino.com/pages/auction/')
      .then(sent => {
        telegram.sendMessage
          .calledThrice
          .should.be.true;

        done();
      });
  });

});
