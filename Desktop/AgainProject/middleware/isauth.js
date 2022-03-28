const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const User = require("../models/user");
module.exports = async (req, res, next) => {
  const token = req.body.token;
  let decodedToken;
  try {
    console.log("in try");
    decodedToken = jwt.verify(token, "mysecret");
    console.log("edf", decodedToken);
    const user = await User.findOne({
      where: { id: decodedToken.userId, token: token },
    });
    if (!user) {
      filePath = path.join(__dirname, "..", req.file.path);
      fs.unlink(filePath, (err) => console.log(err));
      return res.status(404).json({ message: "Couldn't fetch User" });
    } else {
      req.user = user;
      req.token = token;
      req.id = decodedToken.userId;
      console.log("in token validation");
      next();
    }
  } catch (err) {
    try {
      filePath = path.join(__dirname, "..", req.file.path);
      fs.unlink(filePath, (err) => console.log(err));
      res
        .status(500)
        .json({ message: "Couldn't authorize user, please sign in ok" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Couldn't authorize user, please sign in ok" });
    }
  }
};
