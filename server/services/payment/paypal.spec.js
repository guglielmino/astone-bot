'use strict';

import chai from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import PayPal from './paypal';


// Tell chai that we'll be using the "should" style assertions.
chai.should();
let expect = chai.expect;


describe('PayPal', ()=> {

	let paypal;

	beforeEach(() => {
		paypal = new PayPal({
			env: 'sandbox',
			client_id: 'AWHBsBM4HK1SRTywvW6ZmGFDQbPtLTn23tWT8zpw01balxee3cE9YTfuhKk0TI1TncS-ipt4Q2xfbmVw',
			client_secret: 'ENxzP8R7cEw3YJTHXqL_7m1UIcXVC3SCzmGWGJMzcluvs1G8YnZPzz0w_kOZqdGGtUOwSehb0jrhc83l',
			returnUrl: 'http://nowhere.org/return',
			cancelUrl: 'http://nowhere.org/cancel'
		})
	});

	it('Should authorize a payment in sandbox', (done) => {
		paypal
			.getPayRedirectUrl('A new Bicycle', 123, 'EUR')
			.then((redirect_url) => {
				redirect_url.should.be.a('string');
				done();
			})
      .catch((err) => {
        done(err);
      });
	});

});
