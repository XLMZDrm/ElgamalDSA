import { BigInteger as BigInt } from 'jsbn';

/**
 * Stores a value which was decrypted by the ElGamal algorithm.
 */
export default class DecryptedValue {
  /**
   * Decrypted message stored as a BigInt.
   * @type BigInt
   * @memberof DecryptedValue
   */
  bi;

  constructor(m) {
    switch (typeof m) {
      case 'string':
        this.bi = new BigInt(new Buffer.from(m).toString('hex'), 16);
        break;
      case 'number':
        this.bi = new BigInt(`${m}`);
        break;
      default:
        this.bi = m;
    }
  }

  toString() {
    return new Buffer.from(this.bi.toByteArray()).toString();
  }
}
