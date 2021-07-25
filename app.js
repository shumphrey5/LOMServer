require("dotenv").config();

const express = require("express");

const bodyParser = require("body-parser");

const HttpError = require("./Server/models/HTTPError");
const { logger } = require("./Log/logger");

const userRoutes = require("./Server/routes/userRoutes");

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use("/user", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Page does not exist", 404);
  return next(error);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  const { username } = req.body;
  logger.log({
    level: "error",
    user: username,
    message: "internal server error",
    error: "" + error,
    requestedURL: req.url,
    requestedIP: req.ip,
  });
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

app.listen(process.env.PORT);