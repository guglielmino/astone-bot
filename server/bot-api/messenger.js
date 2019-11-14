'use strict';

export default function (request, access_token) {
  return {
    sendMessage(recipient, message) {
      const url = `https://graph.facebook.com/v2.6/me/messages?access_token=${access_token}`;

      let msg = { ...recipient};
      msg = Object.assign(msg, message);

      const options = {
        method: 'POST',
        uri: url,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(msg)
      };

      return request(options)
        .then((res) => {
          const data = JSON.parse(res.body);
          return Promise.resolve(data);
        });
    }
  };
}
