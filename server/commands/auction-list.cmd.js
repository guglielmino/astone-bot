'use strict';
import BaseCommand from './base-cmd';
import * as constants from './consts';

export default class AuctionListCommand extends BaseCommand {

	constructor(telegram, i18n, auctionManager) {
		super(telegram, i18n);
		this._auctionManager = auctionManager;
	}

	execute(state, ...params) {

		state.wait_for = constants.QCOMMAND_START_AUCTION;

		this._auctionManager
			.getActiveAuctions()
			.then((res) => {
				if (res && res.length > 0) {

					res.forEach((item) => {
						let buttons = [];
						buttons.push([{text: `Start bidding on ${item.title}`, callback_data: item._id.toString() }]);

						this._telegram
							.sendMessage({
								chat_id: state.chat.id,
								text: `*${item.title} (${this.t('from')} € ${item.startingPrice})*\n${item.image}\n${item.description}\n`,
								parse_mode: 'Markdown',
								reply_markup: {
									inline_keyboard: buttons
								}
							});

					});
				}
				else {
					this.simpleResponse(state.chat.id, this.t('Sorry, no Auctions active now'));
				}
			})
			.catch((err) => {
				this.simpleResponse(state.chat.id, this.t('*Ops!* We updating our BOT now, retry later. Sorry for the inconvenient :-('));
			});
	}
}

