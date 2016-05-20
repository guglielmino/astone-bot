import BidCommand from './commands/bid.cmd';
import AuctionListCommand from './commands/auction-list.cmd';
import AuctionSearchCommand from './commands/auction-search.cmd';
import StartAuctionCommand from './commands/start-auction.cmd.js';

import * as constants from './commands/consts';



export default (chatManager, telegram, i18n, auctionManager) => {

	// Interactive commands (ie /start, /help, ...)
	const bidCmd = new BidCommand(telegram, i18n, auctionManager);
	const listCmd = new AuctionListCommand(telegram, i18n, auctionManager);
	chatManager.addCommand(constants.COMMAND_BID, bidCmd);
	chatManager.addCommand(constants.COMMAND_LIST, listCmd);
	
	// QueryResponse command (ie 'out-of-band' commands on callback button action)
	const startAuctionCmd = new StartAuctionCommand(telegram, i18n, auctionManager);
	chatManager.addCommand(constants.QCOMMAND_START_AUCTION, startAuctionCmd, 'QueryResponse');
	chatManager.addCommand(constants.QCOMMAND_BID, bidCmd, 'QueryResponse');

};