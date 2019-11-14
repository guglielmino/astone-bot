'use strict';

export default (telegram) => ({
  /**
     * Helper for simple text responses
     * @param chatId
     * @param message
     */
  simpleResponse: (chatId, message) => telegram
    .sendMessage({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    }),

  /**
     * Extract reciptient data to be used in Telegram send* methods
     * from state
     * @param state
     * @returns {{username: *, chatId: number}}
     */
  recipientFromState: (state) => ({ username: state.chat.username, chatId: state.chat.id })

});
