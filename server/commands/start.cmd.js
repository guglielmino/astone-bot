'use strict';

import * as constants from './consts';

const welcomeText = '*Welcome to AstoneBot*\n\n\
this is an automated online auctions bot where You can buy or sell items.\n\
there are some simple commands to interact with the bot\n\
/list - show active auctions, You can start bid on these\n\
';

export default class StartCommand {

	constructor(telegram, managerFactory, commandHelper) {
		this._telegram = telegram;
		this._userManager = managerFactory.getUserManager();
		this._helper = commandHelper;
	}

	execute(state, ...params) {
		this._userManager
			.save(state.chat);

		this._telegram
			.sendMessage({
				chat_id: state.chat.id,
				text: welcomeText,
				parse_mode: 'Markdown'
			});

		return Promise.resolve(null);
	}
}
