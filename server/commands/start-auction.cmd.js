'use strict';
import BaseCommand from './base-cmd';
import * as constants from './consts';

export default class StartAuctionCommand extends BaseCommand {

	constructor(telegram, i18n, auctionManager) {
		super(telegram, i18n);
		this._auctionManager = auctionManager;
	}

	execute(state, ...params) {
		if (params && params.length > 0) {
			const auctionId = params[0];
			this._auctionManager
				.subscribe(auctionId, {username: state.chat.username, chatId: state.chat.id})
				.then((res) => {

					if (res.status.name === 'Success') {
						state.auctionId = auctionId.toString();

						this._telegram
							.answerCallbackQuery(state.callback_query_id,
								`${this.t('AUCTION SUBCRIBED')}`, false);

						const currentPrice = res.auction.price.toFixed(2);
						const nextBid = parseFloat(res.auction.price + parseFloat(res.auction.bidStep || 1.00)).toFixed(2);
						const bidRespMessage = `last bid was *€ ${currentPrice}*, now ${nextBid}, now ${nextBid}, will ya give me *€ ${nextBid}* ?`;

						this._telegram
							.sendMessage({
								chat_id: state.chat.id,
								text: bidRespMessage,
								parse_mode: 'Markdown',
								reply_markup: {
									inline_keyboard: [
										[{
											text: `Bid € ${nextBid}`,
											callback_data: this.encodeQueryCommand(constants.QCOMMAND_BID,nextBid)
										}]
									]
								}
							});
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
