require("dotenv").config();
const session = require("express-session");
const redisClient = require("../redis");
const RedisStore = require("connect-redis")(session);

const sessionMiddleware = session({
  secret: process.env.COOKIE_SECRET,
  credentials: true,
  name: "sid",
  store: new RedisStore({
    client: redisClient,
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    //   secure: "false",
    //   sameSite: "lax",
    secure: process.env.NODE_ENV === "production" ? "true" : "auto",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: 1000 * 60 * 60 * 24,
  },
});

const wrap = (expressMiddlware) => (socket, next) =>
  expressMiddlware(socket.request, {}, next);

const corsConfig = {
  origin: "http://localhost:5173",
  credentials: true,
};
module.exports = { sessionMiddleware, wrap, corsConfig };
