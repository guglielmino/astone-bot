import { AuctionManager } from './auction-manager';
import UserManager from './user-manager';

export default (storageProvider) => {
  let auctionManager;
  let userManager;

  return {
    getAuctionManager() {
      if (!auctionManager) {
        auctionManager = AuctionManager(storageProvider.auctionProvider);
      }
      return auctionManager;
    },

    getUserManager() {
      if (!userManager) {
        userManager = UserManager(storageProvider.userProvider);
      }
      return userManager;
    }
  };
};
