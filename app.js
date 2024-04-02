
require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const cors = require("cors"); // Import the cors middleware
const bodyParser = require("body-parser");
const userRoute = require("./routes/index");
const app = express();
const connectDB = require("./db");
const mongoose = require("mongoose");
const errorStatus = require("./utility/errorStatus");
const { errorMonitor } = require("events");

/**
 * Connect to MongoDB Atlas cluster
 * @author Vicky
 * @version 1.0
 * @update Date 2021-08-30
 * @description This function establishes a connection to the MongoDB Atlas cluster.
 *              It uses the connectDB function imported from './db'.
 */

connectDB();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
// Routes
app.use("/api", userRoute);

/**
 * Error handling middleware
 * @author Vicky
 * @version 1.0
 * @description This middleware handles errors that occur during request processing.
 *              It logs the error stack and sends a 500 status response with a generic error message.
 */

app.use((err, req, res, next) => {
  console.error(err.stack);
  const error = errorStatus[err] || errorStatus.INTERNAL_SERVER_ERROR;
  const { code, message } = error;
  res.status(code).json({ error: message });
});
/**
 * @server  Listening on port 3000
 * @access   Public
 * @callback app function
 * @alias  listen
 * @constant  {Number} port - The server will run on this port (default is 3000)
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// require("dotenv").config(); // Load dotenv configuration

// // const serverless = require("serverless-http");
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const userRoute = require("./routes/index");
// const connectDB = require("./db");
// const mongoose = require("mongoose");
// const errorStatus = require("./utility/errorStatus");

// const app = express();

// // Connect to MongoDB
// connectDB();

// // Enable CORS for all routes
// app.use(cors());

// // Parse incoming request bodies in JSON format
// app.use(bodyParser.json());

// // Mount user routes at /api
// app.use("/api", userRoute);

// // Testing the server
// app.get("/serverless", async (req, res) => {
//   try {
//     res.send("hey from server");
//   } catch (error) {
//     res.status(500).send("error: " + error.message); // Sending error message
//   }
// });

// // Error handling middleware - should be defined after all other routes and middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   const error = errorStatus[err] || errorStatus.INTERNAL_SERVER_ERROR;
//   const { code, message } = error;
//   res.status(code).json({ error: message });
// });
// app.listen()

// // Export the app for use with serverless-http
// // module.exports.handler = serverless(app);
