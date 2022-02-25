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
  Cart.fetchAll((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product in products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cart.products.find((prod) => prod.id === product.id)) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        title: "Cart",
        prods: cartProducts,
        path: "/cart",
        price: cart.totalPrice,
      });
    });
  });
};
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", { path: "/checkout", title: "Checkout Page" });
};
exports.getordersPage = (req, res, next) => {
  res.render("shop/orders", { path: "/orders", title: "Your Orders" });
};
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log("hello", prodId);
  Product.findById(prodId, (product) => {
    console.log("in post cart", product);
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};
