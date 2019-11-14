import MsgEncoder from './msg-encoder';

export default function encodeQueryCommand(command, data) {
  return MsgEncoder().encode({
    c: command,
    d: data
  });
}
