'use strict';

import * as constants from '../../../commands/consts';
import encodeQueryCommand from '../../utilities/encodeQueryCommand';

export default (telegram, managerFactory) => {

  function getStartingAuctions(date, minutes) {
    return managerFactory
      .getAuctionManager()
      .getStarting(date, minutes);
  }

  function notify(auction, auctionBaseUrl) {

    managerFactory
      .getUserManager()
      .getAll()
      .then((users) => {
        users.forEach(user => {
          let buttons = [];
          buttons.push([
            {
              text: `Start bidding on ${auction.title}`,
              callback_data: encodeQueryCommand(constants.QCOMMAND_START_AUCTION, auction._id.toString())
            }
          ]);

          telegram
            .sendMessage({
              chat_id: user.id,
              text: `Auction *${auction.title}* is starting, ${auctionBaseUrl}/${auction._id}`,
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: buttons
              }
            });
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  return {
    sendNotification: (date, auctionBaseUrl) => {
      return new Promise((resolve, reject) => {
        getStartingAuctions(date, 0)
          .then(auctions => {
            auctions.forEach(auction => {
              notify(auction, auctionBaseUrl);
            });

            resolve(auctions.length);
          })
          .catch(err => reject(err));
      });

    }
  };
}
