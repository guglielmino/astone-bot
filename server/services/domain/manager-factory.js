import AuctionManager from './auction-manager';

export default (storageProvider) => {

	let _auctionManager;

	return {
		getAuctionManager() {
			if(!_auctionManager) {
				_auctionManager = new AuctionManager(storageProvider.auctionProvider);
			}
			return _auctionManager;
		},

		getUserManager() {
			return {};
		}
	}

};

