'use strict';

import {Enum} from 'enumify';


export class BidResponse extends Enum {
}
;

BidResponse.initEnum([
  'Success',
  'NotAccepted',
  'ValueToLow',
  'AuctionNotActive',
  'CanNotSubscribe',
  'MultipleAuctionSubscribe',
  'AuctionNotExist',
  'InsufficientSubscribers',
  'AuctionClosed'
]);

export class SubscribeResponse extends Enum {
}
;

SubscribeResponse.initEnum([
  'Success',
  'AuctionNotActive',
  'CanNotSubscribe',
  'MultipleAuctionSubscribe',
  'AuctionNotExist'
]);

export default class AuctionManager {

  constructor(auctionProvider) {
    this._auctionProvider = auctionProvider;
  }

  getActiveAuctions(date) {
    return this._auctionProvider
      .getActiveAuctions(date);
  }

  /**
   * Returns a list of auction with at least one bid adding a "bidAge"
   * filed to check last bid age (in seconds).
   * Trigger parameter can be used to filter Auction with bid age less than it
   * @param date - ref date to use for check last bid age
   * @param trigger - trigger (in seconds) under which not return any auction
   * @returns {Promise}
   */
  getRunningAuctionsBidAge(date, trigger) {
    return this._auctionProvider
      .getRunningAuctions()
      .then((res) => {

        const getDiffSeconds = (date, itemDate) => {
          const diff = (date - itemDate);
          return Math.round(Math.floor(diff / 1000));
        };

        return Promise.resolve(res
          .map((x) => {
            x.bidAge = getDiffSeconds(date, x.lastBid);
            return x;
          })
          .filter((x) => x.bidAge >= trigger)
        );
      });
  }

  bid(auctionId, user, value = null) {

    return this._auctionProvider
      .getAuctionById(auctionId)
      .then((auction) => {
        if (!auction || Object.getOwnPropertyNames(auction).length === 0) {
          return Promise.resolve({status: BidResponse.AuctionNotExist, auction: null});
        }

        if (auction.startDate > new Date()) {
          return Promise.resolve({status: BidResponse.AuctionNotActive, auction: auction});
        }

        if (auction.closed) {
          return Promise.resolve({status: BidResponse.AuctionClosed, auction: auction});
        }

        if (value === null) value = (auction.price || auction.startingPrice) + (auction.bidStep || 1.0);

        if (value <= auction.price) {
          return Promise.resolve({status: BidResponse.ValueToLow, auction: auction});
        }

        const numSubscribers = (auction.subscribers ? auction.subscribers.length : 0);
        const minSubscribers = (auction.minSubscribers === undefined ? 10 : auction.minSubscribers);
        if (numSubscribers < minSubscribers) {
          return Promise.resolve({status: BidResponse.InsufficientSubscribers, auction: auction});
        }

        return this._auctionProvider
          .addBid(auctionId, user, value)
          .then((res) => {
            // NOTE: We doesn't get auction again so update values are set explicitly here
            auction.price = value;
            auction.bestBidder = user;
            return Promise.resolve({status: (res ? BidResponse.Success : BidResponse.NotAccepted), auction: auction});
          });
      })
      .catch((err) => {
        return Promise.reject(err);
      });

  }

  subscribe(auctionId, user) {
    return this._auctionProvider
      .getAuctionsBySubscriber(user)
      .then((res) => {
        if (res.length == 0) {
          return this._auctionProvider
            .addSubscriberToAuction(auctionId, user);
        }
        else {
          return Promise.resolve(null);
        }
      })
      .then((auction) => {
        if (auction) {
          if (!auction.closed) {
            return Promise.resolve({status: SubscribeResponse.Success, auction: auction});
          }
          else {
            return Promise.resolve({status: SubscribeResponse.AuctionNotActive, auction: auction});
          }
        } else {
          return Promise.resolve({status: SubscribeResponse.MultipleAuctionSubscribe});
        }
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  unsubscribe(auctionId, user) {
    return this._auctionProvider
      .getAuctionById(auctionId)
      .then((res) => {
        res.subscribers = res.subscribers.filter((x) => user.username !== x.username);
        this._auctionProvider
          .save(res);
      });
  }

  getAuctionById(auctionId) {
    return this._auctionProvider
      .getAuctionById(auctionId);
  }

  closeAuction(auctionId) {
    return this._auctionProvider
      .closeAuction(auctionId);
  }

  createAuction(owner, title) {
    return this._auctionProvider
      .save({ username: owner, title: title });
  }

  updateAuction(auctionId, updateObj) {
    return this._auctionProvider
      .updateAuction(auctionId, updateObj);
  }
}

