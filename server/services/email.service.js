import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use host/port for a custom SMTP provider
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD, // App password if using Gmail
  },
});

/**
 * Sends a password reset email.
 * @param {string} to - Recipient's email address.
 * @param {string} resetLink - URL to reset the password.
 */

export const sendResetPasswordEmail = async (to, resetLink) => {
  const mailOptions = {
    from: `"Response360 Support" <${process.env.EMAIL_USERNAME}>`,
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
