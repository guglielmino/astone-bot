'use strict';

import * as constants from '../consts';

export default class AuctionPriceCommand {

  constructor(telegram, managerFactory, commandHelper) {
    this._telegram = telegram;
    this._auctionManager = managerFactory.getAuctionManager();
    this._helper = commandHelper;
  }

  execute(state, ...params) {

    const price = parseFloat(params[0]);

    if (!price || price <= 0) {
      this._helper
        .simpleResponse
        .calledWith(state.chat.id,
          'Start price must be greather than 0')
      return Promise.resolve({state: constants.STATE_WAIT_FOR_PRICE, result: false});
    }

    return this
      ._auctionManager
      .updateAuction(state.auctionId, {startingPrice: price, price: price})
      .then((res) => {
        this._helper
          .simpleResponse(state.chat.id, 'Ok, send now the starting price');
        return Promise.resolve({state: constants.STATE_WAIT_FOR_PICTURE, result: true});
      })
      .catch((err) => {
        return Promise.reject(err);
      });

  }

}
