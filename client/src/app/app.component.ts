import { Component } from '@angular/core';
import { CryptoService } from './services/crypto.service';
import { CryptoApiService } from './services/crypto-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private cryptoService: CryptoService,
    private cryptoApi: CryptoApiService
  ) {}

  ngOnInit() {
    const testData = 'Hello, World! Front end works!';

    const encrypted = this.cryptoService.Encrypto(testData);
    console.log('🔒 Encrypted:', encrypted);

    if (encrypted.encryptedText) {
      const decrypted = this.cryptoService.Decrypto(encrypted.encryptedText);
      console.log('🔓 Decrypted:', decrypted);
    }
  }

  testEncryption() {
    const testData = 'Hello, Backend! Front end calling!';

    // Encrypt the test data
    const encrypted = this.cryptoService.Encrypto(testData);

    console.log('🔒 Encrypted:', encrypted);

    if (encrypted.encryptedText) {
      // Send encrypted data, ensuring cryptoApi is never null/undefined
      this.cryptoApi.sendEncryptedData(encrypted.encryptedText).subscribe(
        (response) => {
          console.log('✅ Backend Response:', response);
        },
        (error) => {
          console.error('❌ Error sending encrypted data:', error);
        }
      );
    } else {
      console.error('❌ Encryption failed, no data sent.');
    }
  }
}
