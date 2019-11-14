export default function () {
  const ageMessages = {
    65: (auction) => `No one offer more than € ${auction.price} ?`,
    70: (auction) => 'Come on, don\'t be shy, make an offer',
    90: (auction) => `*€ ${auction.price}* and one`,
    95: (auction) => `*€ ${auction.price}* and two`,
    100: (auction) => `*€ ${auction.price}* and three`,
    103: (auction) => `*${auction.title}* sold for *€ ${auction.price}* to @${auction.bestBidder.username}  💰`
  };

  const ages = Object.keys(ageMessages);
  const maxAge = Math.max.apply(null, ages);

  return {
    getMessage(auction) {
      if (ageMessages[auction.bidAge]) {
        return { message: ageMessages[auction.bidAge](auction), isLast: (auction.bidAge === maxAge) };
      }
      return null;
    }
  };
}
