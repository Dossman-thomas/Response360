import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-organizations',
  templateUrl: './manage-organizations.component.html',
  styleUrls: ['./manage-organizations.component.css']
})
export class ManageOrganizationsComponent {

  constructor(private router: Router) {}

  // Navigate to the dashboard
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Navigate to the organization details page
  goToOrganizationDetails() {
    this.router.navigate(['/organization-details']);
  }
}

