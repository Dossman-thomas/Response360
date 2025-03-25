// Organization Service - Create Function
import { OrganizationModel, UserModel } from "../database/models/index.js";
// import { UserModel } from "../database/models/index.js";
import { sequelize } from "../config/index.js";
import { env } from "../config/index.js";
import { Sequelize, Op } from "sequelize";
import { pagination } from "../utils/index.js";
import { decryptService } from "../services/index.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const pubkey = env.encryption.pubkey;

// Create Organization Service
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

// Read Organization Service
export const getAllOrganizationsService = async ({
    page,
    limit,
    sorts,
    filters,
    searchQuery = "",
  }) => {
    try {
      const order =
        sorts && sorts.length > 0
          ? sorts
              .filter((sort) => sort.dir)
              .map((sort) => [
                sort.field.includes("user_") ? UserModel : OrganizationModel,
                sort.field,
                sort.dir.toUpperCase(),
              ])
          : [[OrganizationModel, "createdAt", "DESC"]];
  
      const operatorMapping = {
        contains: Op.iLike,
        doesnotcontain: Op.notiLike,
        eq: Op.eq,
        neq: Op.ne,
        startswith: Op.startsWith,
        endswith: Op.endsWith,
        greaterThan: Op.gt,
        lessThan: Op.lt,
        greaterThanOrEquals: Op.gte,
        lessThanOrEquals: Op.lte,
      };
  
      const where = {
        [Op.and]: [
          ...(filters?.length
            ? filters.map((filter) => {
                const operator = operatorMapping[filter.operator] || Op.eq;
                const value =
                  filter.operator === "contains" ||
                  filter.operator === "doesnotcontain"
                    ? `%${filter.value}%`
                    : filter.value;
  
                if (filter.field.startsWith("user_")) {
                  return {
                    [`$UserModel.${filter.field.replace("user_", "")}$`]: {
                      [operator]: value,
                    },
                  };
                } else {
                  return {
                    [filter.field]: { [operator]: value },
                  };
                }
              })
            : []),
          searchQuery
            ? {
                [Op.or]: [
                  Sequelize.where(
                    Sequelize.fn(
                      "PGP_SYM_DECRYPT",
                      Sequelize.col("org_name"),
                      pubkey
                    ),
                    { [Op.iLike]: `%${searchQuery}%` }
                  ),
                  Sequelize.where(
                    Sequelize.fn(
                      "PGP_SYM_DECRYPT",
                      Sequelize.col("UserModel.user_email"),
                      pubkey
                    ),
                    { [Op.iLike]: `%${searchQuery}%` }
                  ),
                ],
              }
            : {},
        ],
      };
  
      const organizations = await OrganizationModel.findAndCountAll({
        where,
        include: [
          {
            model: UserModel,
            as: "users",
            attributes: [
              [
                Sequelize.fn(
                  "PGP_SYM_DECRYPT",
                  Sequelize.col("UserModel.user_email"),
                  pubkey
                ),
                "user_email",
              ],
              [
                Sequelize.fn(
                  "PGP_SYM_DECRYPT",
                  Sequelize.col("UserModel.user_phone_number"),
                  pubkey
                ),
                "user_phone_number",
              ],
            ],
          },
        ],
        attributes: [
          "org_id",
          [
            Sequelize.fn(
              "PGP_SYM_DECRYPT",
              Sequelize.col("org_name"),
              pubkey
            ),
            "org_name",
          ],
          "org_status",
          "createdAt",
          "updatedAt",
        ],
        order,
        ...pagination({ page, limit }),
      });
  
      return organizations;
    } catch (error) {
      console.error("Error in getAllOrganizationsService:", error);
      throw error;
    }
  };
  

// Update Organization Service
export const updateOrganizationService = async (orgId, payload) => {
  try {
    // Step 1: Decrypt the incoming data
    const orgData = await decryptService(payload);

    if (!orgData) {
      throw new Error(
        "Service: Decryption failed or missing organization data."
      );
    }

    // Step 2: Encrypt sensitive data
    const encryptedOrgName = Sequelize.literal(
      `PGP_SYM_ENCRYPT('${orgData.orgName}', '${pubkey}')`
    );
    const encryptedOrgAddress = Sequelize.literal(
      `PGP_SYM_ENCRYPT('${orgData.registeredAddress}', '${pubkey}')`
    );

    // Step 3: Update the organization
    const updatedOrganization = await OrganizationModel.update(
      {
        org_name: encryptedOrgName,
        org_type: orgData.orgType,
        jurisdiction: orgData.jurisdictionSize,
        org_address: encryptedOrgAddress,
        website: orgData.website,
        org_status: orgData.status,
      },
      { where: { org_id: orgId } }
    );

    // If no organization was found
    if (updatedOrganization[0] === 0) {
      throw new Error("Organization not found.");
    }

    return {
      statusCode: 200,
      message: "Organization updated successfully",
    };
  } catch (error) {
    console.error("Error in updateOrganizationService:", error);
    throw error;
  }
};

// Delete Organization Service
export const deleteOrganizationService = async (orgId) => {
  try {
    // Step 1: Update org_status to false
    const [updated] = await OrganizationModel.update(
      {
        org_status: false,
      },
      {
        where: { org_id: orgId },
      }
    );

    // If no organization was found to update
    if (updated === 0) {
      throw new Error("Organization not found.");
    }

    // Step 2: Perform the soft delete using destroy method (this will automatically set deletedAt because paranoid is true)
    const deletedOrganization = await OrganizationModel.destroy({
      where: { org_id: orgId },
    });

    // If no organization was found to delete (this could be redundant, but for safety)
    if (deletedOrganization === 0) {
      throw new Error("Organization not found for deletion.");
    }

    return {
      statusCode: 200,
      message: "Organization soft-deleted successfully",
    };
  } catch (error) {
    console.error("Error in deleteOrganizationService:", error);
    throw error;
  }
};
