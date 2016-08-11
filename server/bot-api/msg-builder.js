'use strict';

import stampit from 'stampit';

const BaseBuilder = stampit().init(function () {
  this.message = {};

  this.setRecipient = (user) => {
    this.message.chat_id = user.chatId;
    return this;
  };

  this.build = () => {
    if (!this.message.chat_id) throw new Error('Recipient not set');
    return this.message;
  };
});

const MessageBuilder = stampit().init(function () {
  this.setText = (text) => {
    this.message.text = text;
    return this;
  };

  this.setMode = (mode) => {
    this.message.parse_mode = mode;
    return this;
  };
});

const PhotoBuilder = stampit().init(function () {
  this.setPhoto = (photo) => {
    this.message.photo = photo;
    return this;
  };

  this.setCaption = (caption) => {
    this.message.caption = caption;
    return this;
  };
});


exports.messageBuilder = stampit().compose(BaseBuilder, MessageBuilder);
exports.photoBuilder = stampit().compose(BaseBuilder, PhotoBuilder);
