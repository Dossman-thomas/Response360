import { UserModel } from '../database/models/index.js';
import { env } from '../config/index.js';
import { encryptService, decryptService } from './index.js';

const pubkey = env.encryption.pubkey;

export const getUserByEmailService = async (payload) => {
  try {
    const decryptedPayload = await decryptService(payload);
    const { email } = decryptedPayload;

    const sequelize = UserModel.sequelize;
    const foundUser = await UserModel.findOne({
      attributes: [
        'user_id',
        [
          sequelize.literal(`PGP_SYM_DECRYPT(first_name::bytea, '${pubkey}')`),
          'first_name',
        ],
        [
          sequelize.literal(`PGP_SYM_DECRYPT(user_email::bytea, '${pubkey}')`),
          'user_email',
        ],
      ],
      where: sequelize.where(
        sequelize.literal(`PGP_SYM_DECRYPT(user_email::bytea, '${pubkey}')`),
        email
      ),
    });

    if (!foundUser) {
      const error = new Error('User not found.');
      error.status = 404;
      throw error;
    }

    return encryptService(foundUser);
  } catch (error) {
    console.error('Error fetching user by email:', error);
    if (error.status) throw error;
    throw new Error('Failed to fetch user.');
  }
};
