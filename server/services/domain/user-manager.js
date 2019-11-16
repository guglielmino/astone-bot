const UserManager = (userProvider) => ({

  save: (userData) => {
    userProvider.save(userData);
  },

  getAll: () => userProvider
    .getAll()
});

export default UserManager;
