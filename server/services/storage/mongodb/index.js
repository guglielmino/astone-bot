import MongoClient from 'mongodb';
import AuctionProvider from './auction-provider';
import UserProvider from './user-provider';

const StorageProvider = () => {
  let auctionProvider = null;
  let userProvider = null;

  return {
    connect(config) {
      if (!config.mongo.uri) {
        throw Error('MongoDB connection not configured, set MONGO_URI env variable');
      }

      return new Promise((resolve, reject) => {
        MongoClient.connect(config.mongo.uri, (err, client) => {
          if (err) {
            reject(err);
          }

          const db = client.db(config.mongo.dbname);

          auctionProvider = AuctionProvider(db);
          userProvider = UserProvider(db);

          resolve(client);
        });
      });
    },

    get auctionProvider() {
      return auctionProvider;
    },

    get userProvider() {
      return userProvider;
    },
  };

};

export default StorageProvider;

