'use strict';

import chai from 'chai';
import sinon from 'sinon';
import AuctionEndNotification from '../../../../services/domain/notifications/auction-end-notification';

// Tell chai that we'll be using the "should" style assertions.
chai.should();
const { expect } = chai;


describe('AuctionEndNotification', () => {
  let auctionEndNotification;
  let telegram;

  beforeEach(() => {
    telegram = {};
    telegram.sendMessage = sinon.stub().returns(Promise.resolve(null));


    const auctionManager = {
      getClosedAndWaitingForPayment: sinon.stub().returns(
        Promise.resolve(require('../fixtures/closed-auctions.json'))
      ),
      updateAuction: sinon.stub()
    };

    const managerFactory = {
      getAuctionManager() {
        return auctionManager;
      }
    };

    auctionEndNotification = AuctionEndNotification(telegram,
      managerFactory);
  });

  it('Should notificate auction winner and owner', (done) => {
    auctionEndNotification
      .sendNotification(new Date(), '123')
      .then((sent) => {
        telegram
          .sendMessage
          .callCount.should.be.equal(4);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
