'use strict';

export function queryExecutor(db, COLLECTION_NAME) {
  return (query) => new Promise((resolve, reject) => {
    db.collection(COLLECTION_NAME, (err, col) => {
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
