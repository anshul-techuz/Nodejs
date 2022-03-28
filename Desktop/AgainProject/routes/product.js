const express = require("express");
const prodController = require("../controllers/product");
const router = express.Router();

router.get("/products", prodController.getProducts);
router.get("/product/search/:prodName", prodController.search);
router.get("/product/:prodSlug", prodController.getProductUsingSlug);

module.exports = router;
