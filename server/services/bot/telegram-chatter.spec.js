'use strict';

import chai from 'chai';
import sinon from 'sinon';

chai.should();

import logger from '../logger';
import TelegramChatter from './telegram-chatter';

describe('TelegramChatter', () => {
	let chatter;
	let loggerStub = sinon.stub(logger);
	beforeEach(() => {

		chatter = new TelegramChatter(loggerStub);
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