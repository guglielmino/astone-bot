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

	getActiveAuctions() {
		let now = new Date();
		console.log("date " + now);
		return new Promise((resolve, reject) => {
			this.db.collection(COLLECTION_NAME, (err, col) => {
				col.find({startDate: {$lte: now}})
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
				// TODO: handle bid history
				col.updateOne({_id: ObjectID(auctionId)},
					{$addToSet: {subscribers: user}},
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

	getAuctionsBySubscriber(username) {
		return new Promise((resolve, reject) => {
			this.db.collection(COLLECTION_NAME, (err, col) => {
				col.find({username: username})
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
