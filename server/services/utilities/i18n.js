const typeInfoRegex = /^:([a-z])(\((.+)\))?/;

class I18nBuilder {
	constructor() {
		this._localizers = {
			s /*string*/: v => v.toLocaleString(this.locale),
			c /*currency*/: (v, currency) => (
				v.toLocaleString(this.locale, {
					style: 'currency',
					currency: currency || this.defaultCurrency
				})
			),
			n /*number*/: (v, fractionalDigits) => (
				v.toLocaleString(this.locale, {
					minimumFractionDigits: fractionalDigits,
					maximumFractionDigits: fractionalDigits
				})
			)
		}
	}

	build({locale, defaultCurrency, messageBundle}) {
		this.locale = locale;
		this.defaultCurrency = defaultCurrency;
		this.messageBundle = messageBundle;
		return this.translate;
	}

	translate(literals, ...values) {
		let translationKey = this._buildKey(literals);
		let translationString = this.messageBundle[translationKey];

		if (translationString) {
			let typeInfoForValues = literals.slice(1).map(this._extractTypeInfo);
			let localizedValues = values.map((v, i) => this._localize(v, typeInfoForValues[i]));
			return this._buildMessage(translationString, localizedValues);
		}

		return this._buildMessage(translationKey, values);
	}


	_extractTypeInfo(literal) {
		let match = typeInfoRegex.exec(literal);
		if (match) {
			return {type: match[1], options: match[3]};
		} else {
			return {type: 's', options: ''};
		}
	}

	_localize(value, {type, options}) {
		return this._localizers[type](value, options);
	}

	// e.g. this._buildKey(['', ' has ', ':c in the']) == '{0} has {1} in the bank'
	_buildKey(literals) {
		let stripType = s => s.replace(typeInfoRegex, '');
		let lastPartialKey = stripType(literals[literals.length - 1]);
		let prependPartialKey = (memo, curr, i) => `${stripType(curr)}{${i}}${memo}`;

		return literals.slice(0, -1).reduceRight(prependPartialKey, lastPartialKey);
	}

	_buildMessage(str, ...values) {
		return str.replace(/{(\d)}/g, (_, index) => values[Number(index)]);
	}
}

export default ({locale, defaultCurrency, messageBundle}) => {
	const builder =  new I18nBuilder();
	return builder.build({locale: locale, defaultCurrency: defaultCurrency, messageBundle: messageBundle})
		.bind(builder);
};
