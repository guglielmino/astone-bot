'use strict';

import * as urlConsts from './url-consts';

export default (router, auctionManager) => {
  router.get(urlConsts.PAGE_AUCTION_DETAILS, async (ctx) => {
    const auctionId = ctx.params.auid;
    if (!auctionId) {
      ctx.status = 404;
    } else {
      const auction = await auctionManager
        .getAuctionById(auctionId);

      await ctx.render('single', { auction });
    }
  });
};
