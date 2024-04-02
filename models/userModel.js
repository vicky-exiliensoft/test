const mongoose = require("mongoose");

/**
 * Define the user schema.
 * @type {mongoose.Schema}
 * @description This schema defines the structure of the user document in the MongoDB database.
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    /**
     * The first name of the user.
     * @type {string}
     */
  },
  lname: {
    type: String,
    required: false,
    /**
     * The last name of the user (optional).
     * @type {string}
     */
  },
  username: {
    type: String,
    required: true,
    unique: true, // Username must be unique
    /**
     * The username of the user.
     * @type {string}
     */
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email must be unique
    /**
     * The email address of the user.
     * @type {string}
     */
  },
  password: {
    type: String,
    required: true,
    /**
     * The password of the user.
     * @type {string}
     */
  },
  role: {
    type: String,
    enum: ["user", "admin"], // Role must be either 'user' or 'admin'
    default: "user", // Default role is 'user'
    /**
     * The role of the user.
     * @type {string}
     */
  },
  permissions: [
    {
      type: String,
      /**
       * The permissions assigned to the user.
       * @type {string[]}
       */
    },
  ],
  location: {
    type: String,
    /**
     * The location of the user.
     * @type {string}
     */
  },
  creationDate: {
    type: Date,
    default: Date.now, // Default creation date is current date/time
    /**
     * The creation date of the user account.
     * @type {Date}
     */
  },
  lastLoginTime: {
    type: Date,
    default: null, // Default last login time is null
    /**
     * The last login time of the user.
     * @type {Date|null}
     */
  },
  registrationTime: {
    type: Date,
    default: Date.now, // Default registration time is current date/time
    /**
     * The registration time of the user account.
     * @type {Date}
     */
  },
  localDevelopment: {
    type: Boolean,
    default: process.env.NODE_ENV !== "production", // Set to true if in local development, false otherwise
    /**
     * Indicates if the user account is in local development mode.
     * @type {boolean}
     */
  },
});

/**
 * User model.
 * @type {mongoose.Model}
 * @description This model represents a user document in the MongoDB database.
 */
const User = mongoose.model("User", userSchema);
module.exports = User;
