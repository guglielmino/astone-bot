'use strict';

import * as constants from '../consts';

export default class TitleCommand {

  constructor(telegram, managerFactory, commandHelper) {
    this._telegram = telegram;
    this._auctionManager = managerFactory.getAuctionManager();
    this._helper = commandHelper;
  }

  execute(state, ...params) {

    if (params && params.length > 0) {
      const auctionId = params[0];
      this._helper
        .simpleResponse(state.chat.id,
          'Ok, write the new title for the Auction.');

      this._telegram
        .answerCallbackQuery(state.callback_query_id, '', false);

     return Promise.resolve({state: constants.STATE_WAIT_FOR_NAME, auctionId: auctionId, single: true});
    }
  }
}
