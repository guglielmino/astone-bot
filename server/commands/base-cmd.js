import MsgEncoder from '../services/utilities/msg-encoder';

export default class BaseCommand {
	
	constructor(telegram) {
		this._telegram = telegram;
	}

	execute(state, ...params) {
		throw new Error("\'execute\' must be implemented in subclass!");
	}

	// All following method MUST be removed from this class!!!
	encodeQueryCommand(command, data) {
		return new MsgEncoder().encode({
			c: command,
			d: data
		});
	}

	/**
	 * Helper for simple text responses
	 * @param chatId
	 * @param message
	 */
	simpleResponse(chatId, message){
		this._telegram
			.sendMessage({
				chat_id: chatId,
				text: message,
				parse_mode: 'Markdown'
			});
		 return Promise.resolve(null);
	}
}

