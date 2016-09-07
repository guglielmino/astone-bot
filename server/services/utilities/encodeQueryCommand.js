import MsgEncoder from './msg-encoder';

export default function encodeQueryCommand(command, data) {
  return new MsgEncoder().encode({
    c: command,
    d: data
  });
}
