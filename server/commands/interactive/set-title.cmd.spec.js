'use strict';

import chai from 'chai';
import sinon from 'sinon';
import {ObjectID} from 'mongodb';
import CommandHelper from '../command-helper';
import * as constants from '../consts';

chai.should();
const expect = chai.expect;

import SetTitleCommand from './set-title.cmd';

describe('SetTitleCommand', () => {

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
    command = new SetTitleCommand(telegram, managerFactory, commandHelper);
  });

  it('Should respons with a message and a list of buttons for each auction returned by the manager', (done) => {
    auctionManager.getAuctionsByOwner = sinon.stub()
      .returns(Promise.resolve([
        {
          _id: ObjectID("572cc825de91f5b2bc3c24d8"),
          title: "Commodore 64",
          description: "A beautiful Commodore 64!",
          image: "http://www.oldcomputers.net/pics/C64-left.jpg",
          startingPrice: 10,
          price: 11,
          username: "guglielmino"
        }
      ]));

    command.execute({chat: {id: 10, username: 'guglielmino'}})
      .then((res) => {

        telegram.sendMessage
          .calledWith(
            sinon.match(value =>{ 
              return value.reply_markup.inline_keyboard.length === 1;
            }))
          .should.be.ok;

        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
