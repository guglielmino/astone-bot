'use strict';

import MsgEncoder from '../services/utilities/msg-encoder';
import {messageBuilder} from '../bot-api/msg-builder';

export default (telegram) => {

  return {
    encodeQueryCommand: (command, data) => {
      return new MsgEncoder().encode({
        c: command,
        d: data
      });
    },

    /**
     * Helper for simple text responses
     * @param chatId
     * @param message
     */
    simpleResponse: (chatId, message) => {
      const msg = messageBuilder()
        .setRecipient({ chatId: chatId })
        .setText(message)
        .setMode('Markdown')
        .build();

      return telegram
        .sendMessage(msg);
    },

    /**
     * Message builder for telegram
     * @returns {MessageBuilder}
     */
    messageBuilder: () => {
      return new MessageBuilder();
    }
  };

};
