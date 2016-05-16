'use strict';
import BaseCommand from './base-cmd';


export default class BidCommand extends BaseCommand {

	constructor(telegram, i18n, auctionManager) {
		super(telegram, i18n);
		this._auctionManager = auctionManager;

		this._responses = {
			'Success': (chat, auction) => {
				this.simpleResponse(chat.id,
					this.t('You are best bidder now\n price is * € ') + auction.price.toFixed(2) + '*');
					auction.subscribers.filter((sub) => sub.username !== chat.username)
						.forEach((subscriber) => {
							let to = `@${subscriber.username}`;
							let mess = `${auction.title} price is now € ${auction.price}`;
							this.simpleResponse(to, mess);
						});
				},
			'NotAccepted': (chat, auction) => {
				this.simpleResponse(chat.id, this.t('Offer can\'t be accepted. Try again.')); },
			'ValueToLow': (chat, auction) => {
				this.simpleResponse(chat.id, this.t(`Your offer is lower than current value (€ ${auction.price})`)); },
			'AuctionNotActive': (chat, auction) => {
				this.simpleResponse(chat.id, this.t('Can\'t bid on this Auction because is inactive')); }
		};
	}

	execute(state, ...params) {

		if (!state.auctionId) {
			this.simpleResponse(state.chat.id, this.t('Before bidding You must choose an active auction'));
			return;
		}

		if (params.length > 0) {
			const bidValue = parseFloat(params[0][0]);
			if (bidValue > 0.0) {
				this._auctionManager
					.bid(state.auctionId, {username: state.chat.username}, bidValue)
					.then((res) => {
						if (res.status.name in this._responses){
							this._responses[res.status.name](state.chat, res.auction);
						}
					});
			}
		}
		// TODO: Handle bid withouth params (suggest offers: es. "10.5, 11.0, 11.5)
	}


}
