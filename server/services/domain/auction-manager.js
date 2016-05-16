'use strict';

import {Enum} from 'enumify';

export class BidResponse extends Enum {}
BidResponse.initEnum([
	'Success', 
	'NotAccepted', 
	'ValueToLow', 
	'AuctionNotActive',
	'CanNotSubscribe', 
	'MultipleAuctionSubscribe',
	'AuctionNotExist'
]);

export default class AuctionManager {

	constructor(auctionProvider) {
		this._auctionProvider = auctionProvider;
	}

	getActiveAuctions() {
		return this._auctionProvider
			.getActiveAuctions();
	}

	bid(auctionId, user, value) {

		return this._auctionProvider
			.getAuctionById(auctionId)
			.then((auction) => {
				if(!auction || Object.getOwnPropertyNames(auction).length === 0) {
					return Promise.resolve({ status: BidResponse.AuctionNotExist, auction: null });
				}

				if(auction.startDate > new Date()) {
					return Promise.resolve({status: BidResponse.AuctionNotActive, auction: auction });
				}
				
				if(value <= auction.price) {
					return Promise.resolve({ status: BidResponse.ValueToLow, auction: auction });
				}

				return this._auctionProvider
					.addBid(auctionId, user, value)
					.then((res) => {
						// NOTE: We doesn't get auction again so update values are set explicitly here
						auction.price = value;
						auction.bestBidder = user;
						return Promise.resolve({ status: (res ? BidResponse.Success : BidResponse.NotAccepted), auction: auction });
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
					return Promise.resolve(false);
				}
			})
			.then((added) => {
				if(added) {
					return Promise.resolve({ status: BidResponse.Success });
				} else {
					return Promise.resolve({ status: BidResponse.MultipleAuctionSubscribe });
				}
			})
			.catch((err) => {
				return Promise.reject(err);
			});
	}

	unsubscribe(auctionId, user) {
		
	}

	getAuctionById(auctionId) {
		return this._auctionProvider
			.getAuctionById(auctionId);
	}
}

