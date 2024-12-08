const express = require("express");
const dashboard = require("../controllers/userDashboardController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const router = express.Router();

router.get("/dashboard", authMiddleware, dashboard);

module.exports = router;
