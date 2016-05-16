'use strict';
import BaseCommand from './base-cmd';
import * as constants from './consts';

export default class StartAuctionCommand extends BaseCommand {

	constructor(telegram, i18n, auctionManager) {
		super(telegram, i18n);
		this._auctionManager = auctionManager;
	}

	execute(state, ...params) {
		if(params && params.length > 0) {
			const auctionId = params[0];
			this._auctionManager
				.subscribe(auctionId, { username: state.chat.username })
				.then((res) => {
					state.auctionId = auctionId.toString();
					if(res.status.name === 'Success') {
						this._telegram
							.answerCallbackQuery(state.callback_query_id,
								`${this.t('AUCTION SUBCRIBED')}`, false);

							
						
					}
					// TODO: Handling error cases
				})
				.catch((err) => {
					this.simpleResponse(state.chat.id,
						this.t('Sorry, we have some problems starting this Auction right now, please retry later.'));
				});
		}
	}
}

