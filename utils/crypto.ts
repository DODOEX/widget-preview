import encUtf8 from 'crypto-js/enc-utf8';
import aes from 'crypto-js/aes';
import { CRYPTO_KEY } from './config';

export function encrypt(message: string) {
  return aes.encrypt(message, CRYPTO_KEY).toString();
}

export function decrypt(message: string) {
  return aes.decrypt(message, CRYPTO_KEY).toString(encUtf8);
}