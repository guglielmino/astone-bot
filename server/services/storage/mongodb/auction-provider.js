import {ObjectID} from 'mongodb';

const COLLECTION_NAME = 'auctions';

export default class AuctionProvider {

	constructor(db) {
		this.db = db;
		this.db.collection(COLLECTION_NAME, (err, col) => {
			col.createIndex({description: 'text'});
		});
	}

	save(auctionData) {
		return new Promise((resolve, reject) => {
			this.db.collection(COLLECTION_NAME, (err, col) => {
				if (err) {
					reject(err);
				}

				col.insertOne(auctionData, (err, r) => {
					if (err) {
						reject(err);
					} else {
						resolve(r.insertedCount);
					}
				});
			});
		});
	}

	getAuctionById(auctionId) {
		return new Promise((resolve, reject) => {
			this.db.collection(COLLECTION_NAME, (err, col) => {
				let objId = ObjectID(auctionId);
				col.find({_id: objId})
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
	 * @returns {Promise}
	 */
	getActiveAuctions(date) {
		return this._findDocs({startDate: {$lte: date}});
	}


	/**
	 * Returns all the Auctions with at least a bid
	 * @returns {Promise}
	 */
	getRunningAuctions() {
		return this._findDocs({ lastBid: {$exists : true}});
	}

	search(term) {
		return new Promise((resolve, reject) => {
			this.db.collection(COLLECTION_NAME, (err, col) => {
				col.find({$text: {$search: term}}, {score: {$meta: 'textScore'}})
					.sort({score: {$meta: 'textScore'}})
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
				// TODO: handle bid history
				col.updateOne({_id: ObjectID(auctionId)},
					{
						$set: {
							price: value, bestBidder: user
						},
						$currentDate: {
							lastBid: true
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

				col.updateOne({_id: ObjectID(auctionId)},
					{$addToSet: {subscribers: user}},
					(err, r) => {
						if (err) {
							reject(err);
						} else {
							col.find({_id: ObjectID(auctionId)})
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
		return this._findDocs({username: username});
	}

	/**
	 * Helper for quering for documents 
	 * @param query
	 * @returns {Promise}
	 * @private
	 */
	_findDocs(query) {
		return new Promise((resolve, reject) => {
			this.db.collection(COLLECTION_NAME, (err, col) => {
				col.find(query)
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
}