'use strict';

import chai from 'chai';
import sinon from 'sinon';
import { ObjectID } from 'mongodb';
import CommandHelper from '../../../../commands/command-helper';
import * as constants from '../../../../commands/consts';

import SetTitleCommand from '../../../../commands/interactive/set-auction-property.cmd';

chai.should();
const { expect } = chai;

describe('SetAuctionPropertyCommand', () => {
  let telegram;
  let managerFactory;
  let auctionManager;
  let commandHelper;
  let command;

  beforeEach(() => {
    telegram = {};
    auctionManager = {};

    managerFactory = {
      getAuctionManager: () => auctionManager
    };

    telegram.sendMessage = sinon.stub();
    commandHelper = sinon.stub(CommandHelper(telegram));
    command = new SetTitleCommand(telegram, managerFactory, commandHelper, { queryCommand: constants.QCOMMAND_SET_DESCR, answerText: 'Choose an auction to change the description' });
  });

  it('Should respond with a list of buttons for each auction returned by the manager and right text', (done) => {
    auctionManager.getAuctionsByOwner = sinon.stub()
      .returns(Promise.resolve([
        {
          _id: ObjectID('572cc825de91f5b2bc3c24d8'),
          title: 'Commodore 64',
          description: 'A beautiful Commodore 64!',
          image: 'http://www.oldcomputers.net/pics/C64-left.jpg',
          startingPrice: 10,
          price: 11,
          owner: {
            username: 'guglielmino',
            chatId: 19915021
          }
        }
      ]));

    command.execute({ chat: { id: 10, username: 'guglielmino' } })
      .then((res) => {
        telegram.sendMessage
          .calledWith(
            sinon.match((value) => value.reply_markup.inline_keyboard.length === 1 && value.text === 'Choose an auction to change the description')
          )
          .should.be.ok;

        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
