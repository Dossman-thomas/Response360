import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CryptoService } from '../../services/crypto.service';
import { StatsService } from '../../services/stats.service';
import { OrganizationService } from '../../services/organization.service';
import { State } from '@progress/kendo-data-query';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';

// Utils
import { loadOrgDetails } from '../../utils/utils/organization.utils';
import { buildOrgReqBody } from '../../utils/utils/table.utils';

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

  ngOnInit(): void {
    this.getDashboardStats();
    this.loadOrgDetails();
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.body = buildOrgReqBody(state, this.body);
    this.loadOrgDetails();
  }
  

  // Fetch organization details
  private loadOrgDetails(): void {
    loadOrgDetails(
      this.organizationService,
      this.body,
      (gridData: any) => {
        this.gridData = gridData;
      },
      (err: { message: any }) => {
        console.error('Failed to fetch organization details: ', err);
        console.log('Error: ', err.message);
      }
    );
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
