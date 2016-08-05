import {ObjectID} from 'mongodb';
import {queryExecutor} from './provider-helper';
const COLLECTION_NAME = 'users';

export default class UserProvider {
  constructor(db) {
    this.db = db;
    this.findDocs = queryExecutor(db, COLLECTION_NAME);

    this.db.collection(COLLECTION_NAME, (err, col) => {
      col.createIndex({ username: 1 }, { w: 1, unique: true });
    });
  }

  save(userData) {
    return new Promise((resolve, reject) => {
      this.db.collection(COLLECTION_NAME, (err, col) => {
        if (err) {
          reject(err);
        }


        col.insertOne(userData, (err, r) => {
          if (err) {
            if (err.code === 11000) {
              col.updateOne({username: userData.username},
                {$set: {id: userData.id}},
                (err, r) => {
                  if (err) {
                    reject(err);
                  }
                  else {
                    resolve(r.result.ok);
                  }
                });
            }
            reject(err);
          }
          else {
            resolve(r.insertedCount);
          }
        });
      });
    });
  }

  updateLang(usename, langCode) {
    return new Promise((resolve, reject) => {
      this.db.collection(COLLECTION_NAME, (err, col) => {
        if (err) {
          reject(err);
        }
        col.updateOne({ username: usename }, { $set: { lang: langCode } }, (err, r) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(r.result.ok === 1);
          }
        });
      });
    });
  }

  getAll() {
    return this.findDocs({});
  }
}
