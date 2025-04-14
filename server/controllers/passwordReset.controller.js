import { passwordResetService } from "../services/index.js";

export const passwordResetController = async (req, res) => {
  const { payload } = req.body;

  if (!payload) {
    return res.status(400).json({ success: false, message: 'Token and new password are required.' });
  }

  try {
    const result = await passwordResetService(payload);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    console.error('Password reset controller error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
