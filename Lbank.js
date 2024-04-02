const axios = require("axios");
const crypto = require("crypto");

/**
 * Makes an API request to LBank.
 * @param {string} apiKey - The API key.
 * @param {string} secretKey - The secret key.
 * @param {string} endpoint - The API endpoint.
 * @returns {Promise<any>} - The response data from the API.
 * @throws {Error} - If an error occurs during the API request.
 * @update 2024-03-15: Add a timestamp parameter for rate limiting.
 * @description This function makes an API request to the LBank exchange.
 * @documentation <https://www.lbkex.com/api_v2#general>
 * @access Requires valid API credentials and endpoint.
 */

async function makeLBankAPIRequest(apiKey, secretKey, endpoint) {
  try {
    const timestamp = Date.now().toString();
    const echostr = generateRandomString(30, 40);
    const signatureMethod = "HmacSHA256";
    // Construct parameters string
    const parameters = [
      `api_key=${apiKey}`,
      `signature_method=${signatureMethod}`,
      `timestamp=${timestamp}`,
      `echostr=${echostr}`,
    ]
      .sort()
      .join("&");
    // Calculate prepared string for signature
    const preparedStr = crypto
      .createHash("md5")
      .update(parameters)
      .digest("hex")
      .toUpperCase();
    // Generate HMAC-SHA256 signature
    const hmacSignature = crypto
      .createHmac("sha256", secretKey)
      .update(preparedStr)
      .digest("hex");
    // Prepare request data
    const requestData = {
      api_key: apiKey,
      sign: hmacSignature,
      signature_method: signatureMethod,
      timestamp: timestamp,
      echostr: echostr,
    };
    // Make the API request
    const response = await axios.post(
      `${process.env.LBANK_URL}/${endpoint}`,
      requestData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

/**
 * Generates a random string of specified length.
 * @param {number} minLength - The minimum length of the string.
 * @param {number} maxLength - The maximum length of the string.
 * @returns {string} - The generated random string.
 */

function generateRandomString(minLength, maxLength) {
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  const characters = process.env.HEXA_GEN;
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Replace these variables with your actual API key, secret key, and desired endpoint
const apiKey = process.env.LBANK_API_KEY;
const secretKey = process.env.LBANK_SECRET_KEY;
const endpoint = "user_info.do"; // Replace with the desired endpoint

// Make the API request
makeLBankAPIRequest(apiKey, secretKey, endpoint);
