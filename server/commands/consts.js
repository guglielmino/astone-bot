// Query callback commands
export const QCOMMAND_START_AUCTION = 'sa';
export const QCOMMAND_BID = 'bid';
export const QCOMMAND_SET_TITLE = 'sti';
export const QCOMMAND_SET_DESCR = 'sde';
export const QCOMMAND_SET_PRICE = 'spr';
export const QCOMMAND_SET_PICT = 'spi';
export const QCOMMAND_SET_MINSUB = 'sms';

// Interactive commands
export const COMMAND_LIST = '/list';
export const COMMAND_START = '/start';
export const COMMAND_NEW_AUCTION = '/newauction';
export const COMMAND_HELP = '/help';
export const COMMAND_SET_AUCTION_TITLE = '/settitle';
export const COMMAND_SET_AUCTION_DESCR = '/setdescr';
export const COMMAND_SET_AUCTION_PRICE = '/setprice';
export const COMMAND_SET_AUCTION_PICT = '/setpicture';
export const COMMAND_SET_AUCTION_MINSUB = '/setminsub';


// State constant
export const STATE_WAIT_FOR_NAME = 'state_wait_for_name';
export const STATE_WAIT_FOR_DESC = 'state_wait_for_desc';
export const STATE_WAIT_FOR_PRICE = 'state_wait_for_price';
export const STATE_WAIT_FOR_PICTURE = 'state_wait_for_picture';
export const STATE_WAIT_FOR_MIN_SUB = 'state_wait_for_min_sub';
