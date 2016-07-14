'use strict';

import * as constants from '../consts';

export default class AuctionMinSubscribersCommand {

  constructor(telegram, managerFactory, commandHelper) {
    this._telegram = telegram;
    this._auctionManager = managerFactory.getAuctionManager();
    this._helper = commandHelper;
  }

  execute(state, ...params) {


  }

}
