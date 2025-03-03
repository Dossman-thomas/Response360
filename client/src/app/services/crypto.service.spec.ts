import { TestBed } from '@angular/core/testing';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should encrypt and return a non-empty string', () => {
    const testData = { message: 'Hello, Encryption!' };
    const result = service.Encrypto(testData);

    expect(result).toBeTruthy();
    
    if (typeof result === 'object' && 'encryptedText' in result) {
      expect(typeof result.encryptedText).toBe('string');
      expect(result.encryptedText.length).toBeGreaterThan(0);
    } else {
      fail('Encryption result is not an object with encryptedText');
    }
  });

  it('should decrypt an encrypted value and match the original data', () => {
    const testData = { message: 'Hello, Encryption!' };
    const encrypted = service.Encrypto(testData);

    if (typeof encrypted === 'object' && 'encryptedText' in encrypted) {
      const decrypted = service.Decrypto(encrypted.encryptedText);
      expect(decrypted).toEqual(testData);
    } else {
      fail('Encryption failed, did not return expected object');
    }
  });

  it('should return an object with an empty string when encrypting an empty value', () => {
    const result = service.Encrypto('');

    expect(result).toBeTruthy();
    
    if (typeof result === 'object' && 'encryptedText' in result) {
      expect(result.encryptedText).toBe('');
    } else {
      fail('Expected an object with encryptedText property');
    }
  });

  it('should return an empty string when decrypting an empty value', () => {
    const result = service.Decrypto('');
    expect(result).toBe('');
  });
});
