'use strict';

import * as constants from '../consts';

export default class AuctionMinSubscribersCommand {
  constructor(telegram, managerFactory, commandHelper) {
    this._telegram = telegram;
    this._auctionManager = managerFactory.getAuctionManager();
    this._helper = commandHelper;
  }

  execute(state, ...params) {
    const minParticipants = parseInt(params[0]);

    if (!minParticipants || minParticipants < 0) {
      this._helper
        .simpleResponse
        .calledWith(state.chat.id,
          'Min number of participants must be greather or equal than 0');
      return Promise.resolve({ state: constants.STATE_WAIT_FOR_MIN_SUB, result: false });
    }
    return this
      ._auctionManager
      .updateAuction(state.auctionId, { minSubscribers: minParticipants })
      .then((res) => {
        this._helper
          .simpleResponse(state.chat.id, state.single ? 'Ok, number of participants changed' : 'Very well, Your Auction will be evaluated by our review Team, You will be contacted when ready.');
        return Promise.resolve({ state: null, result: true, single: false });
      })
      .catch((err) => Promise.reject(err));
  }
}
