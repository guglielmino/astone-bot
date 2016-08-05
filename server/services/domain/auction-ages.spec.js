'use strict';

import fs from 'fs';
import chai from 'chai';
import sinon from 'sinon';

import AuctionAges from './auction-ages';


// Tell chai that we'll be using the "should" style assertions.
chai.should();
let expect = chai.expect;

const readFixture = (fixtureName, cb) => {
  fs.readFile(`${__dirname}/fixtures/${fixtureName}`, (err, data) => {
    if (err) throw err;
    const request = JSON.parse(data.toString());
    cb(request);
  });
};


describe('AuctionAges', () => {
  let auctionAges;

  function testMessage(age, awaited, done) {
    readFixture('sample-auction.json', (auction) => {
      auction.bidAge = age;
      const msg = auctionAges.getMessage(auction);

      msg.message.should.be.equal(awaited);

      done();
    });
  }

  beforeEach(()=> {
    auctionAges = AuctionAges();
  });

  it('Should return message for 65s age old auction', (done) => {
    testMessage(65, 'No one offer more than € 28 ?', done);
  });

  it('Should return message for 70s age old auction', (done) => {
    testMessage(70, 'Come on, don\'t be shy, make an offer', done);
  });

  it('Should return message for 90s age old auction', (done) => {
    testMessage(90, '*€ 28* and one', done);
  });

  it('Should return message for 95s age old auction', (done) => {
    testMessage(95, '*€ 28* and two', done);
  });

  it('Should return message for 100s age old auction', (done) => {
    testMessage(100, '*€ 28* and three', done);
  });

  it('Should return message for 103s age old auction', (done) => {
    testMessage(103, '*Commodore 64* sold for *€ 28* to @guglielmino  💰', done);
  });

  it('Should return isLast for 103s age old auction', (done) => {
    readFixture('sample-auction.json', (auction) => {
      auction.bidAge = 103;
      const msg = auctionAges.getMessage(auction);

      msg.isLast.should.be.true;

      done();
    });
  });


});
