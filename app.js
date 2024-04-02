require("dotenv").config(); // Load dotenv configuration

const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoute = require("./routes/index");
const connectDB = require("./db");
const mongoose = require("mongoose");
const errorStatus = require("./utility/errorStatus");

const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS for all routes
app.use(cors());

// Parse incoming request bodies in JSON format
app.use(bodyParser.json());

// Mount user routes at /api
app.use("/api", userRoute);

// Testing the server
app.get("/serverless", async (req, res) => {
  try {
    res.send("hey from server");
  } catch (error) {
    res.status(500).send("error: " + error.message); // Sending error message
  }
});

// Error handling middleware - should be defined after all other routes and middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const error = errorStatus[err] || errorStatus.INTERNAL_SERVER_ERROR;
  const { code, message } = error;
  res.status(code).json({ error: message });
});

// Export the app for use with serverless-http
module.exports.handler = serverless(app);
