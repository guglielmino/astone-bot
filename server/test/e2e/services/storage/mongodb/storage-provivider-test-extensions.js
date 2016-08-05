'use strict';

import fs from 'fs';
import EJSON from 'mongodb-extended-json';
import StorageProvider from '../../../../../services/storage/mongodb';

StorageProvider.prototype['readFixture'] = function (fixtureFile, cb) {
  const data = fs.readFileSync(__dirname + '/fixtures/' + fixtureFile);
  const fixture = EJSON.parse(data);

  let names = Object.keys(fixture.collections);
  names.forEach(name => {
    this.db.collection(name, (err, collection) => {
      if (err) return cb(err);
      collection.insertMany(fixture.collections[name], cb);
    });
  });
};

StorageProvider.prototype['dropDb'] = function () {
  this.db.collections(function (err, collections) {
    collections.forEach(collection => {
      collection.drop();
    });
  });
};


export default StorageProvider;
