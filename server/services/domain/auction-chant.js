'use strict';

export default (telegram, auctionManager, auctionAges) => {
  const AGE_TRIGGER = 60;

  function _handleAgeMessage(auction) {
    let ret = false;

    if (auction.bidAge > AGE_TRIGGER) {
      const ageMessage = auctionAges.getMessage(auction);
      if (ageMessage) {
        _sendMessageToSubscribers(auction, ageMessage.message);
        ret = ageMessage.isLast;
      }
    }

    return ret;
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
    make: (now) => auctionManager
      .getRunningAuctionsBidAge(now, AGE_TRIGGER)
      .then((res) => {
        res.forEach((auction) => {
          if (_handleAgeMessage(auction)) {
            auctionManager
              .closeAuction(auction._id);
          }
        });
        return Promise.resolve(res.length);
      })
  };
};
