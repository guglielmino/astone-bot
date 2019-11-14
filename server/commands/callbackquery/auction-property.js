'use strict';

export default class AuctionPropertyCommand {
  constructor(telegram, managerFactory, commandHelper, propertyInfo) {
    this._telegram = telegram;
    this._auctionManager = managerFactory.getAuctionManager();
    this._helper = commandHelper;

    this._propertyInfo = propertyInfo;
  }

  execute(state, ...params) {
    if (params && params.length > 0) {
      const auctionId = params[0];
      this._helper
        .simpleResponse(state.chat.id,
          this._propertyInfo.answerText);

      this._telegram
        .answerCallbackQuery(state.callback_query_id, '', false);

      return Promise.resolve({ state: this._propertyInfo.stateCommand, auctionId, single: true });
    }
  }
}
