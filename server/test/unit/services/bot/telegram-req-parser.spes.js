'use strict';

import fs from 'fs';
import chai from 'chai';
import TelegramReqParser from '../../../../services/bot/telegram-req-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

chai.should();
const { expect } = chai;

const readFixture = (fixtureName, cb) => {
  fs.readFile(`${__dirname}/fixtures/${fixtureName}`, (err, data) => {
    if (err) throw err;
    const request = JSON.parse(data.toString());
    cb(request);
  });
};

describe('TelegramReqParser', () => {
  let telegramReqParser;

  beforeEach(() => {
    telegramReqParser = TelegramReqParser();
  });

  describe('#getMessage', () => {
    it('Should get the right message from text request', (done) => {
      readFixture('text-simple-req.json', (request) => {
        const message = telegramReqParser.getMessage(request);

        message.message_id
          .should.be.equal(205);

        done();
      });
    });

    it('Should get the right message from a slash command request', (done) => {
      readFixture('slash-cmd-req.json', (request) => {
        const message = telegramReqParser.getMessage(request);

        message.message_id
          .should.be.equal(202);

        done();
      });
    });

    it('Should get the right message from a query subscribe request', (done) => {
      readFixture('query-subscribe-req.json', (request) => {
        const message = telegramReqParser.getMessage(request);

        message.message_id
          .should.be.equal(204);

        done();
      });
    });

    it('Should get the right message from a query bid request', (done) => {
      readFixture('query-bid-req.json', (request) => {
        const message = telegramReqParser.getMessage(request);

        message.message_id
          .should.be.equal(208);

        done();
      });
    });

    it('Should get the right message from a position request', (done) => {
      readFixture('position-req.json', (request) => {
        const message = telegramReqParser.getMessage(request);

        message.message_id
          .should.be.equal(211);

        done();
      });
    });

    it('Should get the right message from a photo request', (done) => {
      readFixture('photo-req.json', (request) => {
        const message = telegramReqParser.getMessage(request);

        message.message_id
          .should.be.equal(206);

        done();
      });
    });

    it('Should get the right message from a document request', (done) => {
      readFixture('document-req.json', (request) => {
        const message = telegramReqParser.getMessage(request);

        message.message_id
          .should.be.equal(212);

        done();
      });
    });
  });

  describe('#getCommandId', () => {
    it('Should get commandId from slash request', (done) => {
      readFixture('slash-cmd-req.json', (request) => {
        const commandId = telegramReqParser
          .getCommandId(request);

        commandId.commandKey
          .should.be.equal('/list');

        commandId.params.length
          .should.be.equal(0);

        commandId.type
          .should.be.equal('Interactive');
        done();
      });
    });

    it('Should get commandId from query subscribe request', (done) => {
      readFixture('query-subscribe-req.json', (request) => {
        const commandId = telegramReqParser
          .getCommandId(request);

        commandId.commandKey
          .should.be.equal('sa'); // sa encoded Start Auction query command

        commandId.params.length
          .should.be.greaterThan(0);

        commandId.type
          .should.be.equal('QueryResponse');

        commandId.callback_query_id
          .should.not.be.null;

        done();
      });
    });

    it('Should get commandId from photo request', (done) => {
      readFixture('photo-req.json', (request) => {
        const commandId = telegramReqParser
          .getCommandId(request);

        (commandId.commandKey === null)
          .should.be.true;

        commandId.type
          .should.be.equal('State');

        done();
      });
    });

    it('Should get commandId from plain text request', (done) => {
      readFixture('text-simple-req.json', (request) => {
        const commandId = telegramReqParser
          .getCommandId(request);

        (commandId.commandKey === null)
          .should.be.true;

        commandId.type
          .should.be.equal('State');

        done();
      });
    });
  });
});
