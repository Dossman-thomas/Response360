import { UserModel } from '../database/models/index.js';
import { env } from '../config/index.js';
import { encryptService, decryptService } from './index.js';
import { decryptFields, decryptSensitiveData } from '../utils/index.js';

const pubkey = env.encryption.pubkey;

export const getUserByEmailService = async (payload) => {
  try {
    const decryptedPayload = await decryptService(payload);
    const { user_email: email } = decryptedPayload;

    const sequelize = UserModel.sequelize;
    const [decryptedExpr] = decryptSensitiveData('user_email', pubkey);
    const foundUser = await UserModel.findOne({
      attributes: [
        'user_id',
        ...decryptFields(['first_name', 'user_email'], pubkey),
      ],
      where: sequelize.where(
        decryptedExpr,
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
