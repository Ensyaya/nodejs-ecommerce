const express = require("express");

const router = express.Router();

const auth = require("../auth/auth.js")
const pageController = require("../controllers/pageController.js");

router.get("/", pageController.getIndexPage);

router.get("/register", pageController.getRegisterPage);

router.get("/login", pageController.getLoginPage);

router.get("/logout", pageController.getLogout);

router.get("/products", pageController.getProductsPage);

router.get("/products/:id", pageController.getProductDetailPage);

router.get("/user-profile",auth.authenticateToken, pageController.getUserProfilePage);

router.get("/follows-page",auth.authenticateToken, pageController.getFollows);

router.get("/cart",auth.authenticateToken, pageController.getCart);

router.get("/orders",auth.authenticateToken, pageController.getOrders);

router.get("/add-product", auth.authenticateToken,auth.isAdmin,pageController.getAddProductPage);

router.get("/admin",auth.authenticateToken,auth.isAdmin , pageController.getAdminPage);

router.get("/edit-product/:id",auth.authenticateToken,auth.isAdmin, pageController.getEditProductPage);

module.exports = router;
