var msgpack = require('msgpack5')();

const encoding = 'base64';

export default class MsgEncoder {

	encode(val) {
		let buffer = msgpack.encode(val);

		const res = buffer.toString(encoding);
		return res;
	}
	
	decode(val) {
		var buf = new Buffer(val, encoding);
		return msgpack.decode(buf);
	}

}