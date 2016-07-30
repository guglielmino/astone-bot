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
    auctionAges = { };

    const data = fs.readFileSync(`${__dirname}/fixtures/auction-list.json`);
    const auctionList = JSON.parse(data.toString());

    const telegram = {};
    telegram.sendMessage = sinon.stub();

    auctionManager = {
      closeAuction: sinon.stub(),
      getRunningAuctionsBidAge: sinon.stub()
        .returns(Promise.resolve(auctionList))
    };


    auctionChant = AuctionChant(telegram, auctionManager, auctionAges);
  });


  it('Should respond with num of handled auctions', (done) => {

    auctionAges.getMessage = sinon.stub()
      .returns({message: "Sample", isLast: false});

    auctionChant
      .make(new Date("2016-07-17T06:11:00.007Z"))
      .then((res) => {
        res.should.be.equal(2);
        done();
      });
  });

  it('Should call closeAuction when auction receive last chant', (done) => {
    auctionAges.getMessage = sinon.stub()
      .returns({message: "Sample", isLast: true});

    auctionChant
      .make(new Date("2016-07-17T06:11:00.007Z"))
      .then((res) => {

        res.should.be.equal(2);
        auctionManager.closeAuction
          .calledOnce.should.be.true;

        done();
      })
      .catch(err => done(err));
  });


});
