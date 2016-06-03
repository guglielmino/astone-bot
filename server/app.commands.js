import CommandHelper from './commands/command-helper';

import BidCommand from './commands/bid.cmd';
import AuctionListCommand from './commands/auction-list.cmd';
import StartAuctionCommand from './commands/start-auction.cmd.js';
import StartCommand from './commands/start.cmd';

import * as constants from './commands/consts';

export default (chatManager, telegram, managerFactory) => {

	const commandHelper = CommandHelper(telegram);

	// Interactive commands (ie /start, /help, ...)
	const bidCmd = new BidCommand(telegram, managerFactory, commandHelper);
	const listCmd = new AuctionListCommand(telegram, managerFactory, commandHelper);
	// TODO: Resolve provider dependency
	//const startCmd = new StartCommand(telegram, managerFactory, commandHelper);
	chatManager.addCommand(constants.COMMAND_BID, bidCmd);
	chatManager.addCommand(constants.COMMAND_LIST, listCmd);
	//chatManager.addCommand(constants.COMMAND_START, startCom)
	
	// QueryResponse command (ie 'out-of-band' commands on callback button action)
	const startAuctionCmd = new StartAuctionCommand(telegram, managerFactory, commandHelper);
	chatManager.addCommand(constants.QCOMMAND_START_AUCTION, startAuctionCmd, 'QueryResponse');
	chatManager.addCommand(constants.QCOMMAND_BID, bidCmd, 'QueryResponse');

};