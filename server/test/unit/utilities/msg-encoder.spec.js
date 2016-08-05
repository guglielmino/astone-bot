'use strict';

import chai from 'chai';
import sinon from 'sinon';
import MsgEncoder from '../../../services/utilities/msg-encoder';


// Tell chai that we'll be using the "should" style assertions.
chai.should();
let expect = chai.expect;

describe('MsgEncoder', ()=> {
	let encoder;

	beforeEach(() => {
		encoder = new MsgEncoder();
	});

	it('Should return an encoded string when called with an object', () => {
		let sampleObj = {name: "Fabrizio", age: 40};
		let result = encoder.encode(sampleObj);

		result.should.be.a('string');
	});

	it('Should decode an object previous encoded', () => {
		let sampleObj = {name: "Fabrizio", age: 40};
		let result = encoder.encode(sampleObj);
		let decodedObj = encoder.decode(result);
		decodedObj.name.should.be.equal(sampleObj.name);

	});

});
