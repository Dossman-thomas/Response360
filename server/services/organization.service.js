// Organization Service - Create Function
import { OrganizationModel } from "../database/models/index.js";
import { UserModel } from "../database/models/index.js";
import { sequelize } from "../config/index.js";
import { env } from "../config/index.js";
import { Sequelize } from "sequelize";
import { decryptService } from "../services/index.js";
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

    // console.log("Decrypted data:", orgData);

    // console.log("Before encryption:", {
    //     orgType: orgData.orgType,
    //     jurisdiction: orgData.jurisdictionSize,
    //     website: orgData.website,
    //   });
      

    // Step 2: Encrypt sensitive data using PGP_SYM_ENCRYPT
    const encryptedOrgName = Sequelize.literal(
      `PGP_SYM_ENCRYPT('${orgData.orgName}', '${pubkey}')`
    );
    const encryptedOrgAddress = Sequelize.literal(
      `PGP_SYM_ENCRYPT('${orgData.registeredAddress}', '${pubkey}')`
    );

    // Create the organization
    const organization = await OrganizationModel.create(
      {
        org_id: uuidv4(),
        org_name: encryptedOrgName,
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
    const encryptedUserPhone = Sequelize.literal(
      `PGP_SYM_ENCRYPT('${orgData.adminPhone}', '${pubkey}')`
    );

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
      statusCode: 201,
      message: "Organization and Admin created successfully",
    };
  } catch (error) {
    console.error("Error in createOrganizationService:", error);
    await transaction.rollback();
    throw error;
  }
};
