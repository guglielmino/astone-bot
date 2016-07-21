'use strict';

import chai from 'chai';
import sinon from 'sinon';
import {ObjectID} from 'mongodb';
import CommandHelper from '../command-helper';
import * as constants from '../consts';

chai.should();
const expect = chai.expect;

import NewAuctionCommand from './new-auction.cmd';

describe('NewAuctionCommand', () => {
  let telegram;
  let managerFactory;
  let auctionManager;
  let commandHelper;
  let command;

  beforeEach(() => {
    telegram = {};
    auctionManager = {};

    managerFactory = {
      getAuctionManager: () => {
        return auctionManager;
      }
    };

    telegram.sendMessage = sinon.stub();
    commandHelper = sinon.stub(CommandHelper(telegram));
    command = new NewAuctionCommand(telegram, commandHelper);
  });

  it('Should ask for name of the item of the Auction when called', (done) => {
    command.execute({chat: {id: 10}}, [10])
      .then((res) => {
        commandHelper.simpleResponse
          .calledWith(10, 'Ok, write the name of the item that You want to sell')
          .should.be.ok;

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should set state in \'WAITING_FOR_NAME\' when called', (done) => {
    command.execute({chat: {id: 10}}, [10])
      .then((res) => {
        res.state.should.be.equal(constants.STATE_WAIT_FOR_NAME);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
