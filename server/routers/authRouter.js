const express = require("express");
const router = express.Router();
const validateForm = require("../controllers/validateForm");
const {
  handleLogin,
  attemptLogin,
  handleRegister,
} = require("../controllers/authController");
const { rateLimiter } = require("../controllers/rateLimter");

router
  .route("/login")
  .get(handleLogin)
  .post(validateForm, rateLimiter(60, 10), attemptLogin);

router.post("/register", validateForm, rateLimiter(30, 4), handleRegister);

module.exports = router;
