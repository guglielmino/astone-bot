import msgpack from 'msgpack5';

const { encode, decode } = msgpack();

const encoding = 'base64';

const MsgEncoder = () => ({
  encode(val) {
    const buffer = encode(val);
    return buffer.toString(encoding);
  },
  decode(val) {
    const buf = Buffer.from(val, encoding);
    return decode(buf);
  }
});

export default MsgEncoder;
