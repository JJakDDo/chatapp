const express = require("express");
const Redis = require("ioredis");
const { sendNotification } = require("../controllers/notiController");
const router = express.Router();

const publisher = new Redis();

router.post("/", (req, res) => sendNotification(req, res, publisher));

module.exports = router;
