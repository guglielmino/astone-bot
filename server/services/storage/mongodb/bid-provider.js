const COLLECTION_NAME = 'bids';

export default class BidProvider {
  constructor(db) {
    this.db = db;
    this.db.collection(COLLECTION_NAME, (err, col) => {
      
    });
  }

  save(bidData) {
    return new Promise((resolve, reject) => {
      this.db.collection(COLLECTION_NAME, (err, col) => {
        if (err) {
          reject(err);
        }

        col.insertOne(bidData, (err, r) => {
          if (err) {
            reject(err);
          } else {
            resolve(r.insertedCount);
          }
        });
      });
    });
  }

  getBids(username) {
    return new Promise((resolve, reject) => {
      this.db.collection(COLLECTION_NAME, (err, col) => {
        col.find({ username: username }).toArray((err, docs) => {
          if (err) {
            reject(err);
          } else {
            resolve(docs);
          }
        });
      });
    });
  }

  

  remove(data) {
    return new Promise((resolve, reject) => {
      this.db.collection(COLLECTION_NAME, (err, col) => {
        if (err) {
          reject(err);
        }

        col.remove({ username: data.username, appId: data.appId }, {safe: true}, (error, res) => {

          if (error) {
            reject(error);
          } else {
            resolve(res);
          }

        });
      });
    });
  }

  updateApp(appId, updates) {
    return new Promise((resolve, reject) => {
      this.db.collection(COLLECTION_NAME, (err, col) => {
        if (err) {
          reject(err);
        }

        col.updateOne({ appId: appId},
          { $set: updates },
          (err, r) => {
          if (err) {
            reject(err);
          } else {
            resolve(r);
          }
        });
      });
    });
  }
}
