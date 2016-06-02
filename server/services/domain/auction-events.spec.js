
'use strict';

import chai from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import {EventEmitter} from 'events';
import {ObjectID} from 'mongodb';
import AuctionEvents from './auction-events';


// Tell chai that we'll be using the "should" style assertions.
chai.should();
let expect = chai.expect;


describe('AuctionEvents', ()=> {

	describe('#onCloseAuction', ()=> {
		let auctionEvent;
		let telegram;
		let auctionManager;
		
		beforeEach(() => {
			telegram = {};
			auctionManager = {};
			let i18n = {};
			let eventEmitter = new EventEmitter();
			
			auctionEvent = new AuctionEvents(telegram, i18n, auctionManager, eventEmitter);
			auctionManager.closeAuction = sinon.stub().returns(Promise.resolve(true));
			telegram.sendMessage = sinon.stub();
		});
		
		it('Should send message to chatId of bestBidder when called', () => {
			
			let auction = {
				_id: ObjectID("572cc825de91f5b2bc3c24d8"),
				title: "Commodore 64",
				description: "A beautiful Commodore 64!",
				image: "http://www.oldcomputers.net/pics/C64-left.jpg",
				startDate: new Date(),
				startingPrice: 10,
				price: 11,
				username: "guglielmino",
				bestBidder: { username: "tizio", chatId: 234},
				subscribers: [
					{username: "guglielmino", chatId: 123 },
					{username: "tizio", chatId: 234},
					{username: "caio", chatId: 567}
				]

			};
			
			auctionEvent.onCloseAuction(auction);
			// NOTE: Design flaw, not easily testable
			setTimeout(() => {
				telegram.sendMessage
					.calledWith(
						sinon.match.has('chat_id', 234))
					.should.be.ok;
			}, 500);

		})


	});
});