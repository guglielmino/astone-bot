'use strict';

export default (userProvider) => {
  return {

    save: (userData) => {
      userProvider.save(userData);
    },

    getAll: () => {
      return userProvider
        .getAll();
    }
  };
};
