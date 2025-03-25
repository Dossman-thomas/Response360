// organization.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CryptoService } from './crypto.service';
import { Router } from '@angular/router';

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
