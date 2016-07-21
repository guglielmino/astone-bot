'use strict';

import logger from '../logger';

export default class TelegramChatter {

  constructor(stateManager, telegramRequestParser) {
    this.stateManager = stateManager;
    this.telegramRequestParser = telegramRequestParser;
    this.commands = {};
  }

  processRequest(request) {
    const message = this.telegramRequestParser
      .getMessage(request);

    if(message) {
      this.stateManager
        .exists(message.chat.id)
        .then((exist) => {
          if (!exist) {
            this.stateManager.setState(message.chat.id, {chat: message.chat})
          }
          return this.stateManager.getState(message.chat.id);
        })
        .then((state) => {
          const commandId = this.telegramRequestParser
            .getCommandId(request);

          if (commandId) {
            let command = this._getCommand(commandId.commandKey || state.state, commandId.type);
            if (command) {
              state.callback_query_id = commandId.callback_query_id;
              this._executeCommand(command, state, commandId.params);
            }
          }
        });
    }
  }

  addCommand(key, cmd, type = 'Interactive') {
    this.commands[key.toLowerCase()] = {cmd: cmd, type: type};
  }

  /**
   * Execute command and use returned object to update state (if present)
   * @param state
   * @param data
   * @private
   */
  _executeCommand(command, state, data) {

    command.cmd.execute(state, data)
      .then((res) => {
        if (res) {
          this.stateManager
            .updateState(state.chat.id, res);
        }
      })
      .catch((err) => {
        logger.error("Execute command error: " + err.message);
      });
  }

  _getCommand(key, type) {
    let res = null;
    const lowerKey = key.toLowerCase();
    if (this.commands.hasOwnProperty(lowerKey)) {
      let command = this.commands[lowerKey];
      if (command && command.type === type) {
        res = command;
      }
    }
    return res;
  }
}

