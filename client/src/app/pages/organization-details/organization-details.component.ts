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
      admin_phone: ['', [Validators.required, Validators.pattern(/^\+?1?\s?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/)
      ]],
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
    if (modeParam === 'update') {
      this.mode = 'update';
      this.fetchOrganizationDetails();
    } else {
      this.mode = 'create';
    }
  }
  
  fetchOrganizationDetails(): void {
    const orgId = this.route.snapshot.queryParamMap.get('orgId');
    // if (orgId) {
    //   this.organizationService.getOrganizationById(orgId).subscribe((data) => {
    //     this.organizationForm.patchValue(data);
    //     this.org_created_at = data.org_created_at;
    //     this.org_updated_at = data.org_updated_at;
    //     this.org_status = data.org_status;
    //   });
    // }
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
    if (this.organizationForm.valid) {
      const formValues = this.organizationForm.value;

      this.organizationService.createOrganization(
        formValues.org_name,
        formValues.org_address,
        formValues.org_type,
        formValues.jurisdiction_size,
        formValues.org_website,
        formValues.admin_first_name,
        formValues.admin_last_name,
        formValues.admin_email,
        formValues.admin_phone
      );
    } else {
      console.log('Form is invalid');
      alert('Please fill in all required fields.');
    }
  }
}
