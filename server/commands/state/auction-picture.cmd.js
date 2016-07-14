'use strict';

import * as constants from '../consts';

export default class AuctionPictureCommand {

  constructor(telegram, managerFactory, commandHelper) {
    this._telegram = telegram;
    this._auctionManager = managerFactory.getAuctionManager();
    this._helper = commandHelper;
  }

  execute(state, ...params) {

    let photos = params[0];
    if (photos) {
      let pict = photos.reduce((prev, cur) => (prev.file_size > cur.file_size) ? prev : cur)

      return this._telegram
        .getFile(pict.file_id)
        .then((res) => {
          this._auctionManager
            .updateAuction(state.auctionId, {file_id: res.file_id, file_url: res.file_url});
          return Promise.resolve({state: constants.STATE_WAIT_FOR_MIN_SUB, result: true});
        });

    }
  }

}
