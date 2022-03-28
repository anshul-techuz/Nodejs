const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
require("dotenv").config();
const Op = Sequelize.Op;
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator/check");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 25,
  auth: {
    user: "anshul@techuz.com",
    pass: "Anshul@9413",
  },
});
exports.signup = async (req, res, next) => {
  console.log("insignup");
  console.log(req.body);
  const { name, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({
      message: errors.array()[0].msg,
    });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    var slug;
    const userexists = await User.findOne({
      where: { slug: `${name}` },
    });
    console.log("users", userexists);
    if (!userexists) {
      console.log("user not exists");
      slug = name;
    } else {
      console.log("in else");
      const users = await User.findAll({
        where: { slug: { [Op.like]: `${name + "-"}%` } },
      });
      if (!users) {
        slug = name + "-" + 1;
      } else {
        let arr1 = [];
        users.map((user) => {
          arr1.push(user.dataValues.slug);
        });
        console.log(arr1);
        let maxarray = [];
        arr1.map((arr) => {
          console.log(arr.split("-")[1]);
          maxarray.push(parseInt(arr.split("-")[1]));
        });
        console.log("users", maxarray);
        var max = maxarray.reduce(function (a, b) {
          return Math.max(a, b);
        }, 0);
        console.log("maximum number is ", max);
        slug = name + "-" + (max + 1);
        console.log(slug);
      }
    }
    const user = new User({
      name,
      email,
      password: hashedPassword,
      Slug: slug,
    });
    const result = await user.save();
    res.status(200).json({ message: "SIGNED UP SUCCESSFULLY" });
    transporter.sendMail({
      to: email,
      subject: "Signup succeeded!",
      html: "<h1>You successfully signed up!</h1>",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "SOMETHING WRONG HAPPENED" });
  }
};

exports.postLogin = async (req, res, next) => {
  console.log("inpost login");
  const { email, password } = req.body;
  console.log(email, password);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(500).json({ message: errors.array()[0].msg });
  }
  if (email) {
    const user = await User.findOne({ where: { email: email } });
    if (user) {
      fetchedUser = user.dataValues;
      const doesMatch = await bcrypt.compare(
        password,
        user.dataValues.password
      );
      if (doesMatch) {
        const token = jwt.sign(
          {
            email: email,
            userId: fetchedUser.id.toString(),
          },
          "mysecret",
          { expiresIn: "1h" }
        );
        await user.update({ token: token });
        return res.status(200).json({
          message: "Logged in successfully",
          user: user.name,
          token: token,
        });
      } else {
        res.status(401).json({ message: "invalid creds" });
      }
    }
  }
};
exports.changePassword = async (req, res, next) => {
  console.log("in forgot passsword");
  user = req.user;
  if (!user) {
    return res.status(403).json({ message: "Please login first!" });
  }
  updated = req.body.newPassword;
  previous = req.body.oldPassword;
  try {
    const doesMatch = await bcrypt.compare(previous, user.password);
    if (doesMatch) {
      const doMatch = await bcrypt.compare(updated, user.password);
      if (doMatch) {
        return res
          .status(406)
          .json({ message: "New password is same as old password" });
      } else {
        const hashedPass = await bcrypt.hash(updated, 12);
        const user = await User.findByPk(req.user.id);
        if (user) {
          user.password = hashedPass;
          req.user = undefined;
          const result = await user.save();
          return res.status(200).json({
            message: "Changed password successfully",
          });
        } else {
          return res.status(200).json({
            message: "User not found",
          });
        }
      }
    } else {
      console.log("Your old Password is incorrect");
      return res.status(500).json({ message: "old password is incorrect" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Please change your password again" });
  }
};
exports.logout = async (req, res, next) => {
  try {
    User.update({ token: null }, { where: { id: req.id } });
    return res.json({ message: "logged out" });
  } catch (err) {
    return res.json({ message: "not able to logged out" });
  }
};
