// organization.utils.ts
import { OrganizationService } from '../../services/organization.service';
import { CryptoService } from '../../services/crypto.service';
import { Router } from '@angular/router';

export function loadOrgDetails(
  organizationService: OrganizationService,
  requestBody: any,
  onSuccess: (gridData: { data: any[]; total: number }) => void,
  onError?: (err: any) => void
): void {
  organizationService.getAllOrganizations(requestBody).subscribe({
    next: (response: any) => {
      if (Array.isArray(response.rows)) {
        const gridData = {
          data: response.rows,
          total: response.count || response.rows.length,
        };
        onSuccess(gridData);
      } else {
        console.error('Failed to fetch organization details:', response);
        onError?.(response);
      }
    },
    error: (err) => {
      console.error('Failed to fetch organization details: ', err);
      if (err.message === 'Failed to fetch organizations') {
        console.log('Error: Failed to fetch organizations: ', err.message);
      }
      onError?.(err);
    },
  });
}

export function navToEditOrg(
    orgId: string,
    cryptoService: CryptoService,
    router: Router
  ): void {
    const encryptedOrgId = cryptoService.Encrypt(orgId);
  
    router.navigate(['/organization-details'], {
      queryParams: { mode: 'update', orgId: encryptedOrgId },
    });
  }
