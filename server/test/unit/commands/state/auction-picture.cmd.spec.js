'use strict';

import chai from 'chai';
import sinon from 'sinon';
import * as constants from '../../../../commands/consts';
import CommandHelper from '../../../../commands/command-helper';
import {ObjectID} from 'mongodb';

chai.should();
const expect = chai.expect;

import AuctionPictureCommand from '../../../../commands/state/auction-picture.cmd';

describe('AuctionPictureCommand', () => {
  let telegram;
  let managerFactory;
  let auctionManager;
  let commandHelper;
  let command;

  beforeEach(() => {
    telegram = {};
    auctionManager = {
      updateAuction: (auctionId, obj) => {
        return Promise.resolve(true);
      }
    };

    managerFactory = {
      getAuctionManager: () => {
        return auctionManager;
      }
    };

    let S3Obj = {
      urlToS3: (url) => {
        return Promise.resolve({Location: "http://testurl.org"});
      }
    };

    telegram.sendMessage = sinon.stub();
    telegram.sendChatAction = sinon.stub();
    telegram.getFile = sinon.stub().returns(Promise.resolve({
      file_id: 'AgADAgAD06cxGw3hLwGb_9jqy3vP7rM1cQ0ABNh-NRlQBdiBNCcAAgI',
      file_url: 'http://sample'
    }));
    commandHelper = sinon.stub(CommandHelper(telegram));
    command = new AuctionPictureCommand(telegram, managerFactory, commandHelper, S3Obj);
  });

  it('Should set state to STATE_WAIT_FOR_MIN_SUB when a picture is received', (done) => {
    command
      .execute({
          chat: {id: 10},
          auctionId: '123444',
          state: constants.STATE_WAIT_FOR_PICTURE
        },
        [
          {
            file_id: "AgADAgAD06cxGw3hLwGb_9jqy3vP7rM1cQ0ABNh-NRlQBdiBNCcAAgI",
            file_size: 1649,
            width: 90,
            height: 64
          },
          {
            file_id: "AgADAgAD06cxGw3hLwGb_9jqy3vP7rM1cQ0ABP7f6Nl3TVFINScAAgI",
            file_size: 17505,
            width: 320,
            height: 227
          }])
      .then((res) => {
        res.state.should.be.equal(constants.STATE_WAIT_FOR_MIN_SUB);
        res.result.should.be.true;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('Should set state to null when a picture is received and state.single is true', (done) => {
    command
      .execute({
          chat: {id: 10},
          auctionId: '123444',
          state: constants.STATE_WAIT_FOR_PICTURE,
          single: true
        },
        [
          {
            file_id: "AgADAgAD06cxGw3hLwGb_9jqy3vP7rM1cQ0ABNh-NRlQBdiBNCcAAgI",
            file_size: 1649,
            width: 90,
            height: 64
          },
          {
            file_id: "AgADAgAD06cxGw3hLwGb_9jqy3vP7rM1cQ0ABP7f6Nl3TVFINScAAgI",
            file_size: 17505,
            width: 320,
            height: 227
          }])
      .then((res) => {
        expect(res.state)
          .to.be.null;

        res.result.should.be.true;
        res.single.should.be.false;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

});
