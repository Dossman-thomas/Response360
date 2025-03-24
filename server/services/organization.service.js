// Organization Service - Create Function
import { OrganizationModel } from "../database/models/organization.model";
import { UserModel } from "../database/models/user.model";
import { sequelize } from "../config/index";
import { env } from "../config/index";
import { Sequelize } from "sequelize";
import { decryptService } from "../services/index";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const pubkey = env.encryption.pubkey;

export const createOrganizationService = async (payload) => {
  const transaction = await sequelize.transaction();
  try {
    // Step 1: Decrypt the incoming data
    const orgData = await decryptService(payload);

    if (!orgData) {
      throw new Error(
        "Service: Decryption failed or missing organization data."
      );
    }

    // Step 2: Encrypt sensitive data using PGP_SYM_ENCRYPT
    const encryptedOrgName = Sequelize.literal(
      `PGP_SYM_ENCRYPT('${orgData.orgName}', '${pubkey}')`
    );
    const encryptedOrgEmail = Sequelize.literal(
      `PGP_SYM_ENCRYPT('${orgData.adminEmail}', '${pubkey}')`
    );
    const encryptedOrgPhone = orgData.adminPhone
      ? Sequelize.literal(
          `PGP_SYM_ENCRYPT('${orgData.adminPhone}', '${pubkey}')`
        )
      : null;
    const encryptedOrgAddress = orgData.registeredAddress
      ? Sequelize.literal(
          `PGP_SYM_ENCRYPT('${orgData.registeredAddress}', '${pubkey}')`
        )
      : null;

    // Create the organization
    const organization = await OrganizationModel.create(
      {
        org_id: uuidv4(),
        org_name: encryptedOrgName,
        org_email: encryptedOrgEmail,
        org_phone_number: encryptedOrgPhone,
        org_type: orgData.orgType,
        jurisdiction: orgData.jurisdictionSize,
        org_address: encryptedOrgAddress,
        website: orgData.website,
        // org_created_by: orgData.createdBy, // needs more logic
      },
      { transaction }
    );

    // Step 3: Encrypt admin user data
    const encryptedFirstName = Sequelize.literal(
      `PGP_SYM_ENCRYPT('${orgData.adminFirstName}', '${pubkey}')`
    );
    const encryptedLastName = Sequelize.literal(
      `PGP_SYM_ENCRYPT('${orgData.adminLastName}', '${pubkey}')`
    );
    const encryptedUserEmail = Sequelize.literal(
      `PGP_SYM_ENCRYPT('${orgData.adminEmail}', '${pubkey}')`
    );
    const encryptedUserPhone = orgData.adminPhone
      ? Sequelize.literal(
          `PGP_SYM_ENCRYPT('${orgData.adminPhone}', '${pubkey}')`
        )
      : null;

    // Create the admin user
    await UserModel.create(
      {
        user_id: uuidv4(),
        first_name: encryptedFirstName,
        last_name: encryptedLastName,
        user_email: encryptedUserEmail,
        user_phone_number: encryptedUserPhone,
        user_role: "Admin",
        org_id: organization.org_id,
        user_password: "Admin@123!", // Temporary password
        // user_created_by: orgData.createdBy, // needs more logic
      },
      { transaction }
    );

    await transaction.commit();
    return {
      status: 200,
      message: "Organization and Admin created successfully",
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
