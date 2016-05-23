'use strict';

import chai from 'chai';
import sinon from 'sinon';

chai.should();

import logger from '../logger';
import TelegramChatter from './telegram-chatter';
import StateManager from './state-manager';

describe('TelegramChatter', () => {
	let chatter;
	let loggerStub = sinon.stub(logger);
	beforeEach(() => {

		let stateManager = new StateManager();
		let mock = sinon.stub(stateManager);
		chatter = new TelegramChatter(loggerStub, mock);
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

});