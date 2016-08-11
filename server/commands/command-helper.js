'use strict';

import MsgEncoder from '../services/utilities/msg-encoder';
import { messageBuilder, photoBuilder } from '../bot-api/msg-builder';

export default (telegram) => {

  const builders = {
    message: messageBuilder(),
    photo: photoBuilder()
  };

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
     * Extract reciptient data to be used in Telegram send* methods
     * from state
     * @param state
     * @returns {{username: *, chatId: number}}
     */
    recipientFromState: (state) => {
      return { username: state.chat.username,  chatId: state.chat.id };
    },

    /**
     * Message builder for telegram messages
     * @returns {MessageBuilder}
     */
    builder: (what) => {
      if (what in builders) {
        return builders[what];
      }
      else {
        return null;
      }
    }
  };

};
