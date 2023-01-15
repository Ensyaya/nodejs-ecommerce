const express = require("express");

const router = express.Router();

const productController = require("../controllers/productController.js");

router.post("/add-product", productController.postAddProduct);

router.post("/edit-product/:id", productController.postUpdateProduct);

router.post("/delete-product/:id", productController.postDeleteProduct);

router.post("/delete-cartproduct/:id", productController.postDeleteCartItem);

router.post("/cart", productController.postCart);

router.post("/fallow-product", productController.postFallowProduct);

router.post("/comment", productController.postComment);

router.post("/reply", productController.postReply);

router.post("/delete-fallow-product/:id", productController.postDeleteFallowItem);

router.post("/create-order", productController.postOrder);

module.exports = router;
