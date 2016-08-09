'use strict';

import fs from 'fs';
import chai from 'chai';
import sinon from 'sinon';

import AuctionApprover from '../../../services/domain/auction-approver';

// Tell chai that we'll be using the "should" style assertions.
chai.should();
let expect = chai.expect;

describe('AuctionApprover', () => {
  let auctionApprover;
  let telegram;
  let auctionManager;

  beforeEach((done) => {

    const fixtureData = fs.readFileSync(`${__dirname}/fixtures/auction-to-be-approved.json`);
    const auction = JSON.parse(fixtureData);
    telegram = {};
    telegram.sendMessage = sinon.stub();

    auctionManager = {};
    auctionManager.getAuctionById = sinon.stub().returns(Promise.resolve(auction));
    auctionManager.updateAuction = sinon.stub().returns(Promise.resolve(true));

    auctionApprover = AuctionApprover(telegram, auctionManager);
    done();
  });

  it('Should send message to auction\'s owner after approving it', (done) => {

    auctionApprover
      .approve('572c7066b3f30a0752a5f86d', new Date('2016-08-01T10:00:00.000Z'))
      .then(res => {
        telegram
          .sendMessage
          .calledWith(sinon.match.has('chat_id', 19915021))
          .should.be.true;
        done();
      })
      .catch(err => done(err));

  });


});
