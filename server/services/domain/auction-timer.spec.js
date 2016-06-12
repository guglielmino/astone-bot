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
    const auctionChant = {};
    const eventEmitter = {};

    const auctionTimer = new AuctionTimer(auctionChant, eventEmitter);
    auctionTimer._timerFunc = sinon.stub();

    auctionTimer.start();
    // Fake tick 1sec
    clock.tick(1000);

    auctionTimer
      ._timerFunc
      .calledTwice.should.equal.true;
  });
  
});
