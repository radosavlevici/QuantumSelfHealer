/**
 * Type definitions for crypto-browserify
 * 
 * !!! DNA-PROTECTED TYPE DEFINITIONS - DO NOT COPY !!!
 * Copyright © Ervin Remus Radosavlevici (01/09/1987)
 * Email: ervin210@icloud.com
 */

declare module 'crypto-browserify' {
  export function createHash(algorithm: string): Hash;
  export function createHmac(algorithm: string, key: string | Buffer): Hmac;
  export function randomBytes(size: number): Buffer;
  
  interface Hash {
    update(data: string | Buffer): Hash;
    digest(encoding: 'hex' | 'latin1' | 'base64'): string;
    digest(): Buffer;
  }
  
  interface Hmac {
    update(data: string | Buffer): Hmac;
    digest(encoding: 'hex' | 'latin1' | 'base64'): string;
    digest(): Buffer;
  }
  
  export interface CipherGCM {
    setAAD(buffer: Buffer): CipherGCM;
    getAuthTag(): Buffer;
    update(data: string | Buffer, inputEncoding?: string, outputEncoding?: string): string | Buffer;
    final(outputEncoding?: string): string | Buffer;
  }
  
  export interface DecipherGCM {
    setAAD(buffer: Buffer): DecipherGCM;
    setAuthTag(buffer: Buffer): DecipherGCM;
    update(data: string | Buffer, inputEncoding?: string, outputEncoding?: string): string | Buffer;
    final(outputEncoding?: string): string | Buffer;
  }
  
  export interface Cipher {
    update(data: string | Buffer, inputEncoding?: string, outputEncoding?: string): string | Buffer;
    final(outputEncoding?: string): string | Buffer;
  }
  
  export interface Decipher {
    update(data: string | Buffer, inputEncoding?: string, outputEncoding?: string): string | Buffer;
    final(outputEncoding?: string): string | Buffer;
  }
  
  export function createCipheriv(algorithm: string, key: Buffer | string, iv: Buffer | string): Cipher | CipherGCM;
  export function createDecipheriv(algorithm: string, key: Buffer | string, iv: Buffer | string): Decipher | DecipherGCM;
  
  export interface Sign {
    update(data: string | Buffer): Sign;
    sign(privateKey: string | Buffer, outputFormat: string): Buffer | string;
  }
  
  export interface Verify {
    update(data: string | Buffer): Verify;
    verify(certificate: string | Buffer, signature: string | Buffer, signatureFormat?: string): boolean;
  }
  
  export function createSign(algorithm: string): Sign;
  export function createVerify(algorithm: string): Verify;
  
  export function publicEncrypt(key: string | Buffer, buffer: Buffer): Buffer;
  export function privateDecrypt(key: string | Buffer, buffer: Buffer): Buffer;
  export function privateEncrypt(key: string | Buffer, buffer: Buffer): Buffer;
  export function publicDecrypt(key: string | Buffer, buffer: Buffer): Buffer;
}