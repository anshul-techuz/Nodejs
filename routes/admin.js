const path = require("path");

const express = require("express");

const router = express.Router();

const adminContollers = require("../controllers/admin");
const { Module } = require("module");

// /admin/add-product => GET
router.get("/add-product", adminContollers.getAddProduct);
router.post("/edit-product", adminContollers.postEditProducts);
router.get("/edit-product/:productid", adminContollers.getEditProduct);
router.post("/delete=product", adminContollers.postDeleteProduct);

// /admin/products ==> GET

router.get("/products", adminContollers.getProducts);

// /admin/add-product => POST
router.post("/add-product", adminContollers.postAddProduct);

module.exports = router;
