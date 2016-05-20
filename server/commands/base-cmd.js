import MsgEncoder from '../services/utilities/msg-encoder';

export default class BaseCommand {
	
	constructor(telegram, i18n) {
		this._telegram = telegram;
		this._i18n = i18n;

	}

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
	}

	/**
	 * Traslate a string using i18n module
	 * @param label
	 * @returns {*}
	 */
	t(label) {
		return this._i18n.__(label);
	}
}

