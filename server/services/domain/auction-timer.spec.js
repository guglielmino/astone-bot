'use strict';

import chai from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import AuctionTimer from './auction-timer';
import {ObjectID} from 'mongodb';

// Tell chai that we'll be using the "should" style assertions.
chai.should();
let expect = chai.expect;

describe('AuctionTimer', () => {
	let i18n;

	beforeEach(() => {
		i18n = {};
		i18n.__ = (label) => {
			return label;
		};


	});

	it('Should call _timerFunc every seconds', () => {
		let telegam = {};
		let auctionManager = {};
		auctionManager.getActiveAuctions = sinon.stub().returns(Promise.resolve([]));

		let clock = sinon.useFakeTimers();

		let auctionTimer = new AuctionTimer(telegam, i18n, auctionManager);
		let timerFunc = sinon.stub(auctionTimer, '_timerFunc');

		auctionTimer.start();
		// Fake tick 1sec
		clock.tick(1100);
		clock.restore();
		expect(timerFunc).calledOnce.should.be.ok;
	});

	it('Should call \'_sendMessageToSubscribers\' when Auction is older than 60 seconds', () => {

	});
	
});