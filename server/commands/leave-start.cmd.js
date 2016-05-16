'use strict';
import BaseCommand from './base-cmd';
import * as constants from './consts';

export default class LeaveStartCommand extends BaseCommand {

	constructor(telegram, i18n, auctionManager) {
		super(telegram, i18n);
		this._auctionManager = auctionManager;
	}

	execute(state, ...params) {

		if(params && params.length > 0) {
			this._auctionManager
				.getAuctionById(params[0])
				.then((auction) => {
					if (auction) {
							state.auctionId = auction._id.toString();
							this._telegram
								.answerCallbackQuery(state.callback_query_id, `${this.t('AUCTION')} ${auction.title} ${this.t('STARTED')}`, false);
						}
					})
				.catch((err) => {
					this.simpleResponse(state.chat.id,
						this.t('Sorry, we have some problems starting this Auction right now, please retry later.'));
				});
		}
	}
}

