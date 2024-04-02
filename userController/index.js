const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for generating tokens
const User = require("../models/userModel"); // Import the User model
const nodemailer = require("nodemailer"); // Import nodemailer for sending emails
const crypto = require("crypto"); // adding crypto for HMCA
const errorStatus = require("../utility/errorStatus");
const sendPasswordResetEmail = require("./resetPassword.js");

/**
 * Generate a password reset token.
 * @param {string} userId - The user ID for which the token is generated.
 * @returns {string} - The generated password reset token.
 * @callback
 * @description This function generates a unique token used for password reset for a specific user.
 */

const generateResetToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRE_JSON_WEB_TOKEN,
  });
};

/**
 * Fetch data from LBank API.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @event
 * @description This function retrieves data from the LBank API using specified authentication credentials.
 */

exports.fetchLBankData = async (req, res) => {
  try {
    const apiKey = process.env.LBANK_API_KEY;
    const secretKey = process.env.LBANK_SECERT_KEY;
    const nonce = Date.now(); // Nonce for HMAC authentication

    // Construct the signature based on LBank's authentication method
    const signature = generateSignature(apiKey, secretKey, nonce);

    const headers = {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
      "X-SIGNATURE": signature,
      "X-NONCE": nonce,
      // Include other required headers as per LBank documentation
    };

    // Make a GET request to the LBank API endpoint
    const response = await axios.get(process.env.BASE_URL, { headers });

    // Handle the response data as needed
    res.json(response.data);
  } catch (error) {
  
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Generate HMAC signature for LBank API.
 * @param {string} apiKey - The API key for authentication.
 * @param {string} secretKey - The secret key for authentication.
 * @param {number} nonce - The nonce value for authentication.
 * @returns {string} - The generated HMAC signature.
 * @throws {errorStatus} - Throws an error if there's an issue generating the signature.
 * @description This function generates an HMAC signature for authentication with the LBank API.
 */

function generateSignature(apiKey, secretKey, nonce) {
  const message = `API-KEY=${apiKey}&NONCE=${nonce}`;
  // Use HMAC algorithm to generate signature using secret key
  const hmac = crypto.createHmac("sha256", secretKey);
  hmac.update(message);
  return hmac.digest("hex");
}

/**
 * Register a new user.
 * @param {Object} req - The request object containing user data.
 * @param {Object} res - The response object.
 * @callback
 * @description This function handles the registration of a new user, storing their information in the database.
 */

exports.registerUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role,
      permissions,
      name,
      lname,
      location,
    } = req.body;

    const ipAddress = req.ip;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      permissions,
      name,
      lname,
      location: ipAddress,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (error) {
    res
      .status(errorStatus.INTERNAL_SERVER_ERROR.code)
      .json({ error: errorStatus.INTERNAL_SERVER_ERROR.message });
  }
};

/**
 * Login user.
 * @param {Object} req - The request object containing login credentials.
 * @param {Object} res - The response object.
 * @callback
 * @description This function authenticates a user's login credentials and generates a JWT token upon successful login.
 */

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); // Find user by email
    if (!user) {
      return res.status(401).json({ error: "Invalid username/email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username/email or password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(errorStatus.INTERNAL_SERVER_ERROR.code).json({ error: error.message });
  }
};




/**
 * Verify and handle password reset token.
 * @param {Object} req - The request object containing token and new password.
 * @param {Object} res - The response object.
 * @author
 * @description This function verifies and handles the password reset token, allowing the user to reset their password.
 */

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify reset token
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const userId = decoded.userId;

    // Update user's password
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {

    res
      .status(errorStatus.INTERNAL_SERVER_ERROR.code)
      .json({ error: errorStatus.INTERNAL_SERVER_ERROR.message });
  }
};

/**
 * Get user profile.
 * @param {Object} req - The request object containing user ID.
 * @param {Object} res - The response object.
 * @description This function retrieves and returns the profile information of a user.
 */

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // User ID extracted from JWT token in middleware
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(errorStatus.NOT_FOUND.code)
        .json({ error: errorStatus.NOT_FOUND.message });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.forgetPassword = async function (req, res) {
  const { email, currentPassword, newPassword, confirmPassword } = req.body;

  try {
    // Retrieve user from the database based on email
    const user = await User.findOne({ email });

    // If user is not found, return 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current password matches the one stored in the database
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    // Check if the new password matches the confirm password
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New password does not match the confirm password" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password in the database
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password has been updated" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Handle password reset request.
 * @param {Object} req - The request object containing user email.
 * @param {Object} res - The response object.
 * @constant
 * @description This function handles the request for password reset, initiating the password reset process.
 */
exports.requestPasswordReset = async function (req, res) {
  try {
    const { email } = req.body;

    // Send password reset email
    await sendPasswordResetEmail(email);

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    
    res.status(500).json({ error: "Internal server error" });
  }
};