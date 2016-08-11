'use strict';

import * as constants from '../consts';

export default class AuctionListCommand {

  constructor(telegram, managerFactory, commandHelper, auctionPageUrl) {
    this._telegram = telegram;
    this._auctionManager = managerFactory.getAuctionManager();
    this._helper = commandHelper;
    this._auctionPageUrl = auctionPageUrl;
  }

  execute(state, ...params) {

    this._telegram
      .sendChatAction(state.chat.id, 'typing');

    const now = new Date();
    return this._auctionManager
      .getActiveAuctions(now)
      .then(res => {
        if (res && res.length > 0) {
          res.forEach((item) => {
            let buttons = [];

            buttons.push([{
              text: `Start bidding on ${item.title}`, callback_data: this._helper
                .encodeQueryCommand(constants.QCOMMAND_START_AUCTION, item._id.toString())
            }]);

            const title = `${item.title} - current price € ${item.price} -\n`;
            const auctionUrl = `${this._auctionPageUrl}/${item._id}`;
            let leftSpace = 200 - title.length - auctionUrl.length;
            if (item.description.length > leftSpace) {
              item.description = item.description.substring(0, leftSpace - '...\n'.length);
              item.description += '...\n';
            } else {
              item.description += '\n';
            }

            let auctionDesc = item.description.substring(0, leftSpace);

            const response = this._helper
              .builder('photo')
              .setRecipient(this._helper.recipientFromState(state))
              .setPhoto(item.file_id)
              .setCaption(`${title}${auctionDesc}${auctionUrl}`)
              .setButtons(buttons)
              .build();

            this._telegram.sendPhoto(response);

          });
        }
        else {
          return this._helper.simpleResponse(state.chat.id, 'Sorry, no Auctions active now');
        }
        Promise.resolve(null);
      })
      .catch(err => {
        return this._helper.simpleResponse(state.chat.id, '*Ops!* We updating our BOT now, retry later. Sorry for the inconvenient :-(');
      });
  }
}

