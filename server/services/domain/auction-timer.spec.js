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
 	let auctionTimer;
	let i18n;

	beforeEach(() => {
		i18n = {};
		i18n.__ = (label) => {
			return label;
		};

		let telegam = {};
		let auctionManager = {};
		auctionManager.getActiveAuctions = sinon.stub().returns(Promise.resolve([]));
		
		auctionTimer = new AuctionTimer(telegam, i18n, auctionManager);
	});

	it('Should call _timerFunc every seconds', () => {
		let clock = sinon.useFakeTimers();
		let stub  = sinon.stub(auctionTimer, '_timerFunc');

		auctionTimer.start();
		// Fake tick 1sec
		clock.tick(1000);
		stub.should.be.calledOnce;
	});
});