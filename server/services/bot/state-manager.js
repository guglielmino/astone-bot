'use strict';

const keyPrefix = 'state:';

export default (client) => {

	let self = {
		setState: (chatId, value) => {
			return client
				.setAsync(`${keyPrefix}${chatId}`, JSON.stringify(value));
		},

		getState: (chatId) => {
			return client
				.getAsync(`${keyPrefix}${chatId}`)
				.then((val) => {
					return (val ? Promise.resolve(JSON.parse(val)) : null);
				});
		},

		updateState: (chatId, value) => {
			if (typeof value !== "object") {
				throw Error("\'value\' must be an object");
			}

  		return self.getState(chatId)
				.then((stored) => {

					return self
						.setState(chatId, Object.assign(stored, value));
				})
				.then((res) => {
					return self
						.getState(chatId);
				});
		},

		exists: (chatId) => {
			return client
				.existsAsync(`${keyPrefix}${chatId}`)
				.then((res) => {
					return Promise.resolve(res > 0);
				});
		},


		del: (chatId) => {
			return client
				.delAsync(`${keyPrefix}${chatId}`);

		}
	}

	return self;
}
