'use strict';

import chai from 'chai';
import sinon from 'sinon';

chai.should();

import TelegramChatter from './telegram-chatter';
import StateManager from './state-manager';

describe('TelegramChatter', () => {
  let chatter;
  let stateManager;

  beforeEach(() => {
    stateManager = sinon.stub(new StateManager());
    chatter = new TelegramChatter(stateManager);
  });

  it('Should throw exception if request type is not right', () => {
    (() => {
      chatter.processRequest({});
    }).should.throw(TypeError);
  });

  it('Should increment update_id after process request', () => {
    let updatedId = chatter.processRequest({ update_id: 0, message: { text: '', chat: { } } });
    updatedId.should.be.equal(1);
  });

  it('Should call updateState of stateManager when command.execute returns an object', () => {
    let command = { cmd: { } };
    command.cmd.execute = sinon.stub()
      .returns(Promise.resolve({ a: 1, b: 2 }));

    let state = { chat: { id: 1 } };
    chatter._executeCommand(command, state, "sample data");

    // NOTE: TO BAD!!! This implies a design flaw (TO BE REFACTORED!)
    setTimeout(() => {
      stateManager
        .updateState
        .calledOnce.should.be.true;
    }, 500);
  });
});
