'use strict';

import chai from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import AuctionManager from './auction-manager';
import {BidResponse} from './auction-manager';
import {ObjectID} from 'mongodb';

// Tell chai that we'll be using the "should" style assertions.
chai.should();
let expect = chai.expect;


describe('AuctionManager', ()=> {


	it('Should succeed when bid on a existent Auction with a value greater than current price', (done) => {
		let auctionProvider = {};

		var startDate = new Date();
		startDate.setDate(startDate.getDate() - 1);

		auctionProvider.getAuctionById = sinon.stub().returns(Promise.resolve({
			_id: ObjectID("572cc825de91f5b2bc3c24d8"),
			title: "Commodore 64",
			description: "A beautiful Commodore 64!",
			image: "http://www.oldcomputers.net/pics/C64-left.jpg",
			startDate: startDate,
			startingPrice: 10,
			username: "guglielmino"
		}));

		auctionProvider.addBid = sinon.stub().returns(Promise.resolve(true));

		const auctionManager = new AuctionManager(auctionProvider);
		auctionManager.bid(ObjectID("572cc825de91f5b2bc3c24d8"), {username: 'guglielmino'}, 10.2)
			.then((res) => {
				res.status.should.be.equal(BidResponse.Success);
				done();
			});
	});

	it('Should fail when bid called on not already started Auction', (done) => {
		let auctionProvider = {};

		var startDate = new Date();
		startDate.setDate(startDate.getDate() + 1);

		auctionProvider.getAuctionById = auctionProvider.getAuctionById = sinon.stub().returns(Promise.resolve({
			_id: ObjectID("572cc825de91f5b2bc3c24d8"),
			title: "Commodore 64",
			description: "A beautiful Commodore 64!",
			image: "http://www.oldcomputers.net/pics/C64-left.jpg",
			startDate: startDate,
			startingPrice: 10,
			username: "guglielmino"
		}));

		const auctionManager = new AuctionManager(auctionProvider);
		auctionManager.bid(ObjectID("572cc825de91f5b2bc3c24d8"), {username: 'guglielmino'}, 10.2)
			.then((res) => {
				res.status.should.be.equal(BidResponse.AuctionNotActive);
				done();
			})
			.catch((err) => {
				console.log(err);
				done(err);
			});
	});

	it('Should fail when bid called on a inexistent Auction', (done) => {
		let auctionProvider = {};

		auctionProvider.getAuctionById = sinon.stub().returns(Promise.resolve({}));

		const auctionManager = new AuctionManager(auctionProvider);
		auctionManager.bid(ObjectID("572cc825de91f5b2bc3c24d8"), {username: 'guglielmino'}, 10.2)
			.then((res) => {
				res.status.name.should.be.equal('AuctionNotExist');
				done();
			})
			.catch((err) => {
				console.log(err);
				done(err);
			});
	});

	it('Should fail when bid called a value less than current Auction\'s value', (done) => {
		let auctionProvider = {};

		auctionProvider.getAuctionById = sinon.stub().returns(Promise.resolve({
			_id: ObjectID("572cc825de91f5b2bc3c24d8"),
			title: "aaa",
			description: "Csdfdsfdssdori!",
			image: "http://www.oldcomputers.net/pics/C64-left.jpg",
			startDate: Date("2016-06-14T22:00:00.000Z"),
			startingPrice: 10,
			price: 10.2,
			username: "guglielmino"
		}));


		const auctionManager = new AuctionManager(auctionProvider);
		auctionManager.bid(ObjectID("572cc825de91f5b2bc3c24d8"), {username: 'guglielmino'}, 10)
			.then((res) => {
				res.status.name.should.be.equal('ValueToLow');
				done();
			});
	});

	it('Should add user to subscriber when subscribe called', (done)=> {
		let auctionProvider = {};

		auctionProvider.getAuctionsBySubscriber = sinon.stub().returns(Promise.resolve([]));
		auctionProvider.addSubscriberToAuction = sinon.stub().returns(Promise.resolve(true));
		const auctionManager = new AuctionManager(auctionProvider);

		auctionManager.subscribe(ObjectID("572cc825de91f5b2bc3c24d8"), {username: 'mimmo'})
			.then((res) => {
				res.status.name.should.be.equal('Success');
				done();
			})
			.catch((err) => {
				console.log(err);
				done(err);
			});
	});

	it('Should not subscribe an Auction when user is active on another one', (done) => {
		let auctionProvider = {};

		auctionProvider.getAuctionsBySubscriber = sinon.stub().returns(Promise.resolve([{
			_id: ObjectID("572cc825de91f5b2bc3c24d8"),
			title: "aaa",
			description: "Csdfdsfdssdori!",
			image: "http://www.oldcomputers.net/pics/C64-left.jpg",
			startDate: Date("2016-06-14T22:00:00.000Z"),
			startingPrice: 10,
			price: 10.2,
			subscribers: [{username: "mimmo"}],
			username: "guglielmino"
		}]));
		const auctionManager = new AuctionManager(auctionProvider);

		auctionManager.subscribe(ObjectID("572cc825de91f5b2bc3c24d8"), {username: 'mimmo'})
			.then((res) => {
				res.status.name.should.be.equal('MultipleAuctionSubscribe');
				done();
			})
			.catch((err) => {
				console.log(err);
				done(err);
			});
	});

});
