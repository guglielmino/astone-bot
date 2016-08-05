'use strict';

import chai from 'chai';
import sinon from 'sinon';
import CommandHelper from '../../../../commands/command-helper';
import {ObjectID} from 'mongodb';

chai.should();
const expect = chai.expect;

import AuctionListCommand from '../../../../commands/interactive/auction-list.cmd';

describe('AuctionListCommand', () => {
	let telegram;
	let managerFactory;
	let auctionManager;
	let commandHelper;


	beforeEach(() => {
		telegram = {};
		auctionManager = {};

		managerFactory = {
			getAuctionManager: () => {
				return auctionManager;
			}
		};

		telegram.sendMessage = sinon.stub();
		telegram.sendChatAction = sinon.stub();
		commandHelper = sinon.stub(CommandHelper(telegram));
	});

	it('Should respond with a message for the active auctions', (done) => {

		var startDate = new Date();
		startDate.setDate(startDate.getDate() - 1);
		auctionManager.getActiveAuctions = sinon.stub().returns(
			Promise.resolve([
				{
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
			])
		);

		const command = new AuctionListCommand(telegram, managerFactory, commandHelper);
		command.execute({chat: {id: 10}})
			.then((res) => {

				telegram.sendMessage
					.calledWith(
						sinon.match.has('text', '*Commodore 64 (price € 11)*\nA beautiful Commodore 64!'))
					.should.be.ok;
				done();
			})
			.catch((err) => {
				done(err);
			});
	});

	it('Should respond with a message informing there are no active auction with called with empty auction list', (done)=> {
		auctionManager.getActiveAuctions = sinon.stub()
			.returns(Promise.resolve([]));

		const command = new AuctionListCommand(telegram, managerFactory, commandHelper);
		command.execute({chat: {id: 10}})
			.then((res) => {

				commandHelper
					.simpleResponse
					.calledWith(10, 'Sorry, no Auctions active now')
					.should.be.ok;

				done();
			})
			.catch((err) => {
				done(err);
			});
	});
});
