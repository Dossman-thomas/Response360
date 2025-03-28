// organization.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    });

    // Send the encrypted payload to the backend
    return this.http
      .post<any>(`${this.apiUrl}/create`, {
        payload: encryptedPayload,
      })
      .subscribe({
        next: (response) => {
          console.log('Organization created successfully:', response);

          this.router.navigate(['/manage-organizations']);
        },
        error: (err) => {
          console.error('Failed to create organization:', err);
        },
      });
  }

  // Read all organizations
  getAllOrganizations(body: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/read`, body) // Send the body to the backend
      .pipe(
        map((res) => {
          // Decrypt the encrypted data in the response
          const decryptedData = this.cryptoService.Decrypt(res.data);

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
    return this.http.get<any>(`${this.apiUrl}/get/${orgId}`).pipe(
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
    // Encrypt the form data into a single payload
    const encryptedPayload = this.cryptoService.Encrypt({
      orgName,
      registeredAddress,
      orgType,
      jurisdictionSize,
      website,
      status,
    });

    // Send the encrypted payload to the backend
    return this.http
      .put<any>(`${this.apiUrl}/update/${orgId}`, {
        payload: encryptedPayload,
      })
      .subscribe({
        next: (response) => {
          console.log('Organization updated successfully:', response);

          this.router.navigate(['/manage-organizations']);
        },
        error: (err) => {
          console.error('Failed to update organization:', err);
        },
      });
  }

  // Delete an organization (soft delete)
  deleteOrganization(orgId: string) {
    // Send a DELETE request to the backend
    return this.http.delete<any>(`${this.apiUrl}/delete/${orgId}`).subscribe({
      next: (response) => {
        console.log('Organization deleted successfully:', response);

        // Navigate to a different page after deletion (e.g., manage organizations)
        this.router.navigate(['/manage-organizations']);
      },
      error: (err) => {
        console.error('Failed to delete organization:', err);
      },
    });
  }
}
