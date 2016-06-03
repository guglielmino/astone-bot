'use strict';

let paypal = require('paypal-rest-sdk');
import Promise from 'bluebird';

Promise.promisifyAll(paypal);
Promise.promisifyAll(paypal.payment);


export default class PayPal {

	constructor({env, client_id, client_secret, returnUrl, cancelUrl}) {
		paypal.configure({
			'mode': env, //sandbox or live
			'client_id': 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM',
			'client_secret': 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM'
		});
		this.returnUrl = returnUrl;
		this.cancelUrl = cancelUrl;

	}

	getPayRedirectUrl(itemDescription, amount, currency) {
		var create_payment_json = {
			"intent": "sale",
			"payer": {
				"payment_method": "paypal"
			},
			"redirect_urls": {
				"return_url": this.returnUrl,
				"cancel_url": this.cancelUrl
			},
			"transactions": [{
				"amount": {
					"currency": currency,
					"total": amount.toFixed(2).toString()
				},
				"description": itemDescription
			}]
		};

		return paypal
			.payment
			.createAsync(create_payment_json)
			.then((payment) => {
				return Promise.resolve(payment.links.find((x) => x.method === 'REDIRECT').href);
			})
			.catch((err) => {
				return Promise.reject(err);
			});
	}


}