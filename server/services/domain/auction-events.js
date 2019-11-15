import * as auctionConsts from './auction-consts';
import Cipher from '../utilities/cipher';

const AuctionEvents = (telegram,
  i18n,
  auctionManager,
  closeAuctionUrl,
  cipherPassword) => ({
  onCloseAuction(auction) {
    auctionManager
      .closeAuction(auction._id)
      .then((res) => {
        if (res) {
          const encryptedId = new Cipher().encrypt(auction._id.toString(), cipherPassword);
          telegram
            .sendMessage({
              chat_id: auction.bestBidder.chatId,
              text: `You've won the item *${auction.title}*, use the Pay button to pay it (€ ${auction.price})`,
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: [[{ text: 'Pay', url: `${closeAuctionUrl}?token=${encryptedId}` }]]
              }
            })
            .catch((err) => {

            });
        }
      });
  }
});

export default AuctionEvents;

