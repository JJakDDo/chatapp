const redisClient = require("../redis");

module.exports.authorizeUser = (socket, next) => {
  if (!socket.request.session || !socket.request.session.user) {
    next(new Error('Not authorized"'));
  }
  next();
};

module.exports.initializeUser = async (socket) => {
  socket.user = { ...socket.request.session.user };
  socket.join(socket.user.userId);
  await redisClient.hset(
    `userId:${socket.user.username}`,
    "userId",
    socket.user.userId,
    "connected",
    true
  );
  const friendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );

  const parsedFriendList = await parseFriendList(friendList);
  const friendRooms = parsedFriendList.map((friend) => friend.userId);

  if (friendRooms.length > 0) {
    socket.to(friendRooms).emit("connected", true, socket.user.username);
  }
  socket.emit("friends", parsedFriendList);
};

module.exports.addFriend = async (socket, friendName, cb) => {
  if (friendName === socket.user.username)
    return cb({ done: false, errorMessage: "Cannot add self!" });

  const friend = await redisClient.hgetall(`userId:${friendName}`);
  const currentFriendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );

  if (!friend) return cb({ done: false, errorMessage: "User does not exist!" });
  if (currentFriendList && currentFriendList.indexOf(friendName) !== -1)
    return cb({ done: false, errorMessage: "Friend already added!" });

  await redisClient.lpush(
    `friends:${socket.user.username}`,
    [friendName, friend.userId].join(".")
  );

  const newFriend = {
    username: friendName,
    userId: friend.userId,
    connected: friend.conncted,
  };
  cb({ done: true, newFriend });
};

module.exports.onDisconnect = async (socket) => {
  await redisClient.hset(`userId:${socket.user.username}`, "connected", false);

  const friendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );
  const friendRooms = await parseFriendList(friendList).then((friends) =>
    friends.map((friend) => friend.userId)
  );
  socket.to(friendRooms).emit("connected", false, socket.user.username);
};

const parseFriendList = async (friendList) => {
  const newFriendList = [];
  for (let friend of friendList) {
    const parsedFriend = friend.split(".");
    const friendConnected = await redisClient.hget(
      `userId:${parsedFriend[0]}`,
      "connected"
    );
    newFriendList.push({
      username: parsedFriend[0],
      userId: parsedFriend[1],
      connected: friendConnected,
    });
  }

  return newFriendList;
};
