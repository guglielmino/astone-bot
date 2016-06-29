'use strict';

import chai from 'chai';
import sinon from 'sinon';
import * as constants from '../consts';
import CommandHelper from '../command-helper';
import {ObjectID} from 'mongodb';

chai.should();
const expect = chai.expect;

import AuctionNameCommand from './auction-name.cmd';

describe('AuctionNameCommand', () => {
  let telegram;
  let managerFactory;
  let auctionManager;
  let commandHelper;
  let command;

  beforeEach(() => {
    telegram = {};
    auctionManager = {
      createAuction: (title) => {
        return Promise.resolve(ObjectID());
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
    command = new AuctionNameCommand(telegram, managerFactory, commandHelper);
  });

  it('Should remove current state when succeed', (done) => {
    command
      .execute({chat: {id: 10}, state: constants.STATE_WAIT_FOR_NAME}, "Auction title")
      .then((res) => {
        res.state.should.be.equal(constants.STATE_WAIT_FOR_PRICE);
        res.auctionId.should.not.be.null;

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

});
