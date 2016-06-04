import AuctionManager from './auction-manager';
import UserManager from './user-manager';

export default (storageProvider) => {

	let _auctionManager;
	let _userManager;

	return {
		getAuctionManager() {
			if(!_auctionManager) {
				_auctionManager = new AuctionManager(storageProvider.auctionProvider);
			}
			return _auctionManager;
		},

		getUserManager() {
			if(!_userManager) {
				_userManager = UserManager(storageProvider.userProvider);
			}
			return _userManager;
		}
	}

};

