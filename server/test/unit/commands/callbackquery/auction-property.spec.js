'use strict';

import chai from 'chai';
import sinon from 'sinon';

import CommandHelper from '../../../../commands/command-helper';
import AuctionPropertyCommand from '../../../../commands/callbackquery/auction-property';

import * as constants from '../../../../commands/consts';


describe('AuctionPropertyCommand', () => {
  let telegram;
  let auctionManager;
  let managerFactory;
  let commandHelper;

  beforeEach(() => {
    telegram = {};
    auctionManager = {};

    managerFactory = {
      getAuctionManager: () =>{
        return auctionManager;
      }
    };

    telegram.sendMessage = sinon.stub();
    telegram.answerCallbackQuery = sinon.stub();

    commandHelper = sinon.stub(CommandHelper(telegram));
  });

  it('Should respond state and text passed in propertyInfo', () => {

    const command = new AuctionPropertyCommand(telegram, managerFactory, commandHelper, {
      answerText: 'Give me the description for the auction',
      stateCommand: constants.STATE_WAIT_FOR_DESC
    });
    command.execute({callback_query_id: 100, chat: {id: 10}}, 123)
      .then((res) => {
        res.state.should.be.equal(constants.STATE_WAIT_FOR_DESC);

        command.simpleResponse
          .calledWith(10, 'Give me the description for the auction')
          .should.be.ok;

        done();
      })
      .catch((err) => {
        done(err);
      });
  });


});
