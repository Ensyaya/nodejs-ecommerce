const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController.js");

router.post("/create-user", userController.createUser);

router.post("/login-user", userController.loginUser);

// router.get();

module.exports = router;
