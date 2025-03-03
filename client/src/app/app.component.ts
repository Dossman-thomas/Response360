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

  testDecryption() {
    // **STEP 1**: Manually paste the encrypted string from Postman here
    const encryptedString = 'ax74J37rCa2b9q67Xd/ZWXbG4sR49n62oNFgz359aqCiXakoujkJ7hITtzcZuxo9EpS58H2h/mmEfHr6cLfEi50I1a588aY0irWsVqX/EFI=:fT9tGTM92A8Rftq/dfNUUA==';

    if (!encryptedString) {
      console.error('⚠️ No encrypted string provided.');
      return;
    }

    try {
      // **STEP 2**: Call the receiveEncryptedData method to decrypt
      const decryptedData = this.cryptoApi.receiveEncryptedData(encryptedString);

      console.log('🔑 Decryption Result:', decryptedData);
    } catch (error) {
      console.error('❌ Error during manual decryption test:', error);
    }
  }
}
