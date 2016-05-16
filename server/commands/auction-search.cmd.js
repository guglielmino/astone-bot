'use strict';
import BaseCommand from './base-cmd';

export default class AuctionSearchCommand extends BaseCommand{

	constructor(telegram, i18n, auctionManager) {
		super(telegram, i18n);
		this._auctionManager = auctionManager;
	}

	execute(state, ...params) {
		if (params.length > 0 && params[0].length > 1) {
			const term = params[0].join(' ');

			this._telegram
				.sendChatAction(state.chat.id, 'typing');

			this._auctionManager
				.search(term)
				.then((res) => {

					res.forEach((item) => {
						this._telegram.sendMessage({
							chat_id: state.chat.id,
							text: '',
							parse_mode: 'Markdown'
						});
					});

				});
		}

	}

}
