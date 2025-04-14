import { UserModel } from "../database/models/index.js";
import { Sequelize } from "sequelize";
import { env } from "../config/index.js";

const pubkey = env.encryption.pubkey;

export const getUserByEmailService = async (email) => {
  try {
    const foundUser = await UserModel.findOne({
      where: Sequelize.where(
        Sequelize.fn("PGP_SYM_DECRYPT", Sequelize.col("user_email"), pubkey),
        email
      ),
    });

    if (!foundUser) {
      return null;
    }

    return foundUser;
    
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error("Failed to fetch user.");
  }
};
