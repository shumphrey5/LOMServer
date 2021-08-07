const express = require("express");

const check = require("express-validator");
const checkAuth = require("../middleware/CheckAuth");

const userController = require("../controllers/UserController");

const router = express.Router();

router.post("/login", userController.login);

router.post("/forgotPassword", userController.forgotPassword);

router.use(checkAuth);

router.post("/signup", userController.signup);

router.post("/editUser", userController.editUser);

module.exports = router;
