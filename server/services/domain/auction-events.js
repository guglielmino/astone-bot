import * as auctionConsts from './auction-consts';
import Cipher from '../utilities/cipher';

export default class AuctionEvents {
  constructor(telegram, i18n, auctionManager, closeAuctionUrl, cipherPassword) {
    this._telegram = telegram;
    this._i18n = i18n;
    this._auctionManager = auctionManager;
    this._closeAuctionUrl = closeAuctionUrl;
    this._cipherPassword = cipherPassword;
  }

  onCloseAuction(auction) {
    this._auctionManager
      .closeAuction(auction._id)
      .then((res) => {
        if (res) {
          const encryptedId = new Cipher().encrypt(auction._id.toString(), this._cipherPassword);
          this._telegram
            .sendMessage({
              chat_id: auction.bestBidder.chatId,
              text: `You've won the item *${auction.title}*, use the Pay button to pay it (€ ${auction.price})`,
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: [[{ text: 'Pay', url: `${this._closeAuctionUrl}?token=${encryptedId}` }]]
              }
            })
            .catch((err) => {

            });
        }
      });
  }
}
