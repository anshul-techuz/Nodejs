const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    title: "Add Products",
    path: "/admin/add-product",
    editing: false,
  });
};
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  console.log(editMode);
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productid;
  Product.findById(prodId, (product) => {
    if (!product) {
      console.log(typeof product);
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      title: "Edit Products",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
};
exports.postEditProducts = (req, res, next) => {
  console.log("You are on edit page");
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedUrl,
    updatedDesc,
    updatedPrice
  );
  updatedProduct.save();
  res.redirect("/admin/products");
};
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};
exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      title: "All Admin Products",
      prods: products,
      path: "/admin/products",
    });
  });
};
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.prodId;
};
