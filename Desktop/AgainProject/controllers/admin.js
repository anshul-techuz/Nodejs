const Product = require("../models/product");
const Color = require("../models/color");
const ProductColor = require("../models/product-color");
const Sequelize = require("sequelize");
const multer = require("multer");
const { validationResult } = require("express-validator");
const Op = Sequelize.Op;
const fs = require("fs");
const path = require("path");

exports.addProduct = async function (req, res, next) {
  try {
    console.log("in add product");
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      filePath = path.join(__dirname, "..", req.file.path);
      fs.unlink(filePath, (err) => console.log(err));
      return res
        .status(422)
        .json({ message: "Validation failed, entered data is invalid" });
    }
    if (!req.file) {
      filePath = path.join(__dirname, "..", req.file.path);
      fs.unlink(filePath, (err) => console.log(err));
      return res.status(422).json({ message: "No Image Provided" });
    }
    const imageUrl = req.file.path;
    const { name, quantity, price } = req.body;
    const colors = JSON.parse(req.body.colors);
    console.log(colors);
    const mainImage = imageUrl;
    console.log(mainImage);
    if (!req.user) {
      filePath = path.join(__dirname, "..", req.file.path);
      fs.unlink(filePath, (err) => console.log(err));
      return res.status(401).json({ message: "Please login first" });
    }
    try {
      var slug;
      const productexists = await Product.findOne({
        where: { slug: `${name}` },
      });
      if (!productexists) {
        slug = name;
      } else {
        console.log("in else");
        const products = await Product.findAll({
          where: { slug: { [Sequelize.Op.like]: `${name}` + "-" + `%` } },
        });
        let arr1 = [];
        products.map((product) => {
          arr1.push(product.dataValues.slug);
        });
        console.log(arr1);
        let maxarray = [];
        arr1.map((arr) => {
          console.log(arr.split("-")[1]);
          maxarray.push(parseInt(arr.split("-")[1]));
        });
        console.log("products", maxarray);
        var max = maxarray.reduce(function (a, b) {
          return Math.max(a, b);
        }, 0);
        console.log("maximum number is ", max);
        if (max === 0) {
          slug = name + "-" + 1;
        } else {
          slug = name + "-" + (max + 1);
        }
        console.log(slug);
      }
      const product = await req.user.createProduct({
        name,
        slug,
        mainImage,
        quantity,
        price,
      });

      try {
        console.log("in colors try");
        console.log(colors);
        await product.addColor(colors, { through: ProductColor });
      } catch (err) {
        console.log("in colurs problem");
        console.log(err);
        filePath = path.join(__dirname, "..", req.file.path);
        fs.unlink(filePath, (err) => console.log(err));
        return res.status(500).json({ message: "Color are not available." });
      }
      res.status(201).json({ message: "Product added successfully." });
    } catch (err) {
      console.log(err);
      filePath = path.join(__dirname, "..", req.file.path);
      fs.unlink(filePath, (err) => console.log(err));
      return res.status(500).json({ message: "Couldn't add product." });
    }
  } catch (err) {
    console.log(err);
    res.status(402).json({ message: "Enter valid data" });
  }
};
exports.updateProduct = async (req, res, next) => {
  slug = req.params.prodSlug;
  const errors = validationResult(req);
  var colors;
  if (req.body.colors !== undefined) {
    colors = JSON.parse(req.body.colors);
  }
  try {
    const product = await Product.findOne({ where: { slug: slug } });
    console.log(product);
    if (!product) {
      filePath = path.join(__dirname, "..", req.file.path);
      fs.unlink(filePath, (err) => console.log(err));
      return res.status(401).json({ message: "product no found" });
    }
    if (product.ownerId !== req.user.id) {
      filePath = path.join(__dirname, "..", req.file.path);
      fs.unlink(filePath, (err) => console.log(err));
      return res
        .status(401)
        .json({ message: "You are not authorized to update this product" });
    }
    if (!errors.isEmpty()) {
      filePath = path.join(__dirname, "..", req.file.path);
      fs.unlink(filePath, (err) => console.log(err));
      return res
        .status(422)
        .json({ message: "Validation failed, entered data is invalid" });
    }
    if (colors) {
      // Deleting existing colors and adding specified colors.
      const existingColors = await product.getColors();
      console.log(colors);
      product.removeColors(existingColors);
      // Adding the colors only. Not deleting the colors.
      try {
        console.log(colors);
        await product.addColor(colors, { through: ProductColor });
      } catch (err) {
        console.log(err);
        filePath = path.join(__dirname, "..", req.file.path);
        fs.unlink(filePath, (err) => console.log(err));
        return res.status(500).json({ message: "Couldn't update colors" });
      }
    }
    const existingPath = product.mainImage;
    product.name = req.body.name;
    product.mainImage = req.file.path;
    product.quantity = req.body.quantity;
    product.price = req.body.price;
    const result = await product.save();
    filePath = path.join(__dirname, "..", existingPath);
    fs.unlink(filePath, (err) => console.log(err));
    res.status(201).json({ message: "Updated product successfully" });
  } catch (err) {
    console.error(err);
    filePath = path.join(__dirname, "..", req.file.path);
    fs.unlink(filePath, (err) => console.log(err));
    return res.json({
      message: "Updating product failed, please try again later",
    });
  }
};
exports.removeProduct = async (req, res, next) => {
  console.log("removing product");
  slug = req.params.prodSlug;
  console.log(slug);
  try {
    const product = await Product.findOne({ where: { slug: slug } });
    console.log("in product");
    console.log(product);
    if (product.ownerId !== req.user.id) {
      return res
        .status(401)
        .json({ message: "You are not authorized to delete this product" });
    }
    const result = await product.destroy();
    filePath = path.join(__dirname, "..", product.mainImage);
    fs.unlink(filePath, (err) => console.log(err));
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
