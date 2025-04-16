import { OrganizationModel, UserModel } from '../database/models/index.js';
import { sequelize } from '../config/index.js';
import { env } from '../config/index.js';
import {
  pagination,
  buildWhereClause,
  buildOrderClause,
  encryptFields,
  decryptFields,
  decryptUserFields,
} from '../utils/index.js';
import { encryptService, decryptService } from '../services/index.js';
import { v4 as uuidv4 } from 'uuid';

const pubkey = env.encryption.pubkey;

// Create Organization Service
export const createOrganizationService = async (payload) => {
  const transaction = await sequelize.transaction();
  try {
    // Decrypt the incoming payload
    const orgData = await decryptService(payload);

    // Check if the decrypted data is valid
    if (!orgData) {
      throw new Error(
        'Service: Decryption failed or missing organization data.'
      );
    }

    // Encrypt destructured sensitive data using the utility function
    const {
      orgName,
      orgEmail,
      orgPhone,
      registeredAddress,
      website,
      logo,
      adminFirstName,
      adminLastName,
      adminEmail,
      adminPhone,
    } = encryptFields(orgData, pubkey);

    // Create the organization
    const organization = await OrganizationModel.create(
      {
        org_id: uuidv4(),
        org_name: orgName,
        org_email: orgEmail,
        org_phone_number: orgPhone,
        org_status: true,
        org_type: orgData.orgType,
        jurisdiction: orgData.jurisdictionSize,
        org_address: registeredAddress,
        website: website,
        logo: logo,
        org_created_by: orgData.decryptedUserId,
      },
      { transaction }
    );

    // Create the admin user
    await UserModel.create(
      {
        user_id: uuidv4(),
        first_name: adminFirstName,
        last_name: adminLastName,
        user_email: adminEmail,
        user_phone_number: adminPhone,
        user_role: 'Admin',
        org_id: organization.org_id,
        user_password: 'Admin@123!', // Temporary password
        user_created_by: orgData.decryptedUserId, // Created by the same user who created the organization
      },
      { transaction }
    );

    await transaction.commit();
    return {
      statusCode: 201,
      message: 'Organization and Admin created successfully',
    };
  } catch (error) {
    console.error('Error in createOrganizationService:', error);
    await transaction.rollback();
    throw error;
  }
};

// Read Organization Service
export const getAllOrganizationsService = async (payload) => {
  try {
    // decrypt the payload
    const decryptedPayload = await decryptService(payload);
    // extract params from payload
    const { page, limit, sorts, filters, searchQuery } = decryptedPayload;

    // build clauses
    const order = buildOrderClause(sorts);
    const where = buildWhereClause({
      filters,
      searchQuery,
      statusQuery: searchQuery,
      pubkey,
    });

    const organizationData = await OrganizationModel.findAndCountAll({
      where,
      order,
      attributes: [
        'org_id',
        ...decryptFields(['org_name', 'org_email', 'org_phone_number'], pubkey),
        'logo',
        'org_status',
        'org_created_at',
        'org_updated_at',
      ],
      ...pagination({ page, limit }),
    });

    const encryptedOrgData = encryptService(organizationData);

    return encryptedOrgData;
  } catch (error) {
    console.error('Error in getAllOrganizationsService:', error);
    if (error.parent) {
      console.error('Detailed DB Error:', error.parent);
    }
    throw error;
  }
};

// Get Organization By ID Service
export const getOrganizationByIdService = async (orgId) => {
  try {
    const foundOrg = await OrganizationModel.findOne({
      where: { org_id: orgId },
      include: [
        {
          model: UserModel,
          as: 'users',
          where: { user_role: 'Admin' }, // Only fetch the admin user associated with this organization
          attributes: decryptUserFields(
            ['first_name', 'last_name', 'user_email', 'user_phone_number'],
            pubkey
          ),
        },
      ],

      attributes: [
        'org_id',
        ...decryptFields(
          [
            'org_name',
            'org_email',
            'org_phone_number',
            'org_address',
            'website',
            'logo',
          ],
          pubkey
        ),
        'org_type',
        'jurisdiction',
        'org_status',
        'org_created_at',
        'org_updated_at',
      ],
    });

    // Check if organization exists
    if (!foundOrg) {
      throw new Error('Organization not found.');
    }

    // Prepare the data object for encryption
    const orgData = {
      orgId: foundOrg.org_id, // Ensuring consistency with camelCase naming
      orgName: foundOrg.org_name,
      orgEmail: foundOrg.org_email,
      orgPhone: foundOrg.org_phone_number,
      orgType: foundOrg.org_type,
      jurisdictionSize: foundOrg.jurisdiction,
      registeredAddress: foundOrg.org_address,
      website: foundOrg.website,
      logo: foundOrg.logo,
      status: foundOrg.org_status,
      orgCreatedAt: foundOrg.org_created_at,
      orgUpdatedAt: foundOrg.org_updated_at,
      adminUser: foundOrg.users.length
        ? {
            firstName: foundOrg.users[0].first_name,
            lastName: foundOrg.users[0].last_name,
            userEmail: foundOrg.users[0].user_email,
            userPhoneNumber: foundOrg.users[0].user_phone_number,
          }
        : null, // In case no admin user is found
    };

    // console.log('orgData.logo: ', orgData.logo);

    // Encrypt the organization data
    const encryptedOrgData = encryptService(orgData);

    return encryptedOrgData;
  } catch (error) {
    console.error('Error in getOrganizationByIdService:', error);
    throw error;
  }
};

// Update Organization Service
export const updateOrganizationService = async (orgId, payload) => {
  try {
    // Decrypt the incoming data
    const orgData = await decryptService(payload);

    if (!orgData) {
      throw new Error(
        'Service: Decryption failed or missing organization data.'
      );
    }

    // console.log('logo path sent from frontend update: ', orgData.logo);

    // Encrypt sensitive data
    const { orgName, orgEmail, orgPhone, registeredAddress, website, logo } =
      encryptFields(orgData, pubkey);

    // Step 3: Update the organization
    const updatedOrganization = await OrganizationModel.update(
      {
        org_name: orgName,
        org_email: orgEmail,
        org_phone_number: orgPhone,
        org_type: orgData.orgType,
        jurisdiction: orgData.jurisdictionSize,
        org_address: registeredAddress,
        website: website,
        logo: logo,
        org_status: orgData.status === 'Disabled' ? false : true,
        org_updated_at: new Date(),
        org_updated_by: orgData.decryptedUserId,
      },
      { where: { org_id: orgId } }
    );

    // If no organization was found
    if (updatedOrganization[0] === 0) {
      throw new Error('Organization not found.');
    }

    return {
      statusCode: 200,
      message: 'Organization updated successfully',
    };
  } catch (error) {
    console.error('Error in updateOrganizationService:', error);
    throw error;
  }
};

// Delete Organization Service
export const deleteOrganizationService = async (orgId, payload) => {
  try {
    // Decrypt the incoming payload (which contains both orgId and userId)
    const decryptedData = await decryptService(payload);
    // Check if the decrypted data is valid
    if (!decryptedData || !decryptedData.userId || !decryptedData.orgId) {
      throw new Error('Service: Decryption failed or missing required data.');
    }

    // Ensure the decrypted orgId matches the requested one
    if (decryptedData.orgId !== orgId) {
      throw new Error('Service: Mismatched organization ID after decryption.');
    }

    // Soft delete the organization
    const [updated] = await OrganizationModel.update(
      {
        org_status: false,
        org_deleted_by: decryptedData.userId,
        org_deleted_at: new Date(),
      },
      {
        where: { org_id: orgId },
      }
    );

    // If no organization was found throw an error
    if (updated === 0) {
      throw new Error('Organization not found or already deleted.');
    }

    return {
      statusCode: 200,
      message: 'Organization soft-deleted successfully',
    };
  } catch (error) {
    console.error('Error in deleteOrganizationService:', error);
    throw error;
  }
};
