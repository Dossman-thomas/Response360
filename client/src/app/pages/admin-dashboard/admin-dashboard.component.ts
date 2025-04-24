import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CryptoService } from '../../services/crypto.service';
import { StatsService } from '../../services/stats.service';
import { OrganizationService } from '../../services/organization.service';
import { State } from '@progress/kendo-data-query';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  constructor(
    private router: Router,
    private cryptoService: CryptoService,
    private statsService: StatsService,
    private organizationService: OrganizationService
  ) {}

  deleteOrganizationId: string | null = null;
  showDeleteModal: boolean = false;
  totalUsers: number = 0;
  totalOrganizations: number = 0;

  ngOnInit(): void {
    this.getDashboardStats();
    this.loadOrgDetails();
  }

  // Kendo Grid settings
  gridData: any = { data: [], total: 0 };
  body: any = {
    page: 1,
    sorts: null,
    filters: null,
    limit: 5,
  };

  // Kendo Grid state
  public state: State = {
    take: 5,
  };

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.body.page = Math.floor(state.skip / state.take) + 1; // Page number
    this.body.limit = state.take; // Items per page

    this.loadOrgDetails(); // Fetch data
  }

  // Fetch organization details
  private loadOrgDetails(): void {
    this.organizationService.getAllOrganizations(this.body).subscribe({
      next: (response: any) => {

        if (Array.isArray(response.rows)) {
          this.gridData = {
            data: response.rows,
            total: response.count || response.rows.length,
          };
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

  // Fetch dashboard stats
  getDashboardStats(): void {
    this.statsService.getDashboardStats().subscribe({
      next: (response: any) => {
        this.totalUsers = response.userCount || 0;
        this.totalOrganizations = response.orgCount || 0;
      },
      error: (err) => {
        console.error('Failed to fetch dashboard stats:', err);
      },
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
