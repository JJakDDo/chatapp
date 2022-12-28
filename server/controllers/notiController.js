module.exports.sendNotification = (req, res, publisher) => {
  const { message } = req.body;
  console.log(message);
  publisher.publish("chatapp:notification", message);
  res.json({ status: "success" });
};
