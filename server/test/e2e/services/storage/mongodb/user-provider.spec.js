'use strict';

import chai from 'chai';
import sinon from 'sinon';
import StorageProvider from './storage-provivider-test-extensions';

chai.should();
let expect = chai.expect;

describe('UsersProvider', () => {
  let storageProvider;

  beforeEach((done) => {
    storageProvider = new StorageProvider();
    storageProvider
      .connect({
          mongo: {
            uri: 'mongodb://192.168.99.100:27017/astone-test'
          }
        }
      )
      .then((db) => {
        storageProvider
          .readFixture('all-users.json',
            err => {
              done(err);
            });
      });
  });


  afterEach((done) => {
    storageProvider.dropDb();
    done();
  });

  it('Should returns all registered users', (done) => {

    storageProvider
      .userProvider
      .getAll()
      .then(users => {
        users.length
          .should.be.equal(3);
        done();
      })
      .catch(err => {
        done(err);
      })
  });

});
