const express = require("express");
const router = express.Router();
const validateForm = require("../controllers/validateForm");
const {
  handleLogin,
  attemptLogin,
  handleRegister,
} = require("../controllers/authController");

router.route("/login").get(handleLogin).post(validateForm, attemptLogin);

router.post("/register", validateForm, handleRegister);

module.exports = router;
