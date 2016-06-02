'use strict';
import BaseCommand from './base-cmd';
import * as constants from './consts';

export default class StartAuctionCommand extends BaseCommand {

	constructor(telegram, auctionManager) {
		super(telegram);
		this._auctionManager = auctionManager;
	}

	execute(state, ...params) {
	
		if (params && params.length > 0) {
			const auctionId = params[0];
			return this._auctionManager
				.subscribe(auctionId, {username: state.chat.username, chatId: state.chat.id})
				.then((res) => {

					switch(res.status.name){
						case 'Success':
							this._telegram
								.answerCallbackQuery(state.callback_query_id, 'AUCTION SUBCRIBED', false);

							this._makeTelegramAnswer(state, res.auction);

							return Promise.resolve({ auctionId: auctionId.toString() });
						break;
						case 'AuctionNotActive':
							this._telegram
								.sendMessage({
									chat_id: state.chat.id,
									text: `Sorry, this auction isn't active You can't start bidding on it.`,
									parse_mode: 'Markdown'
								});
							break;
					}
				})
				.catch((err) => {
					return this.simpleResponse(state.chat.id,
						'Sorry, we have some problems starting this Auction right now, please retry later.');
				});
		}
	}

	_makeTelegramAnswer(state, auction) {
		const currentPrice = auction.price.toFixed(2);
		const nextBid = parseFloat(auction.price + parseFloat(auction.bidStep || 1.00)).toFixed(2);
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
							callback_data: this.encodeQueryCommand(constants.QCOMMAND_BID, nextBid)
						}]
					]
				}
			});
	}
}
