'use strict';

import * as consts from '../auction-consts';

/**
 * Notification
 *
 * @param telegram
 * @param managerFactory
 * @returns {{sendNotification: (function(*=, *=, *=))}}
 */
export default (telegram, managerFactory) => {


  return {
    sendNotification: (date) => {

      return new Promise((resolve, reject) => {
        managerFactory
          .getAuctionManager()
          .getClosedAndWaitingForPayment(date)
          .then(auctions => {
            auctions.forEach(auction => {
              telegram
                .sendMessage({
                  chat_id: auction.bestBidder.chatId,
                  text: `You won *${auction.title}*, @${auction.owner.username} is waiting for payment of ${auction.price} EUR to send the item, chats with him to close the deal.`,
                  parse_mode: 'Markdown'
                })
                .then(res => {
                  telegram
                    .sendMessage({
                      chat_id: auction.owner.chatId,
                      text: `@${auction.bestBidder.username} won Your auction, he received a notification to contact You and close the deal`,
                      parse_mode: 'Markdown'
                    });
                });

              managerFactory
                .getAuctionManager()
                .updateAuction(auction._id, { state: consts.AUCTION_STATE_PAYMENT_REQ_SENT });
            });

            resolve(auctions.length);
          })
          .catch(err => reject(err));
      });
    }
  };
}
