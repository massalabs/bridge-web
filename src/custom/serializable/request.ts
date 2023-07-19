import {
  Args,
  IDeserializedResult,
  ISerializable,
} from '@massalabs/massa-web3';
import { TokenPair } from './tokenPair';

export class ForwardingRequest implements ISerializable<ForwardingRequest> {
  opId = '';
  caller = '';

  constructor(
    public amount: string = '',
    public receiver: string = '',
    public tokenPair: TokenPair = new TokenPair('', '', 0),
  ) {}

  serialize(): Uint8Array {
    const args = new Args();
    args.addU256(BigInt(this.amount));
    args.addString(this.caller);
    args.addString(this.receiver);
    args.addString(this.opId);
    args.addSerializable(this.tokenPair);
    return new Uint8Array(args.serialize());
  }

  deserialize(
    data: Uint8Array,
    offset: number,
  ): IDeserializedResult<ForwardingRequest> {
    const args = new Args(data, offset);
    this.amount = args.nextU256().toString();
    this.caller = args.nextString();
    this.receiver = args.nextString();
    this.opId = args.nextString();
    this.tokenPair = args.nextSerializable(TokenPair);
    return { instance: this, offset: args.getOffset() };
  }
}
