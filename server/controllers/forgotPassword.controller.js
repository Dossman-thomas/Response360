import { forgotPasswordService } from "../services/index.js";

export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;

  try {
    await forgotPasswordService(email);
    return res.status(200).json({ message: "Password reset link sent." });
  } catch (error) {
    console.error("Forgot password controller error:", error.message);
    return res.status(500).json({ message: error.message || "Something went wrong." });
  }
};
