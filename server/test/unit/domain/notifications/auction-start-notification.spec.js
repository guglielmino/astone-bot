'use strict';

import chai from 'chai';
import sinon from 'sinon';
import { ObjectID } from 'mongodb';
import AuctionStartNotification from '../../../../services/domain/notifications/auction-start-notification';


// Tell chai that we'll be using the "should" style assertions.
chai.should();
const { expect } = chai;


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
      getUserManager() {
        return userManager;
      },
      getAuctionManager() {
        return auctionManager;
      }
    };

    auctionStartNotification = AuctionStartNotification(telegram,
      managerFactory);
  });

  it('Should call sendMessage for all 3 users', (done) => {
    auctionStartNotification
      .sendNotification(new Date(), 'http://astone.gumino.com/pages/auction')
      .then((sent) => {
        telegram.sendMessage
          .calledThrice
          .should.be.true;

        done();
      });
  });

  it('Should call sendmessage with reply_markup', (done) => {
    auctionStartNotification
      .sendNotification(new Date(), 'http://astone.gumino.com/pages/auction')
      .then((sent) => {
        telegram.sendMessage
          .calledWith(sinon.match.has('reply_markup'))
          .should.be.true;

        done();
      });
  });
});
