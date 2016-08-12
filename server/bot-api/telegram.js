/**
 * Created by fabrizio on 17/03/16.
 */
'use strict';

let Promise = require('bluebird');

class TelegramBot {

  constructor(request, apiKey) {
    this.request = request;
    this.apiKey = apiKey;
  }

  getUpdates(offset, limit, timeout) {
    const url = `https://api.telegram.org/bot${this.apiKey}/getUpdates?offset=${offset}&limit=${limit}&timeout=${timeout}`;

    return this.request(url)
      .then((res) => {
        let data = JSON.parse(res.body);
        return Promise.resolve(data);
      });
  }

  getMe() {
    const url = `https://api.telegram.org/bot${this.apiKey}/getMe`;

    return this.request(url)
      .then((res) => {
        let data = JSON.parse(res.body);
        return Promise.resolve(data);
      });
  }

  sendMessage(msg) {
    let url = `https://api.telegram.org/bot${this.apiKey}/sendMessage`;

    const options = {
      method: 'POST',
      uri: url,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(msg)
    };

    return this.request(options)
      .then((res) => {
        let data = JSON.parse(res.body);
        if (data.ok) {
          return Promise.resolve(data);
        }
        else {
          return Promise.reject(data.description);
        }
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  sendPhoto(photoMsg) {
    let url = `https://api.telegram.org/bot${this.apiKey}/sendPhoto`;

    const options = {
      method: 'POST',
      uri: url,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(photoMsg)
    };

    return this.request(options)
      .then((res) => {
        let data = JSON.parse(res.body);
        if (data.ok) {
          return Promise.resolve(data);
        }
        else {
          return Promise.reject(data.description);
        }
      })
      .catch((err) => {
        Promise.reject(err);
      })
  }

  sendChatAction(chat_id, action) {
    let url = `https://api.telegram.org/bot${this.apiKey}/sendChatAction?chat_id=${chat_id}&action=${action}`;

    return this.request(url)
      .then((res) => {
        let data = JSON.parse(res.body);
        return Promise.resolve(data);
      });
  }

  setWebhook(hook_url) {
    let url = `https://api.telegram.org/bot${this.apiKey}/setWebhook`;

    const options = {
      method: 'POST',
      uri: url,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: hook_url })
    };

    return this.request(url)
      .then((res) => {
        let data = JSON.parse(res.body);
        return Promise.resolve(data);
      });
  }

  answerCallbackQuery(callback_query_id, text = null, show_alert = false) {
    let url = `https://api.telegram.org/bot${this.apiKey}/answerCallbackQuery`;

    const options = {
      method: 'POST',
      uri: url,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        callback_query_id: callback_query_id,
        text: text,
        show_alert: show_alert
      })
    };

    return this.request(options)
      .then((res) => {
        let data = JSON.parse(res.body);
        if (data.ok) {
          return Promise.resolve(data);
        }
        else {
          return Promise.reject(data.description);
        }
      })
      .catch((err) => {
        Promise.reject(err);
      })
  }

  getFile(file_id) {
    const url = `https://api.telegram.org/bot${this.apiKey}/getFile?file_id=${file_id}`;

    return this.request(url)
      .then((res) => {
        let data = JSON.parse(res.body);
        if (data.ok) {
          data.result.file_url = `https://api.telegram.org/file/bot${this.apiKey}/${data.result.file_path}`;
          return Promise.resolve(data.result);
        } else {
          return Promise.reject(data);
        }
      });
  }
}

module.exports = TelegramBot;
