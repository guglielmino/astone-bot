'use strict';

import * as constants from '../consts';

export default class SetTitleCommand {

  constructor(telegram, managerFactory, commandHelper) {
    this._telegram = telegram;
    this._auctionManager = managerFactory.getAuctionManager();
    this._helper = commandHelper;
  }

  execute(state, ...params) {

    return this._auctionManager
      .getAuctionsByOwner(state.chat.username)
      .then((res) => {
        if (res && res.length > 0) {
          let buttons = [];
          res.forEach((item) => {
            buttons.push([{
              text: `${item.title}`, callback_data: this._helper
                .encodeQueryCommand(constants.QCOMMAND_SET_TITLE, item._id.toString())
            }]);
          });

          this._telegram
            .sendMessage({
              chat_id: state.chat.id,
              text: `Choose an auction to change the title`,
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: buttons
              }
            });
        }
      });
  }
}
