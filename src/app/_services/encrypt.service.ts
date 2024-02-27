import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';

@Injectable({
  providedIn: 'root'
})

export class EncryptService {

  tokenFromUI: string = "PUSH!retail@1009";

  constructor() { }

  encryptAES256(requestData) {
    let _key = crypto.enc.Utf8.parse(this.tokenFromUI);
    let _iv = crypto.enc.Utf8.parse(this.tokenFromUI);
    let encrypted = crypto.AES.encrypt(
      JSON.stringify(requestData), _key, {
        keySize: 16,
        iv: _iv,
        mode: crypto.mode.ECB,
        padding: crypto.pad.Pkcs7
      });
    return encrypted.toString();
  }

  decryptAES256(encryptData) {
    let _key = crypto.enc.Utf8.parse(this.tokenFromUI);
    let _iv = crypto.enc.Utf8.parse(this.tokenFromUI);

    let _decrpyt = crypto.AES.decrypt(
      encryptData, _key, {
        keySize: 16,
        iv: _iv,
        mode: crypto.mode.ECB,
        padding: crypto.pad.Pkcs7
      }).toString(crypto.enc.Utf8);

    return _decrpyt;
  }
}
