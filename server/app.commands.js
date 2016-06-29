import CommandHelper from './commands/command-helper';

import BidCommand from './commands/bid.cmd';
import AuctionListCommand from './commands/auction-list.cmd';
import StartAuctionCommand from './commands/start-auction.cmd';
import StartCommand from './commands/start.cmd';
import NewAuctionCommand from './commands/new-auction.cmd';

import AuctionNameCommand from './commands/state/auction-name.cmd';
import AuctionPriceCommand from './commands/state/auction-price.cmd';

import * as constants from './commands/consts';

export default (chatManager, telegram, managerFactory) => {

	const commandHelper = CommandHelper(telegram);

	// Interactive commands (ie /start, /help, ...)
	const bidCmd = new BidCommand(telegram, managerFactory, commandHelper);
	const listCmd = new AuctionListCommand(telegram, managerFactory, commandHelper);
  const startCmd = new StartCommand(telegram, managerFactory, commandHelper);
	const newAuctionCmd = new NewAuctionCommand(telegram, commandHelper);
  chatManager.addCommand(constants.COMMAND_BID, bidCmd);
	chatManager.addCommand(constants.COMMAND_LIST, listCmd);
  chatManager.addCommand(constants.COMMAND_START, startCmd);
  chatManager.addCommand(constants.COMMAND_NEW_AUCTION, newAuctionCmd);

	// QueryResponse command (ie 'out-of-band' commands on callback button action)
	const startAuctionCmd = new StartAuctionCommand(telegram, managerFactory, commandHelper);
	chatManager.addCommand(constants.QCOMMAND_START_AUCTION, startAuctionCmd, 'QueryResponse');
	chatManager.addCommand(constants.QCOMMAND_BID, bidCmd, 'QueryResponse');

  // State command (ie. executed on state specific values)
  const nameCommand = new AuctionNameCommand(telegram, managerFactory, commandHelper);
  const priceCommand = new AuctionPriceCommand(telegram, managerFactory, commandHelper);
  chatManager.addCommand(constants.STATE_WAIT_FOR_NAME, nameCommand, 'State');

};
