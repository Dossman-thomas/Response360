import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-organizations',
  templateUrl: './manage-organizations.component.html',
  styleUrls: ['./manage-organizations.component.css'],
})
export class ManageOrganizationsComponent {
  constructor(private router: Router) {}

  // Navigate to the organization details page
  goToOrganizationDetails() {
    this.router.navigate(['/organization-details']);
  }

  // For "New" button
  onNewOrganization(): void {
    this.router.navigate(['/organization-details'], {
      queryParams: { mode: 'create' },
    });
  }

  // For "Edit" button (pass the organization ID)
  onEditOrganization(orgId: string): void {
    this.router.navigate(['/organization-details'], {
      queryParams: { mode: 'update', id: orgId },
    });
  }
}
