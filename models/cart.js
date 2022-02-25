const fs = require("fs");
const path = require("path");
const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);
const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    let x = JSON.parse(fileContent);
    if (err) {
      return cb([]);
    } else {
      cb(x);
    }
  });
};
module.exports = class Cart {
  static addProduct(id, productPrice) {
    ///fetch the previous cart
    //Analyze the cart =>find existing product
    // Add new product /increase quantity
    let cart = [];
    fs.readFile(p, (err, fileContent) => {
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      ///Anallyze the cart => find existing product
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }
  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
  static deleteProduct(id, price) {
    console.log("id is", id, "price is", price);
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find((prod) => prod.id === id);
      if (!product) {
        return;
      }
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      updatedCart.totalPrice = updatedCart.totalPrice - price * productQty;
      console.log(updatedCart);
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }
};
