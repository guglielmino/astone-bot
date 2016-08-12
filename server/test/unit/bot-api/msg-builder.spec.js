'use strict';

import chai from 'chai';
import sinon from 'sinon';

import {messageBuilder, photoBuilder} from '../../../bot-api/msg-builder';

chai.should();
const expect = chai.expect;

describe('Builders', () => {

  describe('messageBuilder', () => {
    let builder;

    beforeEach(()=> {
      builder = messageBuilder();
    });

    it('Should create a Markdown message to be sent with Telegram', () => {
      const message = builder
        .setRecipient({ username: 'guglielmino', chatId: 345 })
        .setText('Markdown *test*')
        .setMode('Markdown')
        .build();

      message.chat_id.should.be.equal(345);
      message.text.should.be.equal('Markdown *test*');
      message.parse_mode.should.be.equal('Markdown');
    });

    it('Should create a message to be sent with Telegram', () => {
      const message = builder
        .setRecipient({ username: 'guglielmino', chatId: 1234 })
        .setText('Plain test')
        .build();

      message.chat_id.should.be.equal(1234);
      message.text.should.be.equal('Plain test');
      expect(message.parse_mode).to.be.undefined;
    });

    it('Should throw if user is\'t set', () => {
      (function () {
        builder
          .setText('This is a test')
          .build();
      }).should.throw('Recipient not set');
    });
  });

  describe('photoBuilder', () => {
    let builder;

    beforeEach(()=> {
      builder = photoBuilder();
    });

    it('Should creare a photo message', () => {
      const photo = builder
        .setRecipient({ username: 'guglielmino', chatId: 4444 })
        .setPhoto('XXDJFWI')
        .setCaption('A caption')
        .build();

      photo.chat_id.should.be.equal(4444);
      photo.photo.should.be.equal('XXDJFWI');
      photo.caption.should.be.equal('A caption');
    });
  });
});
