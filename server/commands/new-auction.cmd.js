import * as constants from './consts';

export default class NewAuctionCommand {

  constructor(telegram, commandHelper) {
    this._telegram = telegram;
    this._helper = commandHelper;
  }

  execute(state, ...params) {

    this
      ._helper
      .simpleResponse(state.chat.id, 'Ok, write the name of the item that You want to sell')

    return Promise.resolve({ 'state': constants.STATE_WAIT_FOR_NAME });
  }
}
