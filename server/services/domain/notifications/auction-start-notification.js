'use strict';

export default (telegram, managerFactory) => {

  function getStartingAuctions(date, minutes) {
    return managerFactory
      .getAuctionManager()
      .getStarting(date, minutes);
  }

  function notify(auction, minutes) {
    managerFactory
      .getUserManager()
      .getAll()
      .then((users) => {
        users.forEach(user => {
          telegram
            .sendMessage({
              chat_id: user.id,
              text: `Auction *${auction.title}* is starting in ${minutes} minutes`,
              parse_mode: 'Markdown'
            });
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  return {
    sendNotification: (date, minutes) => {
      return new Promise((resolve, reject) => {
        getStartingAuctions(date, minutes)
          .then(auctions => {
            auctions.forEach(auction => {
              notify(auction, minutes);
            });

            resolve(auctions.length);
          })
          .catch(err => reject(err));
      });

    }
  };
}
