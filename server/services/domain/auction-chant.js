'use strict';

export default (telegram, auctionManager, auctionAges) => {
  const AGE_TRIGGER = 60;

  function _handleAgeMessage(auction) {
    if (auction.bidAge > AGE_TRIGGER) {
      let ageMessage = auctionAges.getMessage(auction);
      if (ageMessage) {
        _sendMessageToSubscribers(auction, ageMessage.message);
      }
    }
  }

  function _sendMessageToSubscribers(auction, message) {
    auction.subscribers.forEach((subscriber) => {
      telegram.sendMessage({
        chat_id: subscriber.chatId,
        text: message,
        parse_mode: 'Markdown'
      });
    });
  }

  return {
    make: (now) => {
      return auctionManager
        .getRunningAuctionsBidAge(now, AGE_TRIGGER)
        .then((res) => {
          res.forEach((auction) => {
            _handleAgeMessage(auction);
          });
          return Promise.resolve(res.length);
        });
    }
  };
};
