'use strict';

import * as constants from '../consts';

export default class AuctionPictureCommand {

  constructor(telegram, managerFactory, commandHelper, s3Obj) {
    this._telegram = telegram;
    this._auctionManager = managerFactory.getAuctionManager();
    this._helper = commandHelper;
    this.s3Obj = s3Obj;
  }

  execute(state, ...params) {
    let photos = params[0];
    if (photos) {
      let pict = photos.reduce((prev, cur) => (prev.file_size > cur.file_size) ? prev : cur);

      let telegramResponse = null;
      return this._telegram
        .getFile(pict.file_id)
        .then(res => {
          telegramResponse = res;
          // Store image on AWS S3
          return this.s3Obj.urlToS3(res.file_url);
        })
        .then(res => {
          let nextState = (state.single ? null : constants.STATE_WAIT_FOR_MIN_SUB);
          this._auctionManager
            .updateAuction(state.auctionId, {file_id: telegramResponse.file_id, image: res.Location}) // res.Location
            .then((res) => {
              this._helper
                .simpleResponse(state.chat.id, state.single ? 'Ok, picture changed' : 'Minimum number of participants ? ');
            });

          return Promise.resolve({state: nextState, result: true, single: false});
        });
    }
  }

}
