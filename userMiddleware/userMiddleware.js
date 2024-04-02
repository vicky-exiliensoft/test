const jwt = require("jsonwebtoken"); // Adding jwt from jsonwebToken

/**
 * Middleware to extract user ID from JWT token.
 * @async
 * @description This middleware extracts the user ID from the JWT token provided in the request headers.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Function} - The next middleware function.
 * @author ChatGPT
 */
exports.extractUserId = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  /**
     *@param  {Error|null} err - An error occurred while decoding the token or the token is invalid.
     *@param  {Object} payload - If no error occured during token decoding, this contains the decoded token data.
     *@param  {Object} payload - The decoded payload of the token.
     *@access  private
     *@callback async Function for using the payload
     @description  If there was an error decoding the token or the token is invalid, send a 403 Forbidden status code and JSON with error data
     @callback  callback(err,payload)
     @async using extractUserId function for generate the payload
     */

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // console.error("Error verifying token:", err);
      return res.status(401).json({ error: "Invalid token" });
    }
    // console.log("Decoded token:", decoded);
    req.userId = decoded.userId; // Extract user ID from the token and add it to the request object
    next(); // Proceed to the next middleware
  });
};
