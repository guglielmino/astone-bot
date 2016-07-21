'use strict';

import chai from 'chai';
import sinon from 'sinon';
import * as constants from '../consts';
import CommandHelper from '../command-helper';
import {ObjectID} from 'mongodb';

chai.should();
const expect = chai.expect;

import AuctionMinSubscribersCommand from './auction-min-sub.cmd';

describe('AuctionMinSubscribersCommand', () => {
  let telegram;
  let managerFactory;
  let auctionManager;
  let commandHelper;
  let command;

  beforeEach(() => {
    telegram = {};
    auctionManager = {
      updateAuction: (data) => {
        return Promise.resolve(true);
      }
    };

    managerFactory = {
      getAuctionManager: () => {
        return auctionManager;
      }
    };

    telegram.sendMessage = sinon.stub();
    telegram.sendChatAction = sinon.stub();
    commandHelper = sinon.stub(CommandHelper(telegram));
    command = new AuctionMinSubscribersCommand(telegram, managerFactory, commandHelper);
  });

  it('Should set state to null if min subscriber is greater or equal 0', (done) => {
    command
      .execute({chat: {id: 10}, state: constants.STATE_WAIT_FOR_MIN_SUB}, 6)
      .then((res) => {
        expect(res.state)
          .to.be.null;
        res.result.should.be.true;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should still STATE_WAIT_FOR_MIN_SUB if min subscriber is lower than 0', (done) => {
    command
      .execute({chat: {id: 10}, state: constants.STATE_WAIT_FOR_MIN_SUB}, -3)
      .then((res) => {
        res.state.should.be.equal(constants.STATE_WAIT_FOR_MIN_SUB);
        res.result.should.be.false;

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

});
