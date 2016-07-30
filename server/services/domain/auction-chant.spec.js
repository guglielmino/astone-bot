'use strict';

import fs from 'fs';
import chai from 'chai';
import sinon from 'sinon';

import AuctionChant from './auction-chant';


// Tell chai that we'll be using the "should" style assertions.
chai.should();
let expect = chai.expect;


describe('AuctionChant', () => {
  let auctionChant;
  let auctionManager;
  let auctionAges;

  beforeEach(() => {
    auctionAges = {
      getMessage: function(){
        return {message: "Sample", isLast: false}
      }
    };
    const data = fs.readFileSync(`${__dirname}/fixtures/auction-list.json`);
    const auctionList = JSON.parse(data.toString());

    const telegram = {};
    telegram.sendMessage = sinon.stub();

    auctionManager = {};
    auctionManager.getRunningAuctionsBidAge = sinon.stub()
      .returns(Promise.resolve(auctionList));

    auctionChant = AuctionChant(telegram, auctionManager, auctionAges);
  });

  it('Should respond with num of handled auctions', (done) => {

    auctionChant
      .make(new Date("2016-07-17T06:11:00.007Z"))
      .then((res) => {
        res.should.be.equal(2);
        done();
      });
  });


});
