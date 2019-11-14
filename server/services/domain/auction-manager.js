import * as consts from './auction-consts';


export const BidResponse = {
  Success: 'Success',
  NotAccepted: 'NotAccepted',
  ValueToLow: 'ValueToLow',
  AuctionNotActive: 'AuctionNotActive',
  CanNotSubscribe: 'CanNotSubscribe',
  MultipleAuctionSubscribe: 'MultipleAuctionSubscribe',
  AuctionNotExist: 'AuctionNotExist',
  InsufficientSubscribers: 'InsufficientSubscribers',
  AuctionClosed: 'AuctionClosed'
};

export const SubscribeResponse = {
  Success: 'Success',
  AuctionNotActive: 'AuctionNotActive',
  CanNotSubscribe: 'CanNotSubscribe',
  MultipleAuctionSubscribe: 'MultipleAuctionSubscribe',
  AuctionNotExist: 'AuctionNotExist'
};

export class AuctionManager {
  constructor(auctionProvider) {
    this._auctionProvider = auctionProvider;
  }

  /**
   * Get all auctions not closed and with a start date lower than 'date'
   * parameter
   * @param date
   * @returns {*|Promise}
   */
  getActiveAuctions(date) {
    return this._auctionProvider
      .getActiveAuctions(date);
  }

  getNewAuctions() {
    return this._auctionProvider
      .getNewAuctions();
  }


  /**
   * Get all auction for a specific owner
   * @param username
   */
  getAuctionsByOwner(username) {
    return this._auctionProvider
      .getAuctionsByOwner(username)
      .then((auctions) => auctions.filter((a) => !a.lastBid));
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
          .filter((x) => x.bidAge >= trigger));
      });
  }

  /**
   * Returns all closed auction in state WAIT_FOR_PAYMENT
   * @param date
   */
  getClosedAndWaitingForPayment(date) {
    return this._auctionProvider
      .getClosedInState(date, consts.AUCTION_STATE_WAIT_FOR_PAYMENT);
  }

  getStarting(date, minutes) {
    return this._auctionProvider
      .getStarting(date, minutes);
  }

  /**
   * Make a bid on a auction
   * @param auctionId
   * @param user
   * @returns {Promise.<T>}
   */
  bid(auctionId, user, value = null) {
    return this._auctionProvider
      .getAuctionById(auctionId)
      .then((auction) => {
        if (!auction || Object.getOwnPropertyNames(auction).length === 0) {
          return Promise.resolve({ status: BidResponse.AuctionNotExist, auction: null });
        }

        if (auction.startDate > new Date()) {
          return Promise.resolve({ status: BidResponse.AuctionNotActive, auction });
        }

        if (auction.closed) {
          return Promise.resolve({ status: BidResponse.AuctionClosed, auction });
        }

        if (value === null) value = (auction.price || auction.startingPrice) + (auction.bidStep || 1.0);

        if (value <= auction.price) {
          return Promise.resolve({ status: BidResponse.ValueToLow, auction });
        }

        const numSubscribers = (auction.subscribers ? auction.subscribers.length : 0);
        const minSubscribers = (auction.minSubscribers === undefined ? 10 : auction.minSubscribers);
        if (numSubscribers < minSubscribers) {
          return Promise.resolve({ status: BidResponse.InsufficientSubscribers, auction });
        }

        return this._auctionProvider
          .addBid(auctionId, user, value)
          .then((res) => {
            // NOTE: We doesn't get auction again so update values are set explicitly here
            auction.price = value;
            auction.bestBidder = user;
            return Promise.resolve({
              status: (res ? BidResponse.Success : BidResponse.NotAccepted),
              auction
            });
          });
      })
      .catch((err) => Promise.reject(err));
  }

  /**
   * Subscribe an auction by a user, following bid commands
   * will be addressed to this auction
   * @param auctionId
   * @param user
   * @returns {Promise.<TResult>}
   */
  subscribe(auctionId, user) {
    return this._auctionProvider
      .getAuctionsBySubscriber(user)
      .then((res) => {
        if (res.length == 0) {
          return this._auctionProvider
            .addSubscriberToAuction(auctionId, user);
        }

        return Promise.resolve(null);
      })
      .then((auction) => {
        if (auction) {
          if (!auction.closed) {
            return Promise.resolve({ status: SubscribeResponse.Success, auction });
          }

          return Promise.resolve({ status: SubscribeResponse.AuctionNotActive, auction });
        }
        return Promise.resolve({ status: SubscribeResponse.MultipleAuctionSubscribe });
      })
      .catch((err) => Promise.reject(err));
  }

  /**
   * Unsubscribe a subscribed auction
   * @param auctionId
   * @param user
   * @returns {Promise.<TResult>|*}
   */
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
      .save({ owner, title });
  }

  updateAuction(auctionId, updateObj) {
    return this._auctionProvider
      .updateAuction(auctionId, updateObj);
  }
}
