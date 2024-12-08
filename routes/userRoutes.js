const express = require("express");
const { registerUser, userLogin } = require("../controllers/authController.js");

const router = express.Router();

// public Routes
router.post("/register", registerUser);
router.post("/login", userLogin);

module.exports = router;
