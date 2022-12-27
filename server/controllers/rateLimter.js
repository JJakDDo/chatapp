const redisClient = require("../redis");

module.exports.rateLimiter =
  (secondsLimit, limitAmount) => async (req, res, next) => {
    const ip = req.socket.remoteAddress;
    console.log(ip);
    const [response] = await redisClient
      .multi()
      .incr(ip)
      .expire(ip, secondsLimit)
      .exec();

    if (response[1] > limitAmount) {
      res.json({
        loggedIn: false,
        status: "Slow down!! Try again in a minute",
      });
    } else {
      next();
    }
  };