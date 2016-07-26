'use strict';

import chai from 'chai';
import sinon from 'sinon';

import AuctionChant from './auction-chant';


// Tell chai that we'll be using the "should" style assertions.
chai.should();
let expect = chai.expect;


describe('AuctionChant', () => {
  let auctionChant;
  let auctionManager;

  it('Should respond to 2 subscribers asking for other bid when last bid is 65 sec old', (done) => {
    auctionManager = {};
    auctionManager.getRunningAuctionsBidAge = sinon.stub()
      .returns(Promise.resolve([
        {
          username: 'guglielmino',
          price: 10,
          bidAge: 65,
          subscribers: [
            { username: 'alpha', chatId: 1234 },
            { username: 'beta', chatId: 5678 }
          ]
        }
      ]));

    const telegram = {};
    telegram.sendMessage = sinon.stub();
    auctionChant = AuctionChant(telegram, auctionManager);

    auctionChant
      .make()
      .then((res) => {
        res.should.be.equal(1);

        telegram.sendMessage
          .should.have.been.calledTwice;


        telegram.sendMessage
          .calledWith(
            sinon.match.has('text', 'No one offer more than € 10 ?')
          )
          .should.be.true;

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should respond to all subscribers asking for a bid when auction age is 70 sec old',
    (done) => {
      auctionManager = {};
      auctionManager.getRunningAuctionsBidAge = sinon.stub()
        .returns(Promise.resolve([
          {
            username: 'guglielmino',
            price: 10,
            bidAge: 70,
            subscribers: [
              { username: 'alpha', chatId: 1234 },
              { username: 'beta', chatId: 5678 }
            ]
          }
        ]));

      const telegram = {};
      telegram.sendMessage = sinon.stub();
      auctionChant = AuctionChant(telegram, auctionManager);

      auctionChant
        .make()
        .then((res) => {
          res.should.be.equal(1);

          telegram.sendMessage
            .should.have.been.calledTwice;


          telegram.sendMessage
            .calledWith(
              sinon.match.has('text', 'Come on, don\'t be shy, make an offer')
            )
            .should.be.true;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

  it('Should respond to all subscribers with first closing warning when auction is 90 sec old',
    (done) => {
      auctionManager = {};
      auctionManager.getRunningAuctionsBidAge = sinon.stub()
        .returns(Promise.resolve([
          {
            username: 'guglielmino',
            price: 10,
            bidAge: 90,
            subscribers: [
              { username: 'alpha', chatId: 1234 },
              { username: 'beta', chatId: 5678 }
            ]
          }
        ]));

      const telegram = {};
      telegram.sendMessage = sinon.stub();
      auctionChant = AuctionChant(telegram, auctionManager);

      auctionChant
        .make()
        .then((res) => {
          res.should.be.equal(1);

          telegram.sendMessage
            .should.have.been.calledTwice;


          telegram.sendMessage
            .calledWith(
              sinon.match.has('text', '*€ 10* and one')
            )
            .should.be.true;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

  it('Should respond to all subscribers with second closing warning when auction is 95 sec old',
    (done) => {
      auctionManager = {};
      auctionManager.getRunningAuctionsBidAge = sinon.stub()
        .returns(Promise.resolve([
          {
            username: 'guglielmino',
            price: 10,
            bidAge: 95,
            subscribers: [
              { username: 'alpha', chatId: 1234 },
              { username: 'beta', chatId: 5678 }
            ]
          }
        ]));

      const telegram = {};
      telegram.sendMessage = sinon.stub();
      auctionChant = AuctionChant(telegram, auctionManager);

      auctionChant
        .make()
        .then((res) => {
          res.should.be.equal(1);

          telegram.sendMessage
            .should.have.been.calledTwice;


          telegram.sendMessage
            .calledWith(
              sinon.match.has('text', '*€ 10* and two')
            )
            .should.be.true;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

  it('Should respond to all subscribers with third closing warning when auction is 100 sec old',
    (done) => {
      auctionManager = {};
      auctionManager.getRunningAuctionsBidAge = sinon.stub()
        .returns(Promise.resolve([
          {
            username: 'guglielmino',
            price: 10,
            bidAge: 100,
            subscribers: [
              { username: 'alpha', chatId: 1234 },
              { username: 'beta', chatId: 5678 }
            ]
          }
        ]));

      const telegram = {};
      telegram.sendMessage = sinon.stub();
      auctionChant = AuctionChant(telegram, auctionManager);

      auctionChant
        .make()
        .then((res) => {
          res.should.be.equal(1);

          telegram.sendMessage
            .should.have.been.calledTwice;


          telegram.sendMessage
            .calledWith(
              sinon.match.has('text', '*€ 10* and three')
            )
            .should.be.true;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });

  it('Should respond to all subscribers with closed message when auction is 103 sec old',
    (done) => {
      auctionManager = {};
      auctionManager.getRunningAuctionsBidAge = sinon.stub()
        .returns(Promise.resolve([
          {
            title: 'A test auction',
            username: 'guglielmino',
            price: 10,
            bidAge: 103,
            subscribers: [
              { username: 'alpha', chatId: 1234 },
              { username: 'beta', chatId: 5678 }
            ],
            bestBidder: {
              username: 'alpha',
              userId: 5678
            }
          }
        ]));

      const telegram = {};
      telegram.sendMessage = sinon.stub();
      auctionChant = AuctionChant(telegram, auctionManager);

      auctionChant
        .make()
        .then((res) => {
          res.should.be.equal(1);

          telegram.sendMessage
            .should.have.been.calledTwice;


          telegram.sendMessage
            .calledWith(
              sinon.match.has('text', `*A test auction* sold for *€ 10* to @alpha  💰`)
            )
            .should.be.true;

          done();
        })
        .catch((err) => {
          done(err);
        });
    });
});
