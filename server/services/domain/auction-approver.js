'use strict';


export default function (telegram, auctionManager) {
  return {
    approve(auctionId, date) {
      const startDate = new Date(date);

      return auctionManager
        .getAuctionById(auctionId)
        .then((auc) => auctionManager
          .updateAuction(auctionId, { startDate }))
        .then((res) => {
          if (!res) throw new Error('Can\'t approve the auction');
          return auctionManager
            .getAuctionById(auctionId);
        })
        .then((updatedAuction) => telegram
          .sendMessage({
            chat_id: updatedAuction.owner.chatId,
            text: `Your auction *${updatedAuction.title}* is approved! 
It's schedulated for ${updatedAuction.startDate.toString()}. 
Invites other users to get more chances to make a big deal!!!`,
            parse_mode: 'Markdown'
          }))
        .catch((err) => console.log(err));
    },

    reject(auctionId) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      let updatedAuction = null;

      return auctionManager
        .getAuctionById(auctionId)
        .then((res) => {
          updatedAuction = res;
          console.log(`UP ${JSON.stringify(updatedAuction)}`);
          return auctionManager
            .closeAuction(auctionId);
        })
        .then((x) => telegram
          .sendMessage({
            chat_id: updatedAuction.owner.chatId,
            text: `Your auction *${updatedAuction.title}* not comply with policies of Astone.
Auction was rejected, sorry :-(`,
            parse_mode: 'Markdown'
          }))
        .catch((err) => console.log(err));
    }
  };
}
