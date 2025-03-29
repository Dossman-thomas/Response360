import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { OrganizationService } from '../../services/organization.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-manage-organizations',
  templateUrl: './manage-organizations.component.html',
  styleUrls: ['./manage-organizations.component.css'],
})
export class ManageOrganizationsComponent implements OnInit {
  constructor(
    private router: Router,
    private organizationService: OrganizationService
  ) {}

  ngOnInit() {
    this.loadOrgDetails();
  }

  // Kendo Grid Settings
  gridData: any = { data: [], total: 0 };
  body: any = {
    page: 1,
    limit: 10,
    sorts: null,
    filters: null,
  };

  // Kendo Grid State
  public state: State = {
    skip: 0,
    take: 10,
    sort: [],
    filter: {
      logic: 'and',
      filters: [],
    },
  };

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.body.page = Math.floor(state.skip / state.take) + 1; // Page number
    this.body.limit = state.take; // Items per page

    // Sort
    this.body.sorts = state.sort?.map((sortElement) => ({
      field: sortElement.field,
      dir: sortElement.dir,
    })) || null;  

    // Filter
    this.body.filters = state.filter?.filters?.flatMap((item:any) => item.filters || []).map((filter:any) => ({
      field: filter.field,
      operator: filter.operator || 'contains', // Default operator
      value: filter.value
    })) || null;

    console.log('request payload: ', this.body);

    this.loadOrgDetails(); // Fetch data
  }

  // Fetch organization details
  private loadOrgDetails(): void {
    this.organizationService.getAllOrganizations(this.body).subscribe({
      next: (response: any) => {
        // console.log('response: ', response);

        if (Array.isArray(response.rows)) {
          // Flatten user data 
          const formattedData = response.rows.map((org: any) => ({
            ...org,
            user_email: org.users?.[0]?.user_email || 'N/A',
            user_phone_number: org.users?.[0]?.user_phone_number || 'N/A',
          }));

          this.gridData = {
            data: formattedData, 
            total: response.count || response.rows.length,
          }; 
        
          // console.log('Organization details:', this.gridData);
        } else {
          console.error('Failed to fetch organization details:', response);
        }
      },
      error: (err) => {
        console.error('Failed to fetch organization details: ', err);
        console.log( 'Error: ', err.message); 

        if (err.message === 'Failed to fetch organizations') {
          console.log('Error: Failed to fetch organizations: ', err.message);
        }
      },
    });
  }

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
