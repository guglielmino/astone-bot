'use strict';

import chai from 'chai';
import sinon from 'sinon';
import I18nBuild from '../../../services/utilities/i18n';

// Tell chai that we'll be using the "should" style assertions.
chai.should();
const { expect } = chai;

describe('i18n', () => {
  it('Should traslate "Hello ${name}" with "it" messageBundle', () => {
    const en = {
      'Hello {0}': 'Hello {0}'
    };

    const it = {
      'Hello {0}': 'Ciao {0}'
    };

    const name = 'Fabrizio';

    const i18n = I18nBuild({ locale: 'it', defaultCurrency: 'EUR', messageBundle: it });
    const res = i18n`Hello ${name}`;

    res.should.be.equal('Ciao Fabrizio');
  });

  it('Should return original string when translation does not exists', () => {
    const en = {
      'Hello {0}': 'Hello {0}'
    };

    const it = {
      'Hello {0}': 'Ciao {0}'
    };

    const test = 'test';

    const i18n = I18nBuild({ locale: 'it', defaultCurrency: 'EUR', messageBundle: it });
    const res = i18n`${test} string not mapped`;

    res.should.be.equal('test string not mapped');
  });
});
