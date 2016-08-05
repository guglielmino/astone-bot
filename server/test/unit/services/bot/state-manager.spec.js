'use strict';

import chai from 'chai';
import sinon from 'sinon';

chai.should();

const expect = chai.expect;
import StateManager from '../../../../services/bot/state-manager';
import bluebird from 'bluebird';
import redis from 'redis-mock';

bluebird.promisifyAll(redis.RedisClient.prototype);


describe('StateManager', () => {
	let stateManager;

	beforeEach((done)=> {

		const client = redis.createClient();
		stateManager = StateManager(client);

		stateManager
			.del('sample')
			.then((res) => {
				done();
			});
	});

	it('Should get state prevously set for key \'sample\'', (done)=> {
		stateManager
      .setState('sample', {name: 1, last: true})
			.then((res) => {
				stateManager
					.getState('sample')
					.then((state) => {
						state.should.to.haveOwnProperty('name');
						state.should.to.haveOwnProperty('last');
						done();
					});
			})
			.catch((err) => {
				done(err);
			});

	});

	it('Should return \'null\' when try to get inexistent key', (done)=> {
		stateManager.getState('fakekey')
			.then((state) => {
				expect(state).to.be.null;
				done();
			});
	});

	it('Should update state when called with a new field and value', (done) => {
		stateManager
			.setState('sample', {name: "Sample name", last: false})
			.then((res) => {
				return stateManager.updateState('sample', {newkey: "newvalue"});
			})
			.then((state) => {
				state.should.to.haveOwnProperty('name');
				state.should.to.haveOwnProperty('last');
				state.should.to.haveOwnProperty('newkey');
				done();
			});

	});

	it('Should throw exception when update is called without an object', () => {
		stateManager.setState('sample', {name: 5, last: false});
		expect(()=> {
			stateManager.updateState('sample', "newvalue")
		}).to.throws("\'value\' must be an object");

	});

	it('Should return \'true\' when exists method called for a valid key', (done) => {
		stateManager
			.setState('exkey', {color: "Red", price: 100})
			.then((res) => {
				stateManager.exists('exkey')
					.then((exist) => {
						exist.should.be.true;
						done();
					});
			});

	});

	it('Should return \'false\' when exists method called for not valid key', (done) => {
		let exist = stateManager.exists('nokey')
			.then((exist) => {
				exist.should.be.false;
				done();
			});
	});

	it('Should delete partial state', (done) => {
		stateManager
			.setState('sample', {name: "my name", last: false})
			.then((res) => {
				return stateManager
					.updateState('sample', {last: null});
			})
			.then((res) => {
				return stateManager.getState('sample');
			})
			.then((state) => {
				expect(state.last).to.be.null;
				done();
			})


	});
});
