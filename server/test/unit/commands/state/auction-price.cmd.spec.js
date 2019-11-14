'use strict';

import chai from 'chai';
import sinon from 'sinon';
import { ObjectID } from 'mongodb';
import * as constants from '../../../../commands/consts';
import CommandHelper from '../../../../commands/command-helper';

import AuctionPriceCommand from '../../../../commands/state/auction-price.cmd';

chai.should();
const { expect } = chai;

describe('AuctionPriceCommand', () => {
  let telegram;
  let managerFactory;
  let auctionManager;
  let commandHelper;
  let command;

  beforeEach(() => {
    telegram = {};
    auctionManager = {
      updateAuction: (data) => Promise.resolve(true)
    };

    managerFactory = {
      getAuctionManager: () => auctionManager
    };

    telegram.sendMessage = sinon.stub();
    telegram.sendChatAction = sinon.stub();
    commandHelper = sinon.stub(CommandHelper(telegram));
    command = new AuctionPriceCommand(telegram, managerFactory, commandHelper);
  });

  it('Should respond with result false and maintain STATE_WAIT_FOR_PRICE when price is lower than 0', (done) => {
    command
      .execute({ chat: { id: 10 }, state: constants.STATE_WAIT_FOR_PRICE }, '-1')
      .then((res) => {
        res.state.should.be.equal(constants.STATE_WAIT_FOR_PRICE);
        res.result.should.be.false;

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should respond with result false and maintain STATE_WAIT_FOR_PRICE when price isn\'t numeric', (done) => {
    command
      .execute({ chat: { id: 10 }, state: constants.STATE_WAIT_FOR_PRICE }, '-1')
      .then((res) => {
        res.state.should.be.equal(constants.STATE_WAIT_FOR_PRICE);
        res.result.should.be.false;

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should respond with result true when price is number greather than 0', (done) => {
    command
      .execute({ chat: { id: 10 }, state: constants.STATE_WAIT_FOR_PRICE }, '10.7')
      .then((res) => {
        res.result.should.be.true;
        res.state.should.be.equal(constants.STATE_WAIT_FOR_PICTURE);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should set status to null when state.single is true', (done) => {
    command
      .execute({ chat: { id: 10 }, state: constants.STATE_WAIT_FOR_PRICE, single: true }, '10.7')
      .then((res) => {
        res.result.should.be.true;
        expect(res.state).to.be.null;
        res.single.should.be.false;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
