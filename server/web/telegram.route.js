'use strict';

import * as urlConsts from './url-consts'

export default (router, chatter, paypal) => {
	router.post(urlConsts.API_TELEGRAM_UPDATE, async(ctx) => {
		chatter.processRequest(ctx.request.body);
		ctx.status = 200;
	});

	// Es callback paypal http://nowhere.org/return?paymentId=PAY-6P430325F55175532K5C476I&token=EC-5BD73754780107705&PayerID=T4BJ6XB5ZJM6G
	router.get(urlConsts.API_PAYPAL_SUCCESS, async(ctx) => {
		ctx.status = 200;
	});

	router.get(urlConsts.API_PAYPAL_CANCEL, async(ctx) => {
		ctx.status = 200;
	});

	// TODO: Querystring with encrypted auction id to get payment data
	router.get(urlConsts.PAGE_PAYPAL_GETPAYURL, async (ctx) => {

		console.log("TOK "  + ctx.request.query.token);
		await paypal
			.getPayRedirectUrl('A new Bicycle', 123, 'EUR')
			.then((redirect_url) => {
				ctx.status = 301;
				ctx.redirect(redirect_url);
				ctx.body = 'Redirecting to PayPal';
			});
	});
};