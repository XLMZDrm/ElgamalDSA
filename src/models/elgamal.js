import { BigInteger as BigInt } from "jsbn";
import DecryptedValue from "./decrypted-value";
import EncryptedValue from "./encrypted-value";
import * as Errors from "./errors";
import * as Utils from "./utils";
var base64 = require('base-64');
var utf8 = require('utf8');
/**
 * Provides methods for the ElGamal cryptosystem.
 */
export default class ElGamal {
  /**
   * Safe prime number.
   * @type {BigInt}
   * @memberof ElGamal
   */
  p;

  /**
   * Generator.
   * @type {BigInt}
   * @memberof ElGamal
   */
  g;

  /**
   * Public key.
   * @type {BigInt}
   * @memberof ElGamal
   */
  y;

  /**
   * Private key.
   * @type {BigInt}
   * @memberof ElGamal
   */
  x;

  static async generateAsync(primeBits = 512) {
    let q;
    let p;
    do {
      q = await Utils.getBigPrimeAsync(primeBits - 1);
      p = q.shiftLeft(1).add(BigInt.ONE);
    } while (!p.isProbablePrime()); // Ensure that p is a prime

    let g;
    do {
      // Avoid g=2 because of Bleichenbacher's attack
      g = await Utils.getRandomBigIntAsync(new BigInt("3"), p);
    } while (
      g.modPowInt(2, p).equals(BigInt.ONE) ||
      g.modPow(q, p).equals(BigInt.ONE) ||
      // g|p-1
      p.subtract(BigInt.ONE).remainder(g).equals(BigInt.ZERO) ||
      // g^(-1)|p-1 (evades Khadir's attack)
      p.subtract(BigInt.ONE).remainder(g.modInverse(p)).equals(BigInt.ZERO)
    );

    // Generate private key
    const x = await Utils.getRandomBigIntAsync(
      Utils.BIG_TWO,
      p.subtract(BigInt.ONE)
    );

    // Generate public key
    const y = g.modPow(x, p);

    return new ElGamal(p, g, y, x);
  }
  /**
   * Generate a new Elgamal instance with base64 key.
   * @param {string} key Base64 key.
   * @returns 
   */
  static async getElgamalBase64(key) {
    var bytes = base64.decode(key);
    key = utf8.decode(bytes);
    key = JSON.parse(key);
    return new ElGamal(key.p, key.g, key.y, key.x);
  }
  /**
   * Creates a new ElGamal instance.
   * @param {BigInt|string|number} p Safe prime number.
   * @param {BigInt|string|number} g Generator.
   * @param {BigInt|string|number} y Public key.
   * @param {BigInt|string|number} x Private key.
   */
  constructor(p, g, y, x) {
    this.p = Utils.parseBigInt(p);
    this.g = Utils.parseBigInt(g);
    this.y = Utils.parseBigInt(y);
    this.x = Utils.parseBigInt(x);
  }

  isOK() {
    if (!this.p.isProbablePrime()) {
      return false;
    }
    let q = this.p.shiftRight(1);
    if ((this.g.modPowInt(2, this.p).equals(BigInt.ONE) ||
      this.g.modPow(q, this.p).equals(BigInt.ONE) ||
      this.p.subtract(BigInt.ONE).remainder(this.g).equals(BigInt.ZERO) ||
      this.p.subtract(BigInt.ONE).remainder(this.g.modInverse(this.p)).equals(BigInt.ZERO))) {
      return false;
    }
    if (!(this.y.equals(this.g.modPow(this.x, this.p)))) {
      return false;
    }
    if (!(this.x.max(Utils.BIG_TWO) && this.x.min(this.p.subtract(BigInt.ONE)))) {
      return false;
    }
    return true;
  }
  /**
   * Encrypts a message.
   * @param {string|BigInt|number} m Piece of data to be encrypted, which must
   * be numerically smaller than `p`.
   * @param {BigInt|string|number} [k] A secret number, chosen randomly in the
   * closed range `[1, p-2]`.
   * @returns {EncryptedValue}
   */
  async encryptAsync(m, k) {
    if (this.isOK()) {
      const tmpKey =
        Utils.parseBigInt(k) ||
        (await Utils.getRandomBigIntAsync(
          BigInt.ONE,
          this.p.subtract(BigInt.ONE)
        ));
      const mBi = new DecryptedValue(m).bi;
      const p = this.p;

      const a = this.g.modPow(tmpKey, p);
      const b = this.y.modPow(tmpKey, p).multiply(mBi).remainder(p);

      return new EncryptedValue(a.toString(), b.toString());
    } else {
      return null;
    }
  }
  /**
     * Encrypts a message.
     * @param {string|BigInt|number} m Piece of data to be encrypted, which must
     * be numerically smaller than `p`.
     * @param {BigInt|string|number} [k] A secret number, chosen randomly in the
     * closed range `[1, p-2]`.
     * @returns {String:Base64}
     */
  async encryptBase64(m, k) {
    if (this.isOK()) {
      const tmpKey =
        Utils.parseBigInt(k) ||
        (await Utils.getRandomBigIntAsync(
          BigInt.ONE,
          this.p.subtract(BigInt.ONE)
        ));
      const mBi = new DecryptedValue(m).bi;
      const p = this.p;

      const a = this.g.modPow(tmpKey, p);
      const b = this.y.modPow(tmpKey, p).multiply(mBi).remainder(p);

      var result = new EncryptedValue(a.toString(), b.toString());
      var bytes = utf8.encode(JSON.stringify(result));
      var encoded = base64.encode(bytes);
      return encoded;
    } else {
      return null;
    }
  }
  /**
   * Decrypts a message.
   * @param {EncryptedValue} m Piece of data to be decrypted.
   * @throws {MissingPrivateKeyError}
   * @returns {DecryptedValue}
   */
  async decryptAsync(m) {
    if (this.isOK()) {
      // TODO: Use a custom error object
      if (!this.x) throw new Errors.MissingPrivateKeyError();

      const p = this.p;
      const r = await Utils.getRandomBigIntAsync(
        Utils.BIG_TWO,
        this.p.subtract(BigInt.ONE)
      );

      const aBlind = this.g.modPow(r, p).multiply(m.a).remainder(p);
      const ax = aBlind.modPow(this.x, p);

      const plaintextBlind = ax.modInverse(p).multiply(m.b).remainder(p);
      const plaintext = this.y.modPow(r, p).multiply(plaintextBlind).remainder(p);

      return new DecryptedValue(plaintext);
    } else {
      return null;
    }
  }
  /**
 * Decrypts a message.
 * @param {String:Base64} m Piece of data to be decrypted.
 * @throws {MissingPrivateKeyError}
 * @returns {string}
 */
  async decryptBase64(m) {
    if (this.isOK()) {
      if (!this.x) throw new Errors.MissingPrivateKeyError();
      var bytes = base64.decode(m);
      m = utf8.decode(bytes);
      m = JSON.parse(m);
      var encrypt = new EncryptedValue();
      encrypt.a = new BigInt(m.a);
      encrypt.b = new BigInt(m.b);
      const p = this.p;
      const r = await Utils.getRandomBigIntAsync(
        Utils.BIG_TWO,
        this.p.subtract(BigInt.ONE)
      );

      const aBlind = this.g.modPow(r, p).multiply(encrypt.a).remainder(p);
      const ax = aBlind.modPow(this.x, p);

      const plaintextBlind = ax.modInverse(p).multiply(encrypt.b).remainder(p);
      const plaintext = this.y.modPow(r, p).multiply(plaintextBlind).remainder(p);

      var result = new DecryptedValue(plaintext);
      return result.toString();
    } else {
      return null;
    }
  }
  /**
  * Get key.
  * @returns {object}
  */
  getKey() {
    return {
      p: this.p.toString(),
      g: this.g.toString(),
      y: this.y.toString(),
      x: this.x.toString(),
    };
  }
  /**
* Get key (base64).
* @returns {string}
*/
  getKeyBase64() {
    var key = this.getKey();
    var bytes = utf8.encode(JSON.stringify(key));
    var encoded = base64.encode(bytes);
    return encoded;
  }
}
