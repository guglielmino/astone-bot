'use strict';
import BaseCommand from './base-cmd';
import * as constants from './consts';

export default class AuctionListCommand extends BaseCommand {

	constructor(telegram, managerFactory) {
		super(telegram);
		this._auctionManager = managerFactory.getAuctionManager();
	}

	execute(state, ...params) {
		this._telegram
			.sendChatAction(state.chat.id, 'typing');
		
		const now = new Date();
		return this._auctionManager
			.getActiveAuctions(now)
			.then((res) => {
				if (res && res.length > 0) {

					res.forEach((item) => {
						let buttons = [];

						buttons.push([{
							text: `Start bidding on ${item.title}`, callback_data: 
								this.encodeQueryCommand(constants.QCOMMAND_START_AUCTION, item._id.toString())
						}]);
							
						this._telegram
							.sendMessage({
								chat_id: state.chat.id,
								text: `*${item.title} (price € ${item.price})*\n${item.image}\n${item.description}`,
								parse_mode: 'Markdown',
								reply_markup: {
									inline_keyboard: buttons
								}
							});
						
						Promise.resolve(null);

					});
				}
				else {
					return this.simpleResponse(state.chat.id, 'Sorry, no Auctions active now');
				}
			})
			.catch((err) => {
				return this.simpleResponse(state.chat.id, '*Ops!* We updating our BOT now, retry later. Sorry for the inconvenient :-(');
			});
	}
}

