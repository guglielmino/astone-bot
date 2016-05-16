'use strict';

import chai from 'chai';
import sinon from 'sinon';
import {BidResponse} from '../services/domain/auction-manager';
import {ObjectID} from 'mongodb';

chai.should();
const expect = chai.expect;

import BidCommand from './bid.cmd';

describe('BidCommand', () => {
	let i18n;

	beforeEach(() => {
		i18n = {};
		i18n.__ = (label) => {
			return label;
		};
	});

	it('Should respond asking to select an Auction when trying to bid without selecting one', () => {
		let telegram = {};
		telegram.sendMessage = sinon.stub();

		let auctionManager = {};
		let command = new BidCommand(telegram, i18n, auctionManager);

		command.execute({chat: {id: 10}}, [10]);

		telegram.sendMessage.calledWith({
			chat_id: 10,
			text: 'Before bidding You must choose an active auction',
			parse_mode: 'Markdown'
		}).should.be.ok;

	});

	it('Should respond Auction isn\'t active when trying to bid on a not started one', (done) => {
		let telegram = {};

		let auctionManager = {};
		auctionManager.bid = sinon.stub()
			.returns(Promise.resolve({status: BidResponse.AuctionNotActive}));

		let command = new BidCommand(telegram, i18n, auctionManager);
		sinon.stub(command, 'simpleResponse');

		command.execute({auctionId: "aabbcc", chat: {id: 10}}, [10]);

		// NOTE: command is "fire and forget" and uses a Promise to call simpleResponse
		//       I would be better to check a way to handle this without timer
		setTimeout(function () {
			command.simpleResponse
				.calledWith(10, 'Can\'t bid on this Auction because is inactive')
				.should.be.ok;
			done();
		}, 100);

	});


	it('Should send a message to all subscriber of Acution except the bidder when bid accepted', (done) => {
		let telegram = {};

		let auctionManager = {};
		var startDate = new Date();
		startDate.setDate(startDate.getDate() - 1);
		auctionManager.bid = sinon.stub().returns(Promise.resolve(
			{
				status: BidResponse.Success,
				auction: {
					_id: ObjectID("572cc825de91f5b2bc3c24d8"),
					title: "Commodore 64",
					description: "A beautiful Commodore 64!",
					image: "http://www.oldcomputers.net/pics/C64-left.jpg",
					startDate: startDate,
					startingPrice: 10,
					price: 11,
					username: "guglielmino",
					subscribers: [
						{username: "guglielmino"},
						{username: "tizio"},
						{username: "caio"}
					]
				}
			}));

		let command = new BidCommand(telegram, i18n, auctionManager);
		let mock = sinon.mock(command);
		let expectation = mock.expects('simpleResponse').exactly(3);

		command.execute({auctionId: "aabbcc", chat: {id: 10, username: "guglielmino" }}, [10]);

		setTimeout(function () {
			expectation.verify();
			done();
		}, 100);
	});

	it('Should respond with min number of subscriber requests when bid and there are less than 10 subscribers', (done) => {

		let telegram = {};

		let auctionManager = {};
		var startDate = new Date();
		startDate.setDate(startDate.getDate() - 1);
		auctionManager.bid = sinon.stub().returns(Promise.resolve(
			{
				status: BidResponse.Success,
				auction: {
					_id: ObjectID("572cc825de91f5b2bc3c24d8"),
					title: "Commodore 64",
					description: "A beautiful Commodore 64!",
					image: "http://www.oldcomputers.net/pics/C64-left.jpg",
					startDate: startDate,
					startingPrice: 10,
					price: 11,
					username: "guglielmino",
					subscribers: [
						{username: "guglielmino"},
						{username: "tizio"},
						{username: "caio"}
					]
				}
			}));

		let command = new BidCommand(telegram, i18n, auctionManager);
		let mock = sinon.mock(command);
		let expectation = mock.expects('simpleResponse').exactly(3);

		command.execute({auctionId: "aabbcc", chat: {id: 10, username: "guglielmino" }}, [10]);

		setTimeout(function () {
			expectation.verify();
			done();
		}, 100);
	})

});
