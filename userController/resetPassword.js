const nodemailer = require("nodemailer");
const User = require("../models/userModel"); // Import the User model
// Configure nodemailer transporter with SMTP credentials from environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // Convert string to boolean
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
  }
});

/**
 * Send password reset email with reset token link.
 * @param {string} email - The email address of the user.
 */
async function sendPasswordResetEmail(email) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    const resetToken = generateResetToken(user._id);

    // Create password reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // Compose email
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: proccess.env.STRING,
      html: `To reset your password, click on the following link: <a href="${resetLink}">${resetLink}</a>`,
    };
    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error; // Propagate the error for handling by the caller
  }
}
module.exports = sendPasswordResetEmail; // Export the function for use in other files

