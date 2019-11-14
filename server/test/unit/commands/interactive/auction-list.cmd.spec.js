'use strict';

import chai from 'chai';
import sinon from 'sinon';
import { ObjectID } from 'mongodb';
import CommandHelper from '../../../../commands/command-helper';

import AuctionListCommand from '../../../../commands/interactive/auction-list.cmd';

chai.should();
const { expect } = chai;

describe('AuctionListCommand', () => {
  let telegram;
  let managerFactory;
  let auctionManager;
  let commandHelper;

  beforeEach(() => {
    telegram = {};
    auctionManager = {};

    managerFactory = {
      getAuctionManager: () => auctionManager
    };

    telegram.sendMessage = sinon.stub();
    telegram.sendPhoto = sinon.stub();
    telegram.sendChatAction = sinon.stub();
    commandHelper = CommandHelper(telegram);
    commandHelper.simpleResponse = sinon.stub();
  });

  it('Should respond with a message for the active auctions', (done) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    auctionManager.getActiveAuctions = sinon.stub().returns(
      Promise.resolve([
        {
          _id: ObjectID('572cc825de91f5b2bc3c24d8'),
          title: 'Commodore 64',
          description: 'A beautiful Commodore 64!',
          image: 'http://www.oldcomputers.net/pics/C64-left.jpg',
          file_id: '123',
          startDate,
          startingPrice: 10,
          price: 11,
          owner: {
            username: 'guglielmino',
            chatId: 19915021
          },
          subscribers: [
            { username: 'guglielmino' },
            { username: 'tizio' },
            { username: 'caio' }
          ]
        }
      ])
    );

    const command = new AuctionListCommand(telegram, managerFactory, commandHelper, 'http://sampleurl.org');
    command.execute({ chat: { id: 10 } })
      .then((res) => {
        telegram.sendPhoto
          .calledWith(
            sinon.match.has('photo', '123')
          )
          .should.be.ok;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should respond with a message informing there are no active auction with called with empty auction list', (done) => {
    auctionManager.getActiveAuctions = sinon.stub()
      .returns(Promise.resolve([]));

    const command = new AuctionListCommand(telegram, managerFactory, commandHelper, 'http://sampleurl.org');
    command.execute({ chat: { id: 10 } })
      .then((res) => {
        commandHelper
          .simpleResponse
          .calledWith(10, 'Sorry, no active Auctions now')
          .should.be.ok;

        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
