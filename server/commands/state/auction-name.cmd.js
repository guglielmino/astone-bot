'use strict';

import * as constants from '../consts';

export default class AuctionNameCommand {

  constructor(telegram, managerFactory, commandHelper) {
    this._telegram = telegram;
    this._auctionManager = managerFactory.getAuctionManager();
    this._helper = commandHelper;
  }

  execute(state, ...params) {

    if (state.auctionId && state.single) {
      return this
        ._auctionManager
        .updateAuction(state.auctionId, { title: params[0] })
        .then(res => {
          this._helper
            .simpleResponse(state.chat.id, 'Ok, name changed');
          return Promise.resolve({ state: null, result: true, single: false });
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    } else {
      return this
        ._auctionManager
        .createAuction({ username: state.chat.username, chatId: state.chat.id }, params[0])
        .then((res) => {
          this._helper
            .simpleResponse(state.chat.id, 'Ok, give me now a description of the item to sell');
          return Promise.resolve({
            state: constants.STATE_WAIT_FOR_DESC,
            auctionId: res,
            single: false
          });
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }
  }

}
