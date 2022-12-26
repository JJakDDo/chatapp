const express = require("express");
const router = express.Router();
const validateForm = require("../controllers/validateForm");
const Users = require("../models/users");
const bcrypt = require("bcrypt");

router
  .route("/login")
  .get(async (req, res) => {
    if (req.session.user && req.session.user.username) {
      return res.json({ loggedIn: true, username: req.session.user.username });
    } else {
      return res.json({ loggedIn: false });
    }
  })
  .post(async (req, res) => {
    validateForm(req, res);
    console.log(req.session);

    const user = await Users.findOne({ username: req.body.username });

    if (!user)
      return res.json({
        loggedIn: false,
        status: "Wrong username or password",
      });

    const isSamePass = await bcrypt.compare(req.body.password, user.passhash);

    if (isSamePass) {
      req.session.user = { username: user.username, id: user._id.toString() };
      return res.json({ loggedIn: true, username: user.username });
    } else {
      return res.json({
        loggedIn: false,
        status: "Wrong username or password",
      });
    }
  });

router.post("/register", async (req, res) => {
  validateForm(req, res);

  const existingUser = await Users.findOne({ username: req.body.username });

  console.log(existingUser);
  if (existingUser)
    return res.json({ loggedIn: false, status: "Username existed" });

  const hashedPass = await bcrypt.hash(req.body.password, 10);
  const newUser = new Users({
    username: req.body.username,
    passhash: hashedPass,
  });
  await newUser.save();
  req.session.user = { username: newUser.username, id: newUser._id.toString() };
  return res.json({ loggedIn: true, username: newUser.username });
});

module.exports = router;
