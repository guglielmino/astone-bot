'use strict';

import * as constants from '../consts';

export default class AuctionDescriptionCommand {

  constructor(telegram, managerFactory, commandHelper) {
    this._telegram = telegram;
    this._auctionManager = managerFactory.getAuctionManager();
    this._helper = commandHelper;
  }

  execute(state, ...params) {

    const description = params[0];

    if (!description || description.length == 0) {
      this._helper
        .simpleResponse
        .calledWith(state.chat.id,
          'Give a description of the item You want to sell')
      return Promise.resolve({ state: constants.STATE_WAIT_FOR_DESC, result: false });
    }

    let nextState = (state.single ? null : constants.STATE_WAIT_FOR_PRICE);
    return this
      ._auctionManager
      .updateAuction(state.auctionId, { description: description })
      .then((res) => {
        this._helper
          .simpleResponse(state.chat.id, state.single ? 'Ok, description changed' : 'Now You need to set a starting price');

        return Promise.resolve({ state: nextState, result: true, single: false });
      })
      .catch((err) => {
        return Promise.reject(err);
      });

  }
}
