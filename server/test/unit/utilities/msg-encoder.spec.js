'use strict';

import chai from 'chai';
import sinon from 'sinon';
import MsgEncoder from '../../../services/utilities/msg-encoder';


// Tell chai that we'll be using the "should" style assertions.
chai.should();
const { expect } = chai;

describe('MsgEncoder', () => {
  let encoder;

  beforeEach(() => {
    encoder = MsgEncoder();
  });

  it('Should return an encoded string when called with an object', () => {
    const sampleObj = { name: 'Fabrizio', age: 40 };
    const result = encoder.encode(sampleObj);

    result.should.be.a('string');
  });

  it('Should decode an object previous encoded', () => {
    const sampleObj = { name: 'Fabrizio', age: 40 };
    const result = encoder.encode(sampleObj);
    const decodedObj = encoder.decode(result);
    decodedObj.name.should.be.equal(sampleObj.name);
  });
});
