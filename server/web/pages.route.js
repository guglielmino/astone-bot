'use strict';

import * as urlConsts from './url-consts';

export default (router, auctionManager, config) => {

  router.get(urlConsts.PAGE_AUCTION_DETAILS, async(ctx) => {

    let auctionId = ctx.params.auid;
    if (!auctionId) {
      ctx.status = 404;
    }
    else {
      let auction = await auctionManager
        .getAuctionById(auctionId);

      await ctx.render('single', {auction: auction});
    }
  });

};
