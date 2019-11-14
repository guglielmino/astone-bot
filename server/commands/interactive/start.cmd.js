'use strict';

import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default class StartCommand {
  constructor(telegram, managerFactory, commandHelper) {
    this._telegram = telegram;
    this._userManager = managerFactory.getUserManager();
    this._helper = commandHelper;

    this.welcomeText = fs.readFileSync(`${__dirname}/../../res/messages/start.md`).toString();
  }

  execute(state, ...params) {
    this._userManager
      .save(state.chat);

    this._telegram
      .sendMessage({
        chat_id: state.chat.id,
        text: this.welcomeText,
        parse_mode: 'Markdown'
      });

    return Promise.resolve(null);
  }
}
