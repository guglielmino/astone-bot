'use strict';

import chai from 'chai';
import sinon from 'sinon';
import * as constants from './consts';
import {ObjectID} from 'mongodb';

chai.should();
const expect = chai.expect;

import AuctionListCommand from './auction-list.cmd';

describe('AuctionListCommand', () => {
	let command;
	let telegram;
	let i18n;

	beforeEach(() => {
		i18n = {};
		i18n.__ = (label) => {
			return label;
		};

		telegram = {};
		let auctionManager = {};

		telegram.sendMessage = sinon.stub();
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
		)
		command = new AuctionListCommand(telegram, i18n, auctionManager);
	});

	it('Should returns responds with the active auction whe called', (done) => {

		command.execute({chat: {id: 10}});

		// NOTE: command is "fire and forget" and uses a Promise to call simpleResponse
		//       I would be better to check a way to handle this without timer
		setTimeout(function () {
			telegram.sendMessage.calledWith(
				sinon.match.has('text','*Commodore 64 (from € 10)*\nhttp://www.oldcomputers.net/pics/C64-left.jpg\nA beautiful Commodore 64!\n')).should.be.ok;
			done();
		}, 100);
	});

	it('Should set \'wait_for\' to QCOMMAND_START_AUCTION constant when called', () => {

		let state = {chat: {id: 10}};
		command.execute(state);
		expect(state).property('wait_for');
		state.wait_for.should.be.equal(constants.QCOMMAND_START_AUCTION);
	});

});
