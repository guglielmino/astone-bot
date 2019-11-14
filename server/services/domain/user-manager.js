'use strict';

export default (userProvider) => ({

  save: (userData) => {
    userProvider.save(userData);
  },

  getAll: () => userProvider
    .getAll()
});
