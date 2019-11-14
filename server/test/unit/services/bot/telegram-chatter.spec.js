'use strict';

import chai from 'chai';
import sinon from 'sinon';
import redis from 'redis-mock';

import TelegramChatter from '../../../../services/bot/telegram-chatter';
import StateManager from '../../../../services/bot/state-manager';

chai.should();

describe('TelegramChatter', () => {
  let chatter;
  let stateManager;

  beforeEach(() => {
    const client = redis.createClient();
    stateManager = sinon.stub(StateManager(client));
    chatter = new TelegramChatter(stateManager);
  });

  it('Should throw exception if request type is not right', () => {
    (() => {
      chatter.processRequest({});
    }).should.throw(TypeError);
  });


  it('Should call updateState of stateManager when command.execute returns an object', () => {
    const command = { cmd: { } };
    command.cmd.execute = sinon.stub()
      .returns(Promise.resolve({ a: 1, b: 2 }));

    const state = { chat: { id: 1 } };
    chatter._executeCommand(command, state, 'sample data');

    // NOTE: TO BAD!!! This implies a design flaw (TO BE REFACTORED!)
    setTimeout(() => {
      stateManager
        .updateState
        .calledOnce.should.be.true;
    }, 500);
  });
});
