const { validationResult } = require("express-validator");

const HttpError = require("../models/HTTPError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Company = require("../models/companies");
const { logger } = require("../../Log/logger");

const login = async (req, res, next) => {
  const { username, password } = req.body;

  let existingUser;
  try {
    existingUser = await Company.findOne({ username: username });
  } catch (err) {
    const error = new HttpError(
      "Could not sign up, please try again later",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Company does not exist with this username",
      401
    );
    return next(error);
  }

  let isValidPassword;
  let existingUserPassword = existingUser.password;
  try {
    isValidPassword = await bcrypt.compare(password, existingUserPassword);
  } catch (err) {
    const error = new HttpError("Incorrect username or password", 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { username: existingUser.username },
      process.env.PRIVATE_KEY,
      { expiresIn: "12h" }
    );
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again", 500);
    return next(error);
  }

  res.json({
    username: existingUser.username,
    email: existingUser.email,
    token: token,
    name: existingUser.name,
    phoneNumber: existingUser.phoneNumber,
  });
};

const signup = async (req, res, next) => {
  const { name, email, phoneNumber, password } = req.body;

  const username = email.split("@")[0];

  let existingUser;
  try {
    existingUser = await Company.findOne({ username: username });
  } catch (err) {
    const error = new HttpError(
      "Could not sign up, please try again later",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("Company already exists with this email", 401);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not sign up, please try again later",
      500
    );
    return next(error);
  }

  const newCompany = new Company({
    name,
    username,
    email,
    phoneNumber,
    password: hashedPassword,
  });

  try {
    await newCompany.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Could not sign up, please try again later",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { companyId: newCompany.id, username: newCompany.username },
      process.env.PRIVATE_KEY,
      { expiresIn: "12h" }
    );
    newCompany.token = token;
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  res.status(201).json(newCompany);
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const username = email.split("@")[0];

  let existingUser;

  try {
    existingUser = await Company.findOne({ username: username });
  } catch (err) {
    const error = new HttpError(
      "Could not find account",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Account does not exist with that email", 401);
    return next(error);
  }

  let link = "localhost:3000/";

  let token;
  try {
    token = jwt.sign(
      { username: existingUser.username },
      process.env.PRIVATE_KEY,
      { expiresIn: "15m" }
    );
  } catch (err) {
    const error = new HttpError("Unable to send email", 500);
    return next(error);
  }

  link = link + token;

  //SEND EMAIL
  res.json({link: link, token: token})
};

exports.login = login;
exports.signup = signup;
exports.forgotPassword = forgotPassword;
