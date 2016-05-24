'use strict';

import chai from 'chai';
import sinon from 'sinon';

chai.should();
const expect = chai.expect;

import logger from '../logger';
import TelegramChatter from './telegram-chatter';
import StateManager from './state-manager';

describe('TelegramChatter', () => {
	let chatter;
	let loggerStub = sinon.stub(logger);
	let mockStateManager;

	beforeEach(() => {

		let stateManager = new StateManager();
		mockStateManager = sinon.stub(stateManager);
		chatter = new TelegramChatter(loggerStub, mockStateManager);
	});
	
	it('Should throw exception if request type is not right', () => {
		(() => {
			chatter.processRequest({})
		}).should.throw(TypeError);
	});

	it('Should increment update_id after process request', () => {
		let updatedId = chatter.processRequest({ update_id: 0, message: {text: '', chat: {} } });
		updatedId.should.be.equal(1);
	});

	it('Should call updateState of stateManager when command.execute returns an object', () => {
		let command = { cmd: {} };
		command.cmd.execute = sinon.stub().returns({ a:1, b: 2});
		
		let state = { id: 1};
		chatter._executeCommand(command, state, "sample data");
		mockStateManager.updateState.calledOnce.should.be.true;

	});
	
});