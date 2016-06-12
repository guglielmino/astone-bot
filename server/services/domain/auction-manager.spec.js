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


describe('AuctionManager', () => {

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
      username: "guglielmino",
      minSubscribers: 0

    }));

    auctionProvider.addBid = sinon.stub().returns(Promise.resolve(true));

    const auctionManager = new AuctionManager(auctionProvider);
    auctionManager.bid(ObjectID("572cc825de91f5b2bc3c24d8"), {username: 'guglielmino'}, 10.2)
      .then((res) => {
        res.status.should.be.equal(BidResponse.Success);
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done(err);
      });
  });

  it('Should bid with default auction increment when bid without a value', (done) => {
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
      username: "guglielmino",
      bidStep: 2,
      minSubscribers: 0
    }));

    auctionProvider.addBid = sinon.stub().returns(Promise.resolve(true));

    const auctionManager = new AuctionManager(auctionProvider);
    auctionManager.bid(ObjectID("572cc825de91f5b2bc3c2123"), {username: 'guglielmino'})
      .then((res) => {
        res.status.should.be.equal(BidResponse.Success);
        res.auction.price.should.be.equal(12);
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done(err);
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
      })
      .catch((err) => {
        console.log(err.message);
        done(err);
      });
  });

  it('Should fail when bid on a Auction with less than 3 subscribers', (done) => {
    let auctionProvider = {};

    auctionProvider.getAuctionById = sinon.stub().returns(Promise.resolve({
      _id: ObjectID("572cc825de91f5b2bc3c24d8"),
      title: "aaa",
      description: "Csdfdsfdssdori!",
      image: "http://www.oldcomputers.net/pics/C64-left.jpg",
      startDate: Date("2016-06-14T22:00:00.000Z"),
      startingPrice: 10,
      price: 10.2,
      username: "guglielmino",
      minSubscribers: 3,
      subscribers: [
        {username: "alpha", chatId: 1234},
        {username: "beta", chatId: 5678}
      ]
    }));

    const auctionManager = new AuctionManager(auctionProvider);
    auctionManager.bid(ObjectID("572cc825de91f5b2bc3c24d8"), {username: 'guglielmino'}, 100)
      .then((res) => {
        res.status.name.should.be.equal('InsufficientSubscribers');
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done(err);
      })

  });

  it('Should fail when bid on a closed Auction', (done) => {
    let auctionProvider = {};

    auctionProvider.getAuctionById = sinon.stub().returns(Promise.resolve({
      _id: ObjectID("572cc825de91f5b2bc3c24d8"),
      title: "aaa",
      description: "Csdfdsfdssdori!",
      image: "http://www.oldcomputers.net/pics/C64-left.jpg",
      startDate: Date("2016-06-14T22:00:00.000Z"),
      startingPrice: 10,
      price: 10.2,
      username: "guglielmino",
      minSubscribers: 3,
      subscribers: [
        {username: "alpha", chatId: 1234},
        {username: "beta", chatId: 5678}
      ],
      closed: true

    }));

    const auctionManager = new AuctionManager(auctionProvider);
    auctionManager.bid(ObjectID("572cc825de91f5b2bc3c24d8"), {username: 'guglielmino'}, 100)
      .then((res) => {
        res.status.name.should.be.equal('AuctionClosed');
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done(err);
      })
  });

  it('Should subscribe user to Auction when called', (done)=> {
    let auctionProvider = {};

    auctionProvider.getAuctionsBySubscriber = sinon.stub().returns(Promise.resolve([]));
    auctionProvider.addSubscriberToAuction = sinon.stub().returns(Promise.resolve({
      _id: ObjectID("572cc825de91f5b2bc3c24d8"),
      title: "aaa",
      description: "Csdfdsfdssdori!",
      image: "http://www.oldcomputers.net/pics/C64-left.jpg",
      startDate: Date("2016-06-14T22:00:00.000Z"),
      startingPrice: 10,
      price: 10.2,
      username: "guglielmino",
      subscribers: [{username: "mimmo", chatId: 12345}]
    }));
    const auctionManager = new AuctionManager(auctionProvider);

    auctionManager.subscribe(ObjectID("572cc825de91f5b2bc3c24d8"), {username: 'mimmo'})
      .then((res) => {
        res.status.name.should.be.equal('Success');
        res.auction.should.not.be.null;
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
      subscribers: [{username: "mimmo", chatId: 1234}],
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

  it('Should return a list of Acution ', (done) => {
    let auctionProvider = {};

    let oneMinutesAgo = new Date(), tenSeconsAgo = new Date();
    oneMinutesAgo.setMinutes(oneMinutesAgo.getMinutes() - 1);

    tenSeconsAgo.setSeconds(tenSeconsAgo.getSeconds() - 10);

    auctionProvider.getRunningAuctions = sinon.stub().returns(Promise.resolve([{
      _id: ObjectID("572cc825de91f5b2bc3c24d8"),
      title: "title1",
      description: "description1",
      image: "http://www.nowhere.og/img2.jpg",
      startDate: new Date(),
      startingPrice: 10,
      price: 10.2,
      subscribers: [{username: "fake1", chatId: 123}],
      username: "auctionusr",
      lastBid: oneMinutesAgo
    },
      {
        _id: ObjectID("572cc825de91f5b2bc3c18a4"),
        title: "title2",
        description: "description2",
        image: "http://www.nowhere.og/img2.jpg",
        startDate: new Date(),
        startingPrice: 10,
        price: 10.2,
        subscribers: [{username: "fake2", chatId: 5678}],
        username: "auctionusr",
        lastBid: tenSeconsAgo
      }]));
    const auctionManager = new AuctionManager(auctionProvider);

    auctionManager.getRunningAuctionsBidAge(new Date(), 60)
      .then((res) => {
        res.length.should.be.equal(1);
        res[0].bidAge.should.exists;

        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });


});
