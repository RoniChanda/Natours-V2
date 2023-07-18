//* Uncaught Exception *********************************************

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception! Shutting down...");
  console.error("Error:", err);
  process.exit(1);
});

//* Importing modules **********************************************

require("dotenv").config();
const mongoose = require("mongoose");

const app = require("./app");

//* DB Connection **************************************************

mongoose
  .connect(process.env.MONGO_URI)
  .then((conn) => console.log(`MongoDB connected: ${conn.connection.host}`));

//* Start server ***************************************************

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server started listening at ${port}`);
});

//* Unhandled Rejection ********************************************

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection! Shutting down...");
  console.error("Error:", err);

  server.close(() => process.exit(1));
});
