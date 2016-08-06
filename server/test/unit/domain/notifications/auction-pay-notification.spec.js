'use strict';

import chai from 'chai';
import sinon from 'sinon';
import AuctionPayNotification from '../../../../services/domain/notifications/auction-pay-notification';

// Tell chai that we'll be using the "should" style assertions.
chai.should();
let expect = chai.expect;


describe('AuctionPayNotification', () => {
  let auctionPayNotification;
  let telegram;

  beforeEach(() => {
    telegram = {};
    telegram.sendMessage = sinon.stub();


    const auctionManager = {
      getClosedAndWaitingForPayment: sinon.stub().returns(
        Promise.resolve(require('../fixtures/closed-auctions.json'))
      ),
      updateAuction: sinon.stub()
    };

    const managerFactory = {
      getAuctionManager: function () {
        return auctionManager;
      }
    };

    auctionPayNotification = AuctionPayNotification(telegram,
      managerFactory);
  });

  it('Should send payment reminder to auction winner', (done) => {
    auctionPayNotification
      .sendNotification(new Date(), 'http//localhost/pages/pay', '123')
      .then(sent => {
        telegram
          .sendMessage
          .calledTwice.should.be.true;
        done();
      })
      .catch(err => {
        done(err);
      });
  });

});
