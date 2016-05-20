import MongoClient from 'mongodb';
import BidProvider from './bid-provider';
import AuctionProvider from './auction-provider';

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
				console.log('Connected correctly to server');

				this._bidProvider = new BidProvider(this.db);
				this._auctionProvider = new AuctionProvider(this.db);

				resolve(db);
			});
		});
	}

	get bidProvider() {
		return this._bidProvider;
	}

	get auctionProvider() {
		return this._auctionProvider;
	}

}