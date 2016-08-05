'use strict';

import chai from 'chai';
import sinon from 'sinon';
import Cipher from '../../../services/utilities/cipher';


// Tell chai that we'll be using the "should" style assertions.
chai.should();
let expect = chai.expect;

describe('Cipher', ()=> {
	let cipher;

	beforeEach(() => {
		cipher = new Cipher();
	});

	it('Should decrypt ciphet text when decrypted with same password', () => {
		const crypted = cipher.encrypt('plain text', 'pass');
		const decrypted = cipher.decrypt(crypted, 'pass');

		'plain text'.should.be.equal(decrypted);
	});


});
