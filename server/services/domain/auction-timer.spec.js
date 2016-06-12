'use strict';

import chai from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import AuctionTimer from './auction-timer';
import AuctionManager from './auction-manager';
import {ObjectID} from 'mongodb';

// Tell chai that we'll be using the "should" style assertions.
chai.should();
let expect = chai.expect;

sinon.config = {
  injectIntoThis: false,
  injectInto: null,
  useFakeTimers: true,
  useFakeServer: true
};

describe('AuctionTimer', () => {
  let clock;

  beforeEach(() => {
    const date = new Date();
    clock = sinon.useFakeTimers(date.getDate());
  });

  afterEach(() => {
    clock.restore();
  });

  it('Should call _timerFunc every seconds', () => {
    let telegam = {};
    const auctionManager = new AuctionManager({});
    sinon.stub(auctionManager, 'getActiveAuctions').returns(Promise.resolve([]));
    sinon.stub(auctionManager, 'getRunningAuctionsBidAge').returns(Promise.resolve([]));

    const auctionTimer = new AuctionTimer(telegam, auctionManager);
    auctionTimer._timerFunc = sinon.stub();

    auctionTimer.start();
    // Fake tick 1sec
    clock.tick(1000);

    auctionTimer
      ._timerFunc
      .calledTwice.should.equal.true;
  });

  it('Should close Auction when timer is 103sec from last bid', () => {
    let telegam = {};

    let auctionManager = {};
    auctionManager.closeAuction = sinon.stub();

    auctionManager.getRunningAuctionsBidAge = sinon.stub().returns(Promise.resolve([{
      _id: ObjectID("572cc825de91f5b2bc3c24d8"),
      title: "aaa",
      description: "Csdfdsfdssdori!",
      image: "http://www.oldcomputers.net/pics/C64-left.jpg",
      startDate: Date("2016-06-14T22:00:00.000Z"),
      startingPrice: 10,
      price: 10.2,
      username: 'guglielmino',
      minSubscribers: 3,
      subscribers: [
        { username: 'alpha', chatId: 1234 },
        { username: 'beta', chatId: 5678 }
      ]
    }]));

    let clock = sinon.useFakeTimers();
    let auctionTimer = new AuctionTimer(telegam, auctionManager);

    auctionTimer.start();
    // Fake tick 1sec
    clock.tick(103000);

    auctionManager
      .closeAuction
      .calledOnce.should.be.ok;
  });
});
