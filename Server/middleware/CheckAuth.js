const jwt = require("jsonwebtoken");

const HttpError = require("../models/HTTPError");

module.exports = (req, res, next) => {
  try {
    //Checks if token was sent with BEARER
    const value = req.headers.authorization;
    const token = value.includes(" ") ? value.split(" ")[1] : value;
    if (!token) {
      const error = new HttpError("Authentication failed", 401);
      return next(error);
    }
    //Decodes token
    const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);
    req.userData = { username: decodedToken.username };
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed", 403);
    return next(error);
  }
};
