import {ObjectID} from 'mongodb';
import {queryExecutor} from './provider-helper';

const COLLECTION_NAME = 'auctions';

export default class AuctionProvider {

  constructor(db) {
    this.db = db;
    this.findDocs = queryExecutor(db, COLLECTION_NAME);
    this.db.collection(COLLECTION_NAME, (err, col) => {
      col.createIndex({ description: 'text' });
      col.createIndex({ title: 1 }, { w: 1, unique: true });
    });
  }

  save(auctionData) {
    return new Promise((resolve, reject) => {
      this.db.collection(COLLECTION_NAME, (err, col) => {
        if (err) {
          reject(err);
        }

        let doc = Object.assign({
          createdAt: new Date()
        }, auctionData);

        col.insertOne(doc, (err, r) => {
          if (err) {
            reject(err);
          } else {
            resolve(r.insertedId);
          }
        });
      });
    });
  }

  getAuctionById(auctionId) {
    return new Promise((resolve, reject) => {
      this.db.collection(COLLECTION_NAME, (err, col) => {
        let objId = ObjectID(auctionId);
        col.find({ _id: objId })
          .toArray((err, docs) => {
            if (err) {
              reject(err);
            } else {
              if (docs.length !== 1)
                reject(new Error("Query returned wrong number of elements"));
              else
                resolve(docs[0]);
            }
          });

      });
    });
  }

  /**
   * Get all active auctions, active means with a startDate less or equal date
   * and not closed
   * @returns {Promise}
   */
  getActiveAuctions(date) {
    const query = {
      $and: [
        { startDate: { $lte: date } },
        {
          $or: [
            { closed: false },
            { closed: { $exists: false } }
          ]
        }
      ]
    };

    return this.findDocs(query);
  }

  /**
   * Get auctions waiting for approvation
   */
  getNewAuctions() {
    const query = {
      startDate: { $exists: false }
    };

    return this.findDocs(query);
  }

  /**
   * Returns all the Auctions with at least a bid
   * @returns {Promise}
   */
  getRunningAuctions() {
    const query = {
      $and: [
        { lastBid: { $exists: true } },
        {
          $or: [
            { closed: false },
            { closed: { $exists: false } }
          ]
        }
      ]
    };

    return this.findDocs(query);
  }

  /**
   * Get all closed auctions, ie. the ones with closed=true having the state passed
   * as second argument
   * @returns {Promise}
   */
  getClosedInState(date, state) {
    const query = {
      $and: [
        { startDate: { $lte: date } },
        { closed: true },
        { state: state }
      ]
    };

    return this.findDocs(query);
  }

  /**
   * Returns the auctions starting in "minutes" from the date
   * Ie. passing as date 2016-01-01 10:00  and minutes 5 it returns
   * all the auctions with startDate 2016-01-01 10:05
   * @param date
   * @param minutes
   */
  getStarting(date, minutes) {
    const startRange = new Date(date.getTime() + (minutes * 60000));
    const endRange = new Date(startRange.getTime() + (1 * 60000));

    const query = {
      $and: [
        { startDate: { $gte: startRange, $lte: endRange } },
        {
          $or: [
            { closed: false },
            { closed: { $exists: false } }
          ]
        }
      ]
    };

    return this.findDocs(query);
  }

  /**
   * Get auctions owned by a username
   * @param username
   */
  getAuctionsByOwner(username) {
    const query = {
      $and: [
        { username: username },
        {
          $or: [
            { closed: false },
            { closed: { $exists: false } }
          ]
        }
      ]
    };

    return this.findDocs(query);
  }


  search(term) {
    return new Promise((resolve, reject) => {
      this.db.collection(COLLECTION_NAME, (err, col) => {
        col.find({ $text: { $search: term } }, { score: { $meta: 'textScore' } })
          .sort({ score: { $meta: 'textScore' } })
          .toArray((err, docs) => {
            if (err) {
              reject(err);
            } else {
              resolve(docs);
            }
          });
      });
    });
  }

  addBid(auctionId, user, value) {
    return new Promise((resolve, reject) => {
      this.db.collection(COLLECTION_NAME, (err, col) => {
        if (err) {
          reject(err);
        }

        col.updateOne({ _id: ObjectID(auctionId) },
          {
            $set: {
              price: value, bestBidder: user, lastBid: new Date()
            }
          },
          (err, r) => {
            if (err) {
              reject(err);
            } else {

              resolve(r.result.ok === 1);
            }

          });
      });
    });
  }

  addSubscriberToAuction(auctionId, user) {
    return new Promise((resolve, reject) => {
      this.db.collection(COLLECTION_NAME, (err, col) => {
        if (err) {
          reject(err);
        }

        col.updateOne({ _id: ObjectID(auctionId) },
          { $addToSet: { subscribers: user } },
          (err, r) => {
            if (err) {
              reject(err);
            } else {
              col.find({ _id: ObjectID(auctionId) })
                .limit(1)
                .next((err, doc) => {
                  if (err) {
                    reject(err);
                  }
                  else {
                    resolve(doc);
                  }
                });

            }
          });
      });
    });
  }

  getAuctionsBySubscriber(username) {
    return this.findDocs({ username: username });
  }

  closeAuction(auctionId) {
    return new Promise((resolve, reject) => {
      this.db.collection(COLLECTION_NAME, (err, col) => {
        if (err) {
          reject(err);
        }

        col.updateOne({ _id: ObjectID(auctionId) },
          {
            $set: { closed: true, state: 'WAIT_FOR_PAYMENT', closeDate: new Date() }
          },
          (err, r) => {
            if (err) {
              reject(err);
            } else {
              resolve(r.result.ok == 1);
            }
          });
      });
    });
  }

  updateAuction(auctionId, data) {
    return new Promise((resolve, reject) => {
      this.db.collection(COLLECTION_NAME, (err, col) => {
        if (err) {
          reject(err);
        }
        col.updateOne({ _id: ObjectID(auctionId) },
          {
            $set: data
          },
          (err, r) => {
            if (err) {
              reject(err);
            } else {
              resolve(r.result.ok === 1);
            }
          });
      });
    });
  }
}
