import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { OrganizationService } from '../../services/organization.service';
import { CryptoService } from '../../services/crypto.service';
import {
  stringOperators,
  booleanOperators,
} from 'src/app/utils/utils/kendoOperators';

@Component({
  selector: 'app-manage-organizations',
  templateUrl: './manage-organizations.component.html',
  styleUrls: ['./manage-organizations.component.css'],
})
export class ManageOrganizationsComponent implements OnInit {
  constructor(
    private router: Router,
    private organizationService: OrganizationService,
    private cryptoService: CryptoService
  ) {}

  showDeleteModal = false;
  deleteOrganizationId: string | null = null;
  searchQuery: string = '';

  public stringOperators = stringOperators;
  public booleanOperators = booleanOperators;

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
    searchQuery: '',
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
    this.body.sorts =
      state.sort?.map((sortElement) => ({
        field: sortElement.field,
        dir: sortElement.dir,
      })) || null;

    // Filter
    this.body.filters =
      state.filter?.filters
        ?.flatMap((item: any) => item.filters || [])
        .map((filter: any) => ({
          field: filter.field,
          operator: filter.operator || 'contains', // Default operator
          value: filter.value,
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
            // statusLabel: org.org_status ? 'Active' : 'Inactive',
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
        console.log('Error: ', err.message);

        if (err.message === 'Failed to fetch organizations') {
          console.log('Error: Failed to fetch organizations: ', err.message);
        }
      },
    });
  }

  onSearch(): void {
    const normalizedQuery = this.searchQuery.trim().toLowerCase();
  
    if (!normalizedQuery) {
      // If input is cleared, remove search filter
      this.body.searchQuery = '';
    } else if ('active'.startsWith(normalizedQuery)) {
      this.body.searchQuery = 'true';
    } else if ('deactivated'.startsWith(normalizedQuery)) {
      this.body.searchQuery = 'false';
    } else {
      this.body.searchQuery = this.searchQuery;
    }
  
    this.body.page = 1;
    this.loadOrgDetails();
  }
  

  // For "New" button
  onNewOrganization(): void {
    this.router.navigate(['/organization-details'], {
      queryParams: { mode: 'create' },
    });
  }

  // Edit organization (get org_id from row data)
  onEditOrganization(orgId: string): void {
    const encryptedOrgId = this.cryptoService.Encrypt(orgId);
    // console.log('Encrypted Org ID:', encryptedOrgId);

    this.router.navigate(['/organization-details'], {
      queryParams: { mode: 'update', orgId: encryptedOrgId }, // Pass orgId in query params
    });
  }

  // Delete organization (get org_id from row data)
  onDeleteOrganization(orgId: string): void {
    this.showDeleteModal = true;
    this.deleteOrganizationId = orgId;
  }

  private resetDeleteModal(): void {
    this.showDeleteModal = false;
    this.deleteOrganizationId = null;
  }

  onConfirmDelete(): void {
    if (this.deleteOrganizationId !== null) {
      // Call the delete service and subscribe to the response
      this.organizationService
        .deleteOrganization(this.deleteOrganizationId)
        .subscribe({
          next: (response) => {
            console.log('Organization deleted successfully:', response);

            // Remove the deleted organization from the gridData array
            this.gridData.data = this.gridData.data.filter(
              (org: any) => org.org_id !== this.deleteOrganizationId
            );

            this.resetDeleteModal(); // Close the delete modal
          },
          error: (err) => {
            console.error('Failed to delete organization:', err);
            // Optionally, show an error message to the user
          },
        });
    }
  }

  // Cancel delete
  onCancelDelete(): void {
    this.resetDeleteModal();
  }
}
