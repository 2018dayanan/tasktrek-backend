const express = require("express");
require("dotenv").config();

const databaseConnectiion = require("./database/db.js");
const userRoute = require("./routes/userRoutes.js");
const taskRoute = require("./routes/taskRoutes.js");
const dashboard = require("./routes/userDashboardRoute.js");
PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
// database connection
databaseConnectiion();

// User Route
app.use("/api/user", userRoute);
// Task Route
app.use("/api/task", taskRoute);

// User Dashboard Route
app.use("/api/user", dashboard);

// Testing
app.get("/", (req, res) => {
  return res.status(200).json({
    status: true,
    message: "Server is Running!",
  });
});
// Not found
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: false,
    message: "Not found!",
  });
});

app.listen(PORT, () => {
  console.log("Server Is Running On PORT", PORT);
});
