'use strict';

import chai from 'chai';
import sinon from 'sinon';
import I18nBuild from './i18n';

// Tell chai that we'll be using the "should" style assertions.
chai.should();
let expect = chai.expect;

describe('i18n', ()=> {

	it('Should traslate "Hello ${name}" with "it" messageBundle', ()=> {
		let en = {
			"Hello {0}" : "Hello {0}"
		};
		
		let it = {
			"Hello {0}" : "Ciao {0}"
		};

		let name = 'Fabrizio';

		let i18n = I18nBuild({locale: 'it', defaultCurrency: 'EUR', messageBundle: it});
		const res = i18n`Hello ${name}`;

		console.log("res " + res);

		res.should.be.equal('Ciao Fabrizio');
	});

	it('Should return original string when translation does not exists', ()=> {
		let en = {
			"Hello {0}" : "Hello {0}"
		};

		let it = {
			"Hello {0}" : "Ciao {0}"
		};

		let test = 'test';

		let i18n = I18nBuild({locale: 'it', defaultCurrency: 'EUR', messageBundle: it});
		const res = i18n`${test} string not mapped`;

		res.should.be.equal('test string not mapped');
	});

});