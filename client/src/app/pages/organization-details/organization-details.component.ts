import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from '../../services/crypto.service';
import { OrganizationService } from '../../services/organization.service';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.css'],
})
export class OrganizationDetailsComponent implements OnInit {
  organizationForm!: FormGroup;
  mode: 'create' | 'update' = 'create';

  org_created_at?: string;
  org_updated_at?: string;
  org_status?: string;
  // adminEmail!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cryptoService: CryptoService,
    private organizationService: OrganizationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.checkMode();
  }

  // Initialize Reactive Form with validation
  initializeForm(): void {
    this.organizationForm = this.fb.group({
      admin_first_name: ['', Validators.required],
      admin_last_name: ['', Validators.required],
      admin_email: ['', [Validators.required, Validators.email]],
      admin_phone: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^\+?1?\s?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/
          ),
        ],
      ],
      org_name: ['', Validators.required],
      org_status: ['Enabled', Validators.required],
      org_type: ['', Validators.required],
      jurisdiction_size: ['Global', Validators.required],
      org_address: ['', Validators.required],
      org_website: [
        '',
        Validators.pattern(/^(https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(\S*)?$/),
      ],
    });
  }

  // Determine mode (create or view)
  checkMode(): void {
    const modeParam = this.route.snapshot.queryParamMap.get('mode');
    const orgIdParam = this.route.snapshot.queryParamMap.get('orgId');
    const decryptedOrgId = orgIdParam ? this.cryptoService.Decrypt(orgIdParam) : null;

    if (modeParam === 'update' && orgIdParam) {
      this.mode = 'update';
      this.fetchOrganizationDetails(decryptedOrgId);
    } else {
      this.mode = 'create';
    }
  }

  fetchOrganizationDetails(orgId: string): void {
    this.organizationService.getOrganizationById(orgId).subscribe((data) => {
      // Patch organization data
      this.organizationForm.patchValue({
        org_name: data.orgName,
        org_type: data.orgType,
        jurisdiction_size: data.jurisdictionSize,
        org_address: data.registeredAddress,
        org_website: data.website,
        org_status: data.status ? 'Enabled' : 'Disabled',
      });

      // Patch admin user data
      if (data.adminUser) {
        this.organizationForm.patchValue({
          admin_first_name: data.adminUser.firstName,
          admin_last_name: data.adminUser.lastName,
          admin_email: data.adminUser.userEmail,
          admin_phone: data.adminUser.userPhoneNumber,
        });
      }

      // Set other fields

      // Format date fields to display in a user-friendly format
      const formatOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      };

      this.org_created_at = new Date(data.orgCreatedAt).toLocaleDateString(
        'en-GB',
        formatOptions
      );
      this.org_updated_at = new Date(data.orgUpdatedAt).toLocaleDateString(
        'en-GB',
        formatOptions
      );
      this.org_status = data.status ? 'Enabled' : 'Disabled';
    });
  }

  // Display error messages
  getErrorMessage(controlName: string): string {
    const control = this.organizationForm.get(controlName);
    if (control?.hasError('required')) return 'This field is required.';
    if (control?.hasError('email')) return 'Please enter a valid email.';
    if (control?.hasError('pattern')) return 'Invalid format.';
    return '';
  }

  // Submit form data
  onSubmit(): void {
    // Mark all controls as touched to trigger validation messages
    Object.values(this.organizationForm.controls).forEach((control) => {
      control.markAsTouched();
      control.updateValueAndValidity(); // Ensure validation runs
    });
  
    // Now check if the form is still invalid
    if (this.organizationForm.invalid) {
      console.log('Form is invalid');
      return; // Stop submission if invalid
    }
  
    const formValues = this.organizationForm.value;
    const orgId = this.route.snapshot.queryParamMap.get('orgId');
  
    console.log('Form values:', formValues);
  
    if (this.mode === 'update' && orgId) {
      this.organizationService
        .updateOrganization(
          orgId, 
          formValues.org_name,
          formValues.org_address,
          formValues.org_type,
          formValues.jurisdiction_size,
          formValues.org_website,
          formValues.org_status
        )
        .subscribe({
          next: (response) => {
            console.log('Organization updated successfully:', response);
            this.router.navigate(['/manage-organizations']);
          },
          error: (err) => {
            console.error('Failed to update organization:', err);
          },
        });
    } else {
      this.organizationService
        .createOrganization(
          formValues.org_name,
          formValues.org_address,
          formValues.org_type,
          formValues.jurisdiction_size,
          formValues.org_website,
          formValues.admin_first_name,
          formValues.admin_last_name,
          formValues.admin_email,
          formValues.admin_phone
        )
        .subscribe({
          next: () => {
            this.router.navigate(['/manage-organizations']);
          },
          error: (err) => {
            console.error('Failed to create organization:', err);
          },
        });
    }
  }

}
