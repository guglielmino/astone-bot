import chai from 'chai';
import sinon from 'sinon';

import CommandHelper from '../../../../commands/command-helper';
import StartAuctionCommand from '../../../../commands/callbackquery/start-auction.cmd';

// Tell chai that we'll be using the "should" style assertions.
chai.should();

describe('StartAuctionCommand', () => {
  let telegram;
  let auctionManager;
  let managerFactory;
  let commandHelper;

  beforeEach(() => {
    telegram = {};

    auctionManager = {};

    managerFactory = {
      getAuctionManager: () => auctionManager
    };

    telegram.sendMessage = sinon.stub();
    telegram.answerCallbackQuery = sinon.stub();

    commandHelper = sinon.stub(CommandHelper(telegram));
  });

  it('Should call _makeTelegramAnswer when subscription succeeds', (done) => {
    const auction = require('./fixtures/subscribing-auction.json');

    auctionManager.subscribe = sinon.stub()
      .returns(Promise.resolve({ auction, status:  'Success' }));

    const command = new StartAuctionCommand(telegram, managerFactory, commandHelper);
    command._makeTelegramAnswer = sinon.stub();
    command
      .execute(
        {
          callback_query_id: 100,
          chat: {
            id: 10,
            owner: { username: 'guglielmino', chatId: 2333030 }
          }
        }, '572c7066b3f30a0752a5f86d'
      )
      .then((res) => {
        res.auctionId.should.be.equal('572c7066b3f30a0752a5f86d');

        command
          ._makeTelegramAnswer
          .calledOnce
          .should.be.ok;

        done();
      })
      .catch((err) => {
        done(err);
      });
  });


  it('Should respond with \'Sorry, this auction isn\'t active You can\'t start bidding on it.\' when Auction is closes', (done) => {
    auctionManager.subscribe = sinon.stub()
      .returns(Promise.resolve({ status:  'AuctionNotActive' }));

    const command = new StartAuctionCommand(telegram, managerFactory, commandHelper);
    command.execute({
      callback_query_id: 100,
      chat: { id: 10, owner: { username: 'guglielmino', chatId: 2333030 } }
    }, 123)
      .then((res) => {
        telegram
          .sendMessage
          .calledWith(sinon.match.has('text', 'Sorry, this auction isn\'t active You can\'t start bidding on it.'))
          .should.be.ok;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should send a message to all subscriber but the one subscribing', (done) => {
    const auction = require('./fixtures/subscribing-auction.json');
    auctionManager.subscribe = sinon.stub()
      .returns(Promise.resolve({ auction, status:  'Success' }));

    const command = new StartAuctionCommand(telegram, managerFactory, commandHelper);
    command._warnSubscribers = sinon.stub();
    command.execute(
      {
        callback_query_id: 100,
        chat: {
          id: 10,
          owner: { username: 'guglielmino', chatId: 2333030 }
        }
      }, 123
    )
      .then((res) => {
        command
          ._warnSubscribers
          .calledOnce
          .should.be.ok;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
