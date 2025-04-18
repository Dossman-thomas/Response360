import { getUserByEmailService } from '../services/index.js';
import { response } from '../utils/index.js';
import { messages } from '../messages/index.js';

export const getUserByEmailController = async (req, res) => {
  const { payload } = req.body;

  if (!payload) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const foundUser = await getUserByEmailService(payload);

    if (!foundUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // TEMP: return full user for testing; remove sensitive data later
    return res.status(200).json({ message: 'User found', foundUser });
  } catch (error) {
    console.error('Error in getUserByEmailController:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};
