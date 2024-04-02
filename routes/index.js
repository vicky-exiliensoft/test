const express = require("express");
const userControler = require("../userController/index");
const verifyToken = require("../userMiddleware/userMiddleware.js");
/**
 * Express Router for handling user-related routes.
 * @type {express.Router}
 * @description This router defines various routes for user registration, login, password reset, profile retrieval, and fetching LBank data.
 */

const Router = express.Router();
Router.get("/", async (req, res) => {
  res.send("Server is running up!");
});

/**
 * Route for user registration.
 * @name POST /register
 * @function
 * @memberof Router
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

Router.post("/register", userControler.registerUser);

/**
 * Route for user login.
 * @name POST /login
 * @function
 * @memberof Router
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
Router.post("/login", userControler.loginUser);

/**
 * Route for requesting password reset.
 * @name POST /reset-password/request
 * @function
 * @memberof Router
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

// Router.post("/reset-password/request", userControler.sendPasswordResetEmail);

/**
 * Route for handling password reset.
 * @name POST /reset-password
 * @function
 * @memberof Router
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
Router.post("/reset-password", userControler.requestPasswordReset);

/**
 * Route for fetching user profile.
 * @name GET /profile
 * @function
 * @memberof Router
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
Router.get("/profile", verifyToken.extractUserId, userControler.getUserProfile);

/**
 * Route for fetching data from LBank API.
 * @name GET /lbank-data
 * @function
 * @memberof Router
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
Router.get("/lbank-data", userControler.fetchLBankData);

/**
 * Route for fetching data from LBank API.
 * @name POST /lbank-data
 * @function
 * @memberof Router
 * @inner
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @description - Forget password
 */
Router.post("/forget", userControler.forgetPassword);

module.exports = Router;
