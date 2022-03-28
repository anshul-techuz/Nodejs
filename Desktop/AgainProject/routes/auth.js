const express = require("express");

const router = express.Router();
const { check, body } = require("express-validator/check");
const User = require("../models/user");
const isAuth = require("../middleware/isauth");
const authController = require("../controllers/auth");
router.post(
  "/signup",
  [
    body("name", "Please enter a name").isLength({ min: 3 }).trim(),

    check("email")
      .isEmail()
      .withMessage("PLEASE ENTER A RIGHT EMAIL")
      .custom(async (value) => {
        const userDoc = await User.findOne({ where: { email: value } });
        if (userDoc) {
          return Promise.reject("E-MAIL ALREADY EXISTS");
        }
      })
      .normalizeEmail(),
    body(
      "password",
      "PLEASE ENTER A PASSWORD WITH ONLY NUMBERS AND TEXT AND AT LEAST 5 CHARACTERS."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("PASSWORDS DO NOT MATCH!");
        }
        return true;
      }),
  ],
  authController.signup
);
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("PLEASE ENETER A VALID EMAIL ADDRESS.")
      .normalizeEmail(),

    body(
      "password",
      "PLEASE ENTER A PASSWORD WITH ONLY NUMBERS AND TEXT AND AT LEAST 5 CHARACTERS."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);
router.post("/change-password", isAuth, authController.changePassword);

router.post("/logout", isAuth, authController.logout);

module.exports = router;
