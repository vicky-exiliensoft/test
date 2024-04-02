/**
 * @function connectDB
 * @description Establishes a connection to the MongoDB database using Mongoose.
 * @param {string} DB_NAME - The name of the MongoDB database.
 * @param {string} DB_URL - The URL of the MongoDB database (cluster or local).
 * @returns {Promise<void>} A promise that resolves once the connection is established successfully.
 */

const mongoose = require("mongoose");

/**
 * @callback callback
 * @param {String} err - An error message if there was an issue connecting to the database, otherwise null.
 * @access private
 * @alias _connectDB
 * @borrows module:db/connectDB._connectDB as default
 */

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://vicky:Ie8r74NpXgU9h0SB@cluster0.j9olly6.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully!!!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

module.exports = connectDB;
