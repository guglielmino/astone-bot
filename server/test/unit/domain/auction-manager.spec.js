'use strict';

import chai from 'chai';
import sinon from 'sinon';
import { ObjectID } from 'mongodb';
import { BidResponse, AuctionManager } from '../../../services/domain/auction-manager';


// Tell chai that we'll be using the "should" style assertions.
chai.should();
const { expect } = chai;


describe('AuctionManager', () => {
  it('Should succeed when bid on a existent Auction with a value greater than current price', (done) => {
    const auctionProvider = {};

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);

    auctionProvider.getAuctionById = sinon.stub().returns(Promise.resolve({
      _id: ObjectID('572cc825de91f5b2bc3c24d8'),
      title: 'Commodore 64',
      description: 'A beautiful Commodore 64!',
      image: 'http://www.oldcomputers.net/pics/C64-left.jpg',
      startDate,
      startingPrice: 10,
      owner: {
        username: 'guglielmino',
        chatId: 19915021
      },
      minSubscribers: 0

    }));

    auctionProvider.addBid = sinon.stub().returns(Promise.resolve(true));

    const auctionManager = AuctionManager(auctionProvider);
    auctionManager.bid(ObjectID('572cc825de91f5b2bc3c24d8'), { username: 'guglielmino' }, 10.2)
      .then((res) => {
        res.status.should.be.equal(BidResponse.Success);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should bid with default auction increment when bid without a value', (done) => {
    const auctionProvider = {};

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);

    auctionProvider.getAuctionById = sinon.stub().returns(Promise.resolve({
      _id: ObjectID('572cc825de91f5b2bc3c24d8'),
      title: 'Commodore 64',
      description: 'A beautiful Commodore 64!',
      image: 'http://www.oldcomputers.net/pics/C64-left.jpg',
      startDate,
      startingPrice: 10,
      owner: {
        username: 'guglielmino',
        chatId: 19915021
      },
      bidStep: 2,
      minSubscribers: 0
    }));

    auctionProvider.addBid = sinon.stub().returns(Promise.resolve(true));

    const auctionManager = AuctionManager(auctionProvider);
    auctionManager.bid(ObjectID('572cc825de91f5b2bc3c2123'), { username: 'guglielmino' })
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
    const auctionProvider = {};

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);

    auctionProvider.getAuctionById = auctionProvider.getAuctionById = sinon.stub().returns(Promise.resolve({
      _id: ObjectID('572cc825de91f5b2bc3c24d8'),
      title: 'Commodore 64',
      description: 'A beautiful Commodore 64!',
      image: 'http://www.oldcomputers.net/pics/C64-left.jpg',
      startDate,
      startingPrice: 10,
      owner: {
        username: 'guglielmino',
        chatId: 19915021
      }
    }));

    const auctionManager = AuctionManager(auctionProvider);
    auctionManager.bid(ObjectID('572cc825de91f5b2bc3c24d8'), { username: 'guglielmino' }, 10.2)
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
    const auctionProvider = {};

    auctionProvider.getAuctionById = sinon.stub().returns(Promise.resolve({}));

    const auctionManager = AuctionManager(auctionProvider);
    auctionManager.bid(ObjectID('572cc825de91f5b2bc3c24d8'), { username: 'guglielmino' }, 10.2)
      .then((res) => {
        res.status.should.be.equal(BidResponse.AuctionNotExist);
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });

  it('Should fail when bid called a value less than current Auction\'s value', (done) => {
    const auctionProvider = {};

    auctionProvider.getAuctionById = sinon.stub().returns(Promise.resolve({
      _id: ObjectID('572cc825de91f5b2bc3c24d8'),
      title: 'aaa',
      description: 'Csdfdsfdssdori!',
      image: 'http://www.oldcomputers.net/pics/C64-left.jpg',
      startDate: Date('2016-06-14T22:00:00.000Z'),
      startingPrice: 10,
      price: 10.2,
      owner: {
        username: 'guglielmino',
        chatId: 19915021
      }
    }));


    const auctionManager = AuctionManager(auctionProvider);
    auctionManager.bid(ObjectID('572cc825de91f5b2bc3c24d8'), { username: 'guglielmino' }, 10)
      .then((res) => {
        res.status.should.be.equal(BidResponse.ValueToLow);
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done(err);
      });
  });

  it('Should fail when bid on a Auction with less than 3 subscribers', (done) => {
    const auctionProvider = {};

    auctionProvider.getAuctionById = sinon.stub().returns(Promise.resolve({
      _id: ObjectID('572cc825de91f5b2bc3c24d8'),
      title: 'aaa',
      description: 'Csdfdsfdssdori!',
      image: 'http://www.oldcomputers.net/pics/C64-left.jpg',
      startDate: Date('2016-06-14T22:00:00.000Z'),
      startingPrice: 10,
      price: 10.2,
      owner: {
        username: 'guglielmino',
        chatId: 19915021
      },
      minSubscribers: 3,
      subscribers: [
        { username: 'alpha', chatId: 1234 },
        { username: 'beta', chatId: 5678 }
      ]
    }));

    const auctionManager = AuctionManager(auctionProvider);
    auctionManager.bid(ObjectID('572cc825de91f5b2bc3c24d8'), { username: 'guglielmino' }, 100)
      .then((res) => {
        res.status.should.be.equal(BidResponse.InsufficientSubscribers);
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done(err);
      });
  });

  it('Should fail when bid on a closed Auction', (done) => {
    const auctionProvider = {};

    auctionProvider.getAuctionById = sinon.stub().returns(Promise.resolve({
      _id: ObjectID('572cc825de91f5b2bc3c24d8'),
      title: 'aaa',
      description: 'Csdfdsfdssdori!',
      image: 'http://www.oldcomputers.net/pics/C64-left.jpg',
      startDate: Date('2016-06-14T22:00:00.000Z'),
      startingPrice: 10,
      price: 10.2,
      owner: {
        username: 'guglielmino',
        chatId: 19915021
      },
      minSubscribers: 3,
      subscribers: [
        { username: 'alpha', chatId: 1234 },
        { username: 'beta', chatId: 5678 }
      ],
      closed: true

    }));

    const auctionManager = AuctionManager(auctionProvider);
    auctionManager.bid(ObjectID('572cc825de91f5b2bc3c24d8'), { username: 'guglielmino' }, 100)
      .then((res) => {
        res.status.should.be.equal('AuctionClosed');
        done();
      })
      .catch((err) => {
        console.log(err.message);
        done(err);
      });
  });

  it('Should subscribe user to Auction when called', (done) => {
    const auctionProvider = {};

    auctionProvider.getAuctionsBySubscriber = sinon.stub().returns(Promise.resolve([]));
    auctionProvider.addSubscriberToAuction = sinon.stub().returns(Promise.resolve({
      _id: ObjectID('572cc825de91f5b2bc3c24d8'),
      title: 'aaa',
      description: 'Csdfdsfdssdori!',
      image: 'http://www.oldcomputers.net/pics/C64-left.jpg',
      startDate: Date('2016-06-14T22:00:00.000Z'),
      startingPrice: 10,
      price: 10.2,
      owner: {
        username: 'guglielmino',
        chatId: 19915021
      },
      subscribers: [{ username: 'mimmo', chatId: 12345 }]
    }));
    const auctionManager = AuctionManager(auctionProvider);

    auctionManager.subscribe(ObjectID('572cc825de91f5b2bc3c24d8'), { username: 'mimmo' })
      .then((res) => {
        res.status.should.be.equal('Success');
        res.auction.should.not.be.null;
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });

  it('Should not subscribe an Auction when user is active on another one', (done) => {
    const auctionProvider = {};


    auctionProvider.getAuctionsBySubscriber = sinon.stub().returns(Promise.resolve([{
      _id: ObjectID('572cc825de91f5b2bc3c24d8'),
      title: 'aaa',
      description: 'Csdfdsfdssdori!',
      image: 'http://www.oldcomputers.net/pics/C64-left.jpg',
      startDate: Date('2016-06-14T22:00:00.000Z'),
      startingPrice: 10,
      price: 10.2,
      subscribers: [{ username: 'mimmo', chatId: 1234 }],
      owner: {
        username: 'guglielmino',
        chatId: 19915021
      }
    }]));
    const auctionManager = AuctionManager(auctionProvider);

    auctionManager.subscribe(ObjectID('572cc825de91f5b2bc3c24d8'), { username: 'mimmo' })
      .then((res) => {
        res.status.should.be.equal(BidResponse.MultipleAuctionSubscribe);
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });

  it('Should return a list of Acution ', (done) => {
    const auctionProvider = {};

    const oneMinutesAgo = new Date(); const
      tenSeconsAgo = new Date();
    oneMinutesAgo.setMinutes(oneMinutesAgo.getMinutes() - 1);

    tenSeconsAgo.setSeconds(tenSeconsAgo.getSeconds() - 10);

    auctionProvider.getRunningAuctions = sinon.stub().returns(Promise.resolve([{
      _id: ObjectID('572cc825de91f5b2bc3c24d8'),
      title: 'title1',
      description: 'description1',
      image: 'http://www.nowhere.og/img2.jpg',
      startDate: new Date(),
      startingPrice: 10,
      price: 10.2,
      subscribers: [{ username: 'fake1', chatId: 123 }],
      owner: {
        username: 'auctionusr',
        chatId: 19915021
      },
      lastBid: oneMinutesAgo
    },
    {
      _id: ObjectID('572cc825de91f5b2bc3c18a4'),
      title: 'title2',
      description: 'description2',
      image: 'http://www.nowhere.og/img2.jpg',
      startDate: new Date(),
      startingPrice: 10,
      price: 10.2,
      subscribers: [{ username: 'fake2', chatId: 5678 }],
      owner: {
        username: 'auctionusr',
        chatId: 19915021
      },
      lastBid: tenSeconsAgo
    }]));
    const auctionManager = AuctionManager(auctionProvider);

    auctionManager.getRunningAuctionsBidAge(new Date(), 60)
      .then((res) => {
        res.length.should.be.equal(1);
        expect(res[0].bidAge).to.be.exist;
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });

  it('Should return a list of Acution editable by the user', (done) => {
    const auctionProvider = {};

    auctionProvider.getAuctionsByOwner = sinon.stub().returns(Promise.resolve([
      {
        _id: ObjectID('572cc825de91f5b2bc3c24d8'),
        title: 'title1',
        description: 'description1',
        image: 'http://www.nowhere.og/img2.jpg',
        startDate: new Date(),
        startingPrice: 10,
        price: 10.2,
        subscribers: [{ username: 'fake1', chatId: 123 }],
        owner: {
          username: 'auctionusr',
          chatId: 19915021
        },
        lastBid: new Date()
      },
      {
        _id: ObjectID('572cc825de91f5b2bc3c18a4'),
        title: 'title2',
        description: 'description2',
        image: 'http://www.nowhere.og/img2.jpg',
        startDate: new Date(),
        startingPrice: 10,
        price: 10.2,
        subscribers: [{ username: 'fake2', chatId: 5678 }],
        owner: {
          username: 'auctionusr',
          chatId: 19915021
        }
      }]));

    const auctionManager = AuctionManager(auctionProvider);

    auctionManager.getAuctionsByOwner('auctionusr')
      .then((res) => {
        res.length.should.be.equal(1);
        expect(res[0].lastBid)
          .to.be.undefined;
        done();
      })
      .catch((err) => {
        console.log(err);
        done(err);
      });
  });
});
