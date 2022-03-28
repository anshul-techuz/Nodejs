const Product = require("../models/product");
const sequelize = require("sequelize");
const Op = sequelize.Op;

exports.getProducts = async function (req, res, next) {
  console.log("in get products");
  const currPage = req.query.page || 1;
  console.log(currPage);
  const perPage = 10;
  totalProds = await Product.count({
    where: { quantity: { [sequelize.Op.gt]: 0 } },
  });
  if (totalProds > 0) {
    const products = await Product.findAll({
      where: { quantity: { [sequelize.Op.gt]: 0 } },
      offset: (currPage - 1) * perPage,
      limit: 10,
    });
    res.status(200).json({
      message: "Fetched successfully",
      products: products,
      totalProds: totalProds,
    });
  } else {
    res.status(200).json({ message: "Products are not available" });
  }
};

exports.getProductUsingSlug = async (req, res, next) => {
  slug = req.params.prodSlug;
  try {
    const product = await Product.findOne({ where: { slug: slug } });
    if (product) {
      return res
        .status(200)
        .json({ message: "Fetched successfully.", data: product });
    } else {
      return res.status(200).json({ message: "No product Available" });
    }
  } catch (err) {
    return res.status(404).json({ message: "Something went wrong" });
  }
};

exports.search = async (req, res, next) => {
  console.log("in search");
  searchQuery = req.params.prodName;
  try {
    const products = await Product.findAll({
      where: { name: { [Op.like]: `%${searchQuery}%` } },
    });
    if (!products) {
      res.status(404).json({ message: "Couldn't fetch product" });
    } else {
      res.json({
        message: "Fetched product by name.",
        data: products,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
