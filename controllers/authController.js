const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    const checkEmail = await userModel.findOne({ email });
    if (checkEmail) {
      return res.status(409).json({
        status: false,
        message: "Email already exit!",
      });
    }
    if (!name) {
      return res.status(400).json({
        status: false,
        message: "Name field is required",
      });
    }
    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Email field is required",
      });
    }
    if (!password) {
      return res.status(400).json({
        status: false,
        message: "Password field is required",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const register = await userModel.create({
      name,
      email,
      password: hashPassword,
    });

    return res.status(201).json({
      statu: true,
      message: "Successfully Registered!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error!",
    });
  }
};

// User Login

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Email field is required",
      });
    }
    if (!password) {
      return res.status(400).json({
        status: false,
        message: "Password field is required",
      });
    }
    const getUser = await userModel.findOne({
      email,
    });
    if (!getUser) {
      return res.status(400).json({
        status: false,
        message: "Email and password dose not match!",
      });
    }
    const comparePassword = await bcrypt.compare(password, getUser.password);

    if (!comparePassword) {
      return res.status(400).json({
        status: true,
        message: "Email and password dose not match!",
      });
    }
    const accessToken = await jwt.sign(
      {
        id: getUser._id,
        name: getUser.name,
        email: getUser.email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      status: true,
      message: "Successfully login!",
      data: {
        id: getUser._id,
        name: getUser.name,
        email: getUser.email,
      },
      accessToken,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error!",
    });
  }
};

module.exports = { registerUser, userLogin };
