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

  // frontend -> frontend encryption/decryption test
  ngOnInit() {
    const testData = 'Hello, World! Front end works!';

    const encrypted = this.cryptoService.Encrypto(testData);
    console.log('🔒 Encrypted:', encrypted);

    if (encrypted.encryptedText) {
      const decrypted = this.cryptoService.Decrypto(encrypted.encryptedText);
      console.log('🔓 Decrypted:', decrypted);
    }
  }

  // frontend -> backend encryption/decryption test
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

  // backend -> frontend encryption/decryption test
  testDecryption() {
    // **STEP 1**: Manually paste the encrypted string from Postman here
    const encryptedString =
      'HhP+PHw5FDd0nY/E6j1rBwWjIEbdkf7aEKrq5/lnmf5X+wO5ARVdU0hDE0+Fv6hkTBewhwj7h+5uOvHk1bGRlhlToAbBFMrL1qH8oE7Yy+g=:jfrWh0wrZ8h8S3Gifmsh2w==';

    if (!encryptedString) {
      console.error('⚠️ No encrypted string provided.');
      return;
    }

    try {
      // **STEP 2**: Call the receiveEncryptedData method to decrypt
      const decryptedData =
        this.cryptoApi.receiveEncryptedData(encryptedString);

      console.log('🔑 Decryption Result:', decryptedData);
    } catch (error) {
      console.error('❌ Error during manual decryption test:', error);
    }
  }
}
