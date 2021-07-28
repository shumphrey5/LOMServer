const { validationResult } = require("express-validator");

const HttpError = require("../models/HTTPError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Company = require("../models/companies");
const { logger } = require("../../Log/logger");

const login = async (req, res, next) => {};

const signup = async (req, res, next) => {
  const { name, email, phoneNumber, password } = req.body;

  let existingUser;
  try {
    existingUser = await Company.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Could not sign up, please try again later", 500);
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
    const error = new HttpError("Could not sign up, please try again later", 500);
    return next(error);
  }

  const newCompany = new Company({
    name,
    email,
    phoneNumber,
    password: hashedPassword,
  });

  try {
    await newCompany.save();
  } catch (err) {
      console.log(err);
    const error = new HttpError("Could not sign up, please try again later", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { companyId: newCompany.id, email: newCompany.email },
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

exports.login = login;
exports.signup = signup;
