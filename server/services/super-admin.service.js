import { v4 as uuidv4 } from "uuid";
import { UserModel } from "../database/models/index.js";
import { Sequelize } from "sequelize";
import { env } from "../config/index.js";

export const createSuperAdminService = async (superAdminData) => {
  const pubkey = env.encryption.pubkey;

  try {
    const {
      first_name,
      last_name,
      user_email,
      user_phone_number,
      user_password,
      user_created_by, // Optional
    } = superAdminData;

    // Create Super Admin in DB
    const newSuperAdmin = await UserModel.create({
      user_id: uuidv4(),
      first_name: Sequelize.fn("PGP_SYM_ENCRYPT", first_name, pubkey),
      last_name: Sequelize.fn("PGP_SYM_ENCRYPT", last_name, pubkey),
      user_email: Sequelize.fn("PGP_SYM_ENCRYPT", user_email, pubkey),
      user_phone_number: Sequelize.fn(
        "PGP_SYM_ENCRYPT",
        user_phone_number,
        pubkey
      ),
      user_password: user_password,
      user_role: "Super Admin", // Role set explicitly
      org_id: null,
      user_created_by: user_created_by || null,
      is_super_admin: true,
      user_status: true,
    });

    return {
      message: "Super Admin created successfully!",
      data: newSuperAdmin,
    };
  } catch (error) {
    console.error("Error creating Super Admin:", error);
    throw new Error("Failed to create Super Admin.");
  }
};
