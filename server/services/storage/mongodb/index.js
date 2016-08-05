import MongoClient from 'mongodb';
import AuctionProvider from './auction-provider';
import UserProvider from './user-provider';

export default class StorageProvider {

  constructor() {

  }

  connect(config) {
    if (!config.mongo.uri) {
      throw Error("MongoDB connection not configured, set MONGO_URI env variable");
    }

    return new Promise((resolve, reject) => {
      MongoClient.connect(config.mongo.uri, (err, db) => {
        if (err) {
          reject(err);
        }

        this.db = db;

        this._auctionProvider = new AuctionProvider(this.db);
        this._userProvider = new UserProvider(this.db);

        resolve(db);
      });
    });
  }

  get auctionProvider() {
    return this._auctionProvider;
  }

  get userProvider() {
    return this._userProvider;
  }

}
