const express = require("express");

const adminController = require("../controllers/admin");
const authMiddleware = require("../middleware/isauth");
const multer = require("multer");

const { body } = require("express-validator/check");
const router = express.Router();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ storage: fileStorage, fileFilter: fileFilter });
router.post(
  "/add-product",
  upload.single("image"),
  authMiddleware,
  [
    body("name").trim().isLength({ min: 3 }),
    body("mainImage").trim(),
    body("quantity").trim().isNumeric(),
    body("price").trim().isFloat(),
    body("colors").not().isEmpty(),
  ],
  // upload.single("image"),
  adminController.addProduct
);

router.put(
  "/update-product/:prodSlug",
  upload.single("image"),
  authMiddleware,
  [
    body("name").trim().isLength({ min: 3 }),
    body("mainImage").trim(),
    body("quantity").trim().isNumeric(),
    body("price").trim().isFloat(),
  ],
  adminController.updateProduct
);
router.post(
  "/remove-product/:prodSlug",
  authMiddleware,
  adminController.removeProduct
);

module.exports = router;
