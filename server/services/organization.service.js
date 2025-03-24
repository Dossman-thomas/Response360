// Organization Service - Create Function
import { OrganizationModel } from '../database/models/organization.model';
import { UserModel } from '../database/models/user.model';
import { sequelize } from '../config/index';

export const createOrganization = async (orgData) => {
  const transaction = await sequelize.transaction();
  try {
    // Create the organization
    const organization = await OrganizationModel.create({
      org_name: orgData.orgName,
      org_email: orgData.adminEmail,
      org_phone_number: orgData.adminPhone,
      org_status: orgData.status === 'Enabled',
      org_type: orgData.orgType,
      jurisdiction: orgData.jurisdictionSize,
      org_address: orgData.registeredAddress,
      website: orgData.website,
      org_created_by: orgData.createdBy, // Assuming it's coming from the request
    }, { transaction });

    // Create the admin user without hashing the password manually
    await UserModel.create({
      first_name: orgData.adminFirstName,
      last_name: orgData.adminLastName,
      user_email: orgData.adminEmail,
      user_phone_number: orgData.adminPhone,
      user_role: 'Admin',
      org_id: organization.org_id,
      user_password: orgData.password, // Password hashed by beforeCreate hook
      user_created_by: orgData.createdBy,
    }, { transaction });

    await transaction.commit();
    return { message: 'Organization and Admin created successfully', organization };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
