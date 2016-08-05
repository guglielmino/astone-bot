'use strict';

import Cipher from '../../utilities/cipher';

export default (telegram, managerFactory) => {


  return {
    sendNotification: (date, payUrl, cipherPassword) => {

      return new Promise((resolve, reject) => {
        managerFactory
          .getAuctionManager()
          .getClosedAndWaitingForPayment(date)
          .then(auctions => {
            auctions.forEach(auction => {
              const encryptedId = new Cipher()
                .encrypt(auction._id.toString(), cipherPassword);

              telegram
                .sendMessage({
                  chat_id: auction.bestBidder.chatId,
                  text: `You won *${auction.title}*, seller is waiting for payment to send the item.`,
                  parse_mode: 'Markdown',
                  reply_markup: {
                    inline_keyboard: [[{text: `Pay ${auction.price} EUR`, url: `${payUrl}?token=${encryptedId}`}]]
                  }
                });
            });

            resolve(auctions.length);
          })
          .catch(err => reject(err));
      });

    }
  };
}
