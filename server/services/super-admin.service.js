import { v4 as uuidv4 } from 'uuid';
import { UserModel } from '../database/models/index.js';
import { Sequelize } from 'sequelize';
import { env } from '../config/index.js';

export const createSuperAdminService = async (superAdminData) => {
  const pubkey = env.encryption.pubkey;

  if (!pubkey) {
    throw new Error('Public key is not defined in the environment variables.');
  }

  try {
    const {
      first_name,
      last_name,
      user_email,
      user_phone_number,
      user_password,
    } = superAdminData;

    // Create Super Admin in DB
    const newSuperAdmin = await UserModel.create({
      user_id: uuidv4(),
      first_name: Sequelize.fn('PGP_SYM_ENCRYPT', first_name, pubkey),
      last_name: Sequelize.fn('PGP_SYM_ENCRYPT', last_name, pubkey),
      user_email: Sequelize.fn('PGP_SYM_ENCRYPT', user_email, pubkey),
      user_phone_number: Sequelize.fn(
        'PGP_SYM_ENCRYPT',
        user_phone_number,
        pubkey
      ),
      user_password: user_password,
      user_role: env.roles.s_a, 
      org_id: null,
      is_super_admin: env.booleans.t,
      user_status: env.booleans.t,
    });

    return {
      message: 'Super Admin created successfully!',
      data: newSuperAdmin,
    };
  } catch (error) {
    console.error('Error creating Super Admin:', error);
    throw new Error('Failed to create Super Admin.');
  }
};
