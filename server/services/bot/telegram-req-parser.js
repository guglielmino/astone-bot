'use strict';

import MsgEncoder from '../utilities/msg-encoder';

export default () => {

  const isBotCommand = (message) => {
    let ret = false;
    if(message.entities){
        let bot_cmd = message.entities.find((i) => i.type === 'bot_command');
        ret = bot_cmd != null;
    }

    return ret;
  };

  const getSlashCommandId = (message) => {
    let commandId = null;
    const readText = message.text.toLowerCase();
    const cli = readText.startsWith('/') ? readText.split(' ') : [];
    if(cli.length > 0) {
      commandId = {
        commandKey: cli[0],
        params: cli.slice(1),
        type: 'Interactive'
      };
    }
    return commandId;
  };

  const  getQueryCallbackCommandId = (request) => {
    let commandId = null;
    let queryData = new MsgEncoder().decode(request.callback_query.data);
    if(queryData) {
      commandId = {
        commandKey: queryData.c,
        params: queryData.d,
        type: 'QueryResponse',
        callback_query_id: request.callback_query.id
      };
    }
    return commandId;
  };

  const getStateCommandId = (message) => {
    return {
      commandKey: null,
      params: message.photo || message.text,
      type: 'State'
    };
  };

  let self = {
		/**
     * Extract message object from the Telegram request
     * @param request
     * @returns {*}
     */
    getMessage: (request) => {
      return (request.message || request.edited_message) || request.callback_query.message;
    },

		/**
     * Get data to identify command to be executed for the request
     * received (if any)
     * @param request
     * @returns {{}}
     */
    getCommandId: (request) => {
      let ret = {};

      const message = self.getMessage(request);
      if (request.callback_query) {
        ret = getQueryCallbackCommandId(request);
      }
      else if(isBotCommand(message)) {
        ret = getSlashCommandId(message);
      }
      else {
        ret = getStateCommandId(message);
      }
      return ret;
    }

  };

  return self;
}
