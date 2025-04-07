// organization.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { CryptoService } from './crypto.service';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private apiUrl = 'http://localhost:5000/api/organization'; // Replace with your actual API URL

  constructor(
    private http: HttpClient,
    private cryptoService: CryptoService,
    private router: Router
  ) {}

  // Set the headers for the HTTP requests
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  // Create a new organization
  createOrganization(
    orgName: string,
    registeredAddress: string,
    orgType: string,
    jurisdictionSize: string,
    website: string,
    adminFirstName: string,
    adminLastName: string,
    adminEmail: string,
    adminPhone: string
  ) {
    // retrieve logged in user's ID from local storage
    const userId = localStorage.getItem('userId');
    const decryptedUserId = userId ? this.cryptoService.Decrypt(userId) : null;

    // Encrypt the form data into a single payload
    const encryptedPayload = this.cryptoService.Encrypt({
      orgName,
      registeredAddress,
      orgType,
      jurisdictionSize,
      website,
      adminFirstName,
      adminLastName,
      adminEmail,
      adminPhone,
      decryptedUserId,
    });

    // Send the encrypted payload to the backend
    return this.http.post<any>(
      `${this.apiUrl}/create`,
      { payload: encryptedPayload },
      { headers: this.getHeaders() }
    );
  }

  // Read all organizations
  getAllOrganizations(body: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/read`, body, {
        headers: this.getHeaders(),
      }) // Send the body to the backend
      .pipe(
        map((res) => {
          // Decrypt the encrypted data in the response
          const decryptedData = this.cryptoService.Decrypt(res.data);

          // console.log('Decrypted data: ', decryptedData);

          // Return the decrypted data
          return decryptedData;
        }),
        catchError((error) => {
          // Handle the error and return a user-friendly error message or rethrow
          console.error('Error occurred:', error);
          return throwError(() => new Error('Failed to fetch organizations'));
        })
      );
  }

  // Read a single organization by ID
  getOrganizationById(orgId: string): Observable<any> {
    // Encode encrypted orgId to make it safe for URL
    const encodedOrgId = encodeURIComponent(orgId);

    // Send the encrypted ID to the backend
    return this.http
      .get<any>(`${this.apiUrl}/read/${encodedOrgId}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((response) => {
          // Assuming the encrypted data is in response.data
          const decryptedData = this.cryptoService.Decrypt(response.data);

          // Now return the decrypted data
          return decryptedData;
        })
      );
  }

  // Update an organization
  updateOrganization(
    orgId: string,
    orgName: string,
    registeredAddress: string,
    orgType: string,
    jurisdictionSize: string,
    website: string,
    status: string
  ) {
    // retrieve logged in user's ID from local storage
    const userId = localStorage.getItem('userId');
    const decryptedUserId = userId ? this.cryptoService.Decrypt(userId) : null;

    // Encrypt the form data into a single payload
    const encryptedPayload = this.cryptoService.Encrypt({
      orgName,
      registeredAddress,
      orgType,
      jurisdictionSize,
      website,
      status,
      decryptedUserId,
    });

    // Encode encrypted orgId to make it safe for URL
    const encodedOrgId = encodeURIComponent(orgId);

    // Send the encrypted payload to the backend and return the observable
    return this.http.put<any>(
      `${this.apiUrl}/update/${encodedOrgId}`,
      { payload: encryptedPayload },
      { headers: this.getHeaders() }
    );
  }

  // Delete an organization (soft delete)
  deleteOrganization(orgId: string): Observable<any> {
    // Retrieve logged-in user's encrypted ID from local storage
    const userId = localStorage.getItem('userId');
    const decryptedUserId = userId ? this.cryptoService.Decrypt(userId) : null;
  
    // Encrypt the orgId for the URL
    const encryptedOrgId = this.cryptoService.Encrypt(orgId);
  
    // Ensure that encryptedOrgId is a string (if it's not, extract the string part)
    const orgIdString = typeof encryptedOrgId === 'string' ? encryptedOrgId : encryptedOrgId.payload;
  
    // Encrypt the payload properly, but keep orgId plain (decrypted) for the body
    const encryptedPayload = this.cryptoService.Encrypt({
      orgId, // Plain orgId in the payload, since backend expects the decrypted ID here
      userId: decryptedUserId,
    });
  
    // Encode encrypted orgId to make it safe for URL
    const encodedOrgId = encodeURIComponent(orgIdString);
  
    // Send the encrypted orgId in the URL and the encrypted payload in the body
    return this.http.delete<any>(`${this.apiUrl}/delete/${encodedOrgId}`, {
      headers: this.getHeaders(),
      body: { payload: encryptedPayload },
    });
  }
  
}
