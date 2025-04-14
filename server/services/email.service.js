import nodemailer from 'nodemailer';
import { env } from "../config/index.js";
// import dotenv from 'dotenv';

// dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use host/port for a custom SMTP provider
  auth: {
    user: env.email.username,
    pass: env.email.password, // App password if using Gmail
  },
});

/**
 * Sends a password reset email.
 * @param {string} to - Recipient's email address.
 * @param {string} resetLink - URL to reset the password.
 */

export const sendResetPasswordEmailService = async (to, resetLink) => {
  const mailOptions = {
    from: `"Response360 Support" <${env.email.username}>`,
    to,
    subject: 'Reset Your AlertNest Password',
    html: `
      <p>Hi there,</p>
      <p>You requested to reset your Response360 password. Click the link below to continue:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you didn’t request this, just ignore this email.</p>
      <p>– The Response360 Team</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Reset email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending reset email:', error);
    return false;
  }
};
