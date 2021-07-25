const { validationResult } = require("express-validator");

const HttpError = require("../models/HTTPError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { logger } = require("../../Log/logger");

const login = async (req, res, next) => {};

exports.login = login;
