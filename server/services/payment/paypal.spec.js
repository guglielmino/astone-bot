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
			client_id: 'F85H8TDWUR4ZGJGP',
			client_secret: 'Awy0iWb24gO1QBYvazZCNpvWgTuaAMvMRjhYLKJJKVQEQkEMEI2KQjTC',
			returnUrl: 'http://nowhere.org/return',
			cancelUrl: 'http://nowhere.org/cancel'
		})
	});

	it('Should authorize a payment in sandbox', (done) => {
		paypal
			.getPayRedirectUrl('A new Bicycle', 123, 'EUR')
			.then((redirect_url) => {
				console.log("redirect url " + redirect_url);
				redirect_url.should.be.a('string');
				done();
			});
	});

});