export default class TelegramChatter {

	constructor(logger) {
		this.states = {};
		this.commands = {};
		this.logger = logger;
	}

	processRequest(request) {
		let lastupdateId = request.update_id + 1;

		let message = request.message || request.callback_query.message;

		const chatId = message.chat.id;
		if (!this.states[chatId]) {
			this.states[chatId] = {chat: message.chat};
		}

		let state = this.states[chatId];

		if (message.text)
			this._handleTextRequest(message.text, state);

		if (request.callback_query)
			this._handleQueryRequest(request.callback_query, state);

		return lastupdateId;
	}

	_handleQueryRequest(callback_query, state) {
		let data = callback_query.data;
		let waitFor = state.wait_for;
		let callback_query_id = callback_query.id;
		console.log(`wait_for ${waitFor} - data ${data}`);
		let command = this._getCommand(waitFor, 'QueryResponse');
		if (command) {
			// TODO: Check if callback_query_id dependency can be handled in other ways
			state.callback_query_id = callback_query_id;
			try {
				command.cmd.execute(state, data);
			}
			catch(err) {
				this.logger.error(`_handleQueryRequest ${err.description}`);
			}
		}
	}

	_handleTextRequest(text, state) {
		const readText = text.toLowerCase();
		const cli = readText.startsWith('/') ? readText.split(' ') : [];

		if (cli.length > 0) {
			let command = this._getCommand(cli[0], 'Interactive')
			if (command) {
				try {
					command.cmd.execute(state, cli.slice(1));
				}
				catch (err) {
					this.logger.error(`_handleTextRequest ${err.description}`);
				}
			}
			else {
				this.logger.debug("Unrecognized command => " + text);
			}
		}
	}

	_getCommand(key, type) {
		let res = null;
		if (this.commands.hasOwnProperty(key)) {
			let command = this.commands[key];
			if (command && command.type === type) {
				res = command;
			}
		}
		return res;
	}

	addCommand(key, cmd, type = 'Interactive') {
		this.commands[key.toLowerCase()] = {cmd: cmd, type: type};
	}
}

