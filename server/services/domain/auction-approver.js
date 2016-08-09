'use strict';


export default function (telegram, auctionManager) {

  return {
    approve: function (auctionId, date) {
      return auctionManager
        .getAuctionById(auctionId)
        .then(auc => {
          return auctionManager
            .updateAuction(auctionId, { startDate: date });
        })
        .then(res => {
          if (!res) throw new Error('Can\'t approve the auction');
          return auctionManager
            .getAuctionById(auctionId);
        })
        .then(updatedAuction => {
          const startDate = new Date(updatedAuction.startDate);

          return telegram
            .sendMessage({
              chat_id: updatedAuction.owner.chatId,
              text: `Your auction *${updatedAuction.title}* is approved! 
              It's schedulated for ${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString()} (UTC time). 
              Invites other users to get more chances to make a big deal!!!`,
              parse_mode: 'Markdown'
            });
        })
        .catch(err => console.log(err));
    }
  };
}
