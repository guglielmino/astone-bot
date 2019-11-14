const keyPrefix = 'state:';

export default (client) => {
  const self = {
    setState: (chatId, value) => client
      .setAsync(`${keyPrefix}${chatId}`, JSON.stringify(value)),

    getState: (chatId) => client
      .getAsync(`${keyPrefix}${chatId}`)
      .then((val) => (val ? Promise.resolve(JSON.parse(val)) : null)),

    updateState: (chatId, value) => {
      if (typeof value !== 'object') {
        throw Error("\'value\' must be an object");
      }
      return self.getState(chatId)
        .then((stored) => self
          .setState(chatId, Object.assign(stored, value)))
        .then(() => self
          .getState(chatId));
    },

    exists: (chatId) => client
      .existsAsync(`${keyPrefix}${chatId}`)
      .then((res) => Promise.resolve(res > 0)),


    del: (chatId) => client
      .delAsync(`${keyPrefix}${chatId}`)
  };

  return self;
};
