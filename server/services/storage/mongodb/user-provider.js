import { queryExecutor } from './provider-helper';

const COLLECTION_NAME = 'users';

const UserProvider = (db) => {

  const findDocs = queryExecutor(db, COLLECTION_NAME);

  db.collection(COLLECTION_NAME, (err, col) => {
    col.createIndex({ username: 1 }, { w: 1, unique: true });
  });

  return {

    save(userData) {
      return new Promise((resolve, reject) => {
        db.collection(COLLECTION_NAME, (err, col) => {
          if (err) {
            reject(err);
          }


          col.insertOne(userData, (err, r) => {
            if (err) {
              if (err.code === 11000) {
                col.updateOne({ username: userData.username },
                  { $set: { id: userData.id } },
                  (err, r) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(r.result.ok);
                    }
                  });
              }
              reject(err);
            } else {
              resolve(r.insertedCount);
            }
          });
        });
      });
    },

    updateLang(usename, langCode) {
      return new Promise((resolve, reject) => {
        db.collection(COLLECTION_NAME, (err, col) => {
          if (err) {
            reject(err);
          }
          col.updateOne({ username: usename }, { $set: { lang: langCode } }, (err, r) => {
            if (err) {
              reject(err);
            } else {
              resolve(r.result.ok === 1);
            }
          });
        });
      });
    },

    getAll() {
      return findDocs({});
    }
  };
};

export default UserProvider;