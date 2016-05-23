'use strict';

import chai from 'chai';
import sinon from 'sinon';

chai.should();

const expect = chai.expect;


import StateManager from './state-manager';

describe('StateManager', () => {
	let stateManager;

	beforeEach(()=> {
		stateManager = new StateManager();
	});

	it('Should get state prevously set for key \'sample\'', ()=> {
		stateManager.setState('sample', { name: 1, last: true });

		let state = stateManager.getState('sample');
		state.should.to.haveOwnProperty('name');
		state.should.to.haveOwnProperty('last');
	});

	it('Should return \'undefined\' when try to get inexistent key', ()=> {
		let state = stateManager.getState('fakekey');
		expect(state).to.be.undefined;
	});

	it('Should update state when called with with a new field and value', () => {
		stateManager.setState('sample', { name: 5, last: false });

		let state =stateManager.updateState('sample', { newkey: "newvalue" });
		state.should.to.haveOwnProperty('name');
		state.should.to.haveOwnProperty('last');
		state.should.to.haveOwnProperty('newkey');
	});

	it('Should throw exception when update is called without an object', () => {
		stateManager.setState('sample', { name: 5, last: false });
		expect(()=>{
			stateManager.updateState('sample',  "newvalue" )
		}).to.throws("\'value\' must be an object")
	});
	
	it('Should return \'true\' when exists method called for a valid key', () => {
		stateManager.setState('exkey', { color: "Red", price: 100 });
		let exist = stateManager.exists('exkey');
		exist.should.be.true;
	});

	it('Should return \'false\' when exists method called for not valid key', () => {
		let exist = stateManager.exists('nokey');
		exist.should.be.false;
	});
});