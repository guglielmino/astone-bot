import MsgEncoder from '../utilities/msg-encoder';
import logger from '../logger';

export default class TelegramChatter {

  constructor(stateManager) {
    this.stateManager = stateManager;
    this.commands = {};
  }

  processRequest(request) {
    // TODO: Check if "request.callback_query.message" is needed
    let message = request.message || request.callback_query.message;
    const chatId = message.chat.id;

    this.stateManager
      .exists(chatId)
      .then((exist) => {
        if (!exist) {
          this.stateManager.setState(chatId, {chat: message.chat})
        }
        return this.stateManager.getState(chatId);
      })
      .then((state) => {
        if (message.text)
          this._handleTextRequest(message.text, state);

        if (request.callback_query)
          this._handleQueryRequest(request.callback_query, state);


      });
  }

  addCommand(key, cmd, type = 'Interactive') {
    this.commands[key.toLowerCase()] = {cmd: cmd, type: type};
  }

  _handleQueryRequest(callback_query, state) {
    let queryData = new MsgEncoder().decode(callback_query.data);

    let callback_query_id = callback_query.id;

    logger.debug(`command ${queryData.c} - data ${queryData.d}`);

    let command = this._getCommand(queryData.c, 'QueryResponse');
    if (command) {
      // TODO: Check if callback_query_id dependency can be handled in other ways
      this.stateManager.updateState(state.chat.id, {callback_query_id: callback_query_id})
        .then((state) => {
          this._executeCommand(command, state, queryData.d);
        });

    }
  }

  _handleTextRequest(text, state) {
    const readText = text.toLowerCase();
    const cli = readText.startsWith('/') ? readText.split(' ') : [];

    if (cli.length > 0) {
      logger.debug("Interactive command " + cli[0]);
      let command = this._getCommand(cli[0], 'Interactive');
      if (command) {
        this._executeCommand(command, state, cli.slice(1));
      }
      else {
        logger.debug("Unrecognized command => " + text);
      }
    }
    else if (state.state) {
      this._handleStateCommand(text, state);
    }
  }

  _handleStateCommand(text, state) {
    let command = this._getCommand(state.state, 'State');
    if (command) {
      this._executeCommand(command, state, text);
    }
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

