'use strict';

import fs from 'fs';

export default class HelpCommand {

  constructor(telegram, managerFactory, commandHelper) {
    this._telegram = telegram;
    this._userManager = managerFactory.getUserManager();
    this._helper = commandHelper;

    this.helpMessage = fs.readFileSync(__dirname + '/../../res/messages/help.md').toString();
  }

  execute(state, ...params) {

    this._telegram
      .sendMessage({
        chat_id: state.chat.id,
        text: this.helpMessage,
        parse_mode: 'Markdown'
      });

    return Promise.resolve(null);
  }
}
