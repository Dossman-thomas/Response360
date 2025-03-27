import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.css']
})
export class OrganizationDetailsComponent implements OnInit {
  organizationForm!: FormGroup;
  mode: 'create' | 'view' = 'create';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
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
      admin_phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      org_name: ['', Validators.required],
      org_status: ['Enabled', Validators.required],
      org_type: ['', Validators.required],
      jurisdiction_size: ['Global', Validators.required],
      org_address: ['', Validators.required],
      org_website: ['', Validators.pattern(/^(https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(\S*)?$/)]
    });
  }

  // Determine mode (create or view)
  checkMode(): void {
    const modeParam = this.route.snapshot.queryParamMap.get('mode');
    if (modeParam === 'create') {
      this.mode = 'create';
    } else {
      this.mode = 'view';
      this.organizationForm.disable(); // Disable form for view mode
    }
  }

  // Display error messages
  getErrorMessage(controlName: string): string {
    const control = this.organizationForm.get(controlName);
    if (control?.hasError('required')) return 'This field is required.';
    if (control?.hasError('email')) return 'Please enter a valid email.';
    if (control?.hasError('pattern')) return 'Invalid format.';
    return '';
  }

  // Encrypt the form data
  encryptData(data: any): string {
    // Your encryption logic here
    return JSON.stringify(data); // Placeholder for your actual encryption
  }

  // Submit form data
  onSubmit(): void {
    if (this.organizationForm.valid) {
      const encryptedPayload = this.encryptData(this.organizationForm.value);
      console.log('Encrypted Data:', encryptedPayload);
      // Call your API service here
    } else {
      console.log('Form is invalid');
    }
  }

  // Navigate back to manage organizations
  onCancel(): void {
    this.router.navigate(['/manage-organizations']);
  }
}
