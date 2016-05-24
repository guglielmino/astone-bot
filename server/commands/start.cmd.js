'use strict';
import BaseCommand from './base-cmd';
import * as constants from './consts';

const welcomeText = '*Welcome to TeleBid*\n\n\
this is an automated online auctions bot where You can buy or sell items.\n\
there are some simple commands to interact with the bot\n\
/list - show active auctions where You can start bid\n\
';

export default class StartCommand extends BaseCommand {

	constructor(telegram, i18n, userProvider) {
		super(telegram, i18n);
		this.userProvider = userProvider;
	}

	execute(state, ...params) {
		this.userProvider
			.save(state.chat);

		this.telegram.sendMessage({
			chat_id: state.chat.id,
			text: welcomeText,
			parse_mode: 'Markdown'
		});

		return Promise.resolve(null);
	}
}
