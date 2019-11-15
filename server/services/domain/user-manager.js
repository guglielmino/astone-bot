const AuctionManager = (userProvider) => ({

  save: (userData) => {
    userProvider.save(userData);
  },

  getAll: () => userProvider
    .getAll()
});

export default AuctionManager;
