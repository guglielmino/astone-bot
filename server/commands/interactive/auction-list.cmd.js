'use strict';

import * as constants from '../consts';
import encodeQueryCommand from '../../services/utilities/encodeQueryCommand';

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
      .then((res) => {
        if (res && res.length > 0) {
          res.forEach((item) => {
            const buttons = [];

            buttons.push([{
              text: `Start bidding on ${item.title}`, callback_data: encodeQueryCommand(constants.QCOMMAND_START_AUCTION, item._id.toString())
            }]);

            const title = `${item.title} - current price € ${item.price} -\n`;
            const auctionUrl = `${this._auctionPageUrl}/${item._id}`;
            const leftSpace = 200 - title.length - auctionUrl.length;
            if (item.description.length > leftSpace) {
              item.description = item.description.substring(0, leftSpace - '...\n'.length);
              item.description += '...\n';
            } else {
              item.description += '\n';
            }

            const auctionDesc = item.description.substring(0, leftSpace);

            this._telegram.sendPhoto({
              chat_id: state.chat.id,
              photo: item.file_id,
              caption: `${title}${auctionDesc}${auctionUrl}`,
              reply_markup: {
                inline_keyboard: buttons
              }
            });
          });
        } else {
          return this._helper.simpleResponse(state.chat.id, 'Sorry, no active Auctions now');
        }

        Promise.resolve(null);
      })
      .catch((err) => {
        this._helper.simpleResponse(state.chat.id, '*Ops!* We updating our BOT now, retry later. Sorry for the inconvenient :-(')
      });
  }
}
