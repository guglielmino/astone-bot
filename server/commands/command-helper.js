'use strict';

import MsgEncoder from '../services/utilities/msg-encoder';

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
      return telegram
        .sendMessage({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        });
    },

    /**
     * Extract reciptient data to be used in Telegram send* methods
     * from state
     * @param state
     * @returns {{username: *, chatId: number}}
     */
    recipientFromState: (state) => {
      return { username: state.chat.username, chatId: state.chat.id };
    }

  };
}
