'use strict';

import chai from 'chai';
import sinon from 'sinon';

import SubscribeCommand from './start-auction.cmd.js';

describe('StartAuctionCommand', () => {
	let i18n;

	beforeEach(() => {
		i18n = {};
		i18n.__ = (label) => { return label; };
	});

	it('Should set \'inline_keyboard\' in sendMessage with encode value and command', () => {
		false.should.be.ok;
	});


	it('Should create a reminder when selected auction isn\'t started', () => {
		false.should.be.ok;
	});
	
	it('Should set selected auctionId in state when called', () => {
		false.should.be.ok;
	});
	
});
