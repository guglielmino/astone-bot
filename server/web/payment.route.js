'use strict';

import * as urlConsts from './url-consts';
import Cipher from '../services/utilities/cipher';

export default (router, auctionManager, paypal, config) => {
  // Es callback paypal http://nowhere.org/return?paymentId=PAY-6P430325F55175532K5C476I&token=EC-5BD73754780107705&PayerID=T4BJ6XB5ZJM6G
  router.get(urlConsts.API_PAYPAL_SUCCESS, async (ctx) => {
    ctx.status = 200;
  });

  router.get(urlConsts.API_PAYPAL_CANCEL, async (ctx) => {
    ctx.status = 200;
  });

  // TODO: Querystring with encrypted auction id to get payment data
  router.get(urlConsts.PAGE_PAYPAL_GETPAYURL, async (ctx) => {
    console.log(`TOK ${ctx.request.query.token}`);
    const auctionId = new Cipher().decrypt(ctx.request.query.token, config.cipher_password);
    console.log(`Auction Id ${auctionId}`);

    await auctionManager
      .getAuctionById(auctionId)
      .then((auction) => {
        paypal
          .getPayRedirectUrl(auction.title, auction.price, 'EUR')
          .then((redirect_url) => {
            ctx.status = 301;
            ctx.redirect(redirect_url);
            ctx.body = 'Redirecting to PayPal';
          });
      })
      .catch((err) => {
        logger.error(err.message);
        ctx.status = 500;
      });
  });
};
