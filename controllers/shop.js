const Product = require("../models/product");
const Cart = require("../models/cart");
exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      title: "All Products",
      prods: products,
      path: "/products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productid;
  Product.findById(prodId, (product) => {
    console.log(product);
    res.render("shop/product-detail", {
      product: product,
      title: product.title,
      path: "/products",
    });
  });
};
exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      title: "shop",
      prods: products,
      path: "/",
    });
  });
};
exports.getCart = (req, res, next) => {
  Cart.fetchAll((products) => {
    console.log("aaya");
    console.log(products);
    res.render("shop/cart", {
      title: "Cart",
      prods: products.products,
      path: "/cart",
      price: products.totalPrice,
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  Product.findById(prodId, (product) => {
    console.log(product);
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", { path: "/checkout", title: "Checkout Page" });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", { path: "/checkout", title: "Checkout Page" });
};
exports.getordersPage = (req, res, next) => {
  res.render("shop/orders", { path: "/orders", title: "Your Orders" });
};
