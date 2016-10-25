'use strict';


export default function (telegram, auctionManager) {

  return {
    approve: function (auctionId, date) {
      const startDate = new Date(date);

      return auctionManager
        .getAuctionById(auctionId)
        .then(auc => {
          return auctionManager
            .updateAuction(auctionId, { startDate: startDate });
        })
        .then(res => {
          if (!res) throw new Error('Can\'t approve the auction');
          return auctionManager
            .getAuctionById(auctionId);
        })
        .then(updatedAuction => {
          return telegram
            .sendMessage({
              chat_id: updatedAuction.owner.chatId,
              text: `Your auction *${updatedAuction.title}* is approved! 
It's schedulated for ${updatedAuction.startDate.toString()}. 
Invites other users to get more chances to make a big deal!!!`,
              parse_mode: 'Markdown'
            });
        })
        .catch(err => console.log(err));
    },

    reject: function (auctionId) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      return auctionManager
        .getAuctionById(auctionId)
        .then(auc => {
          return auctionManager
            .updateAuction(auctionId, { startDate: yesterday });
        })
        .then(res => {
          if (!res) throw new Error('Can\'t reject the auction');
          return auctionManager
            .getAuctionById(auctionId);
        })
        .then(updatedAuction => {
          return telegram
            .sendMessage({
              chat_id: updatedAuction.owner.chatId,
              text: `Your auction *${updatedAuction.title}* not comply with policies of Astone.
Auction is is rejected, sorry :-(`,
              parse_mode: 'Markdown'
            });
        })
        .catch(err => console.log(err));
    }
  };
}
