'use strict';

import * as constants from './consts';

const welcomeText = '*Welcome to AstaBot*\n\n\
this is an automated online auctions bot where You can buy or sell items.\n\
there are some simple commands to interact with the bot\n\
/list - show active auctions, You can start bid on these\n\
';

export default class StartCommand  {

	constructor(telegram, managerFactory) {
		this._telegram = telegram;
	  this._userProvider = managerFactory.getUserManager();
		this._helper = commandHelper;
	}

	execute(state, ...params) {
		this._userProvider
			.save(state.chat);

		this.telegram.sendMessage({
			chat_id: state.chat.id,
			text: welcomeText,
			parse_mode: 'Markdown',
			
		});

		return Promise.resolve(null);
	}
}
