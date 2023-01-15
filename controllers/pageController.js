const Product = require("../models/productModel.js");
const User = require("../models/userModel.js");
const Order = require("../models/orderModel.js");
const Comment = require("../models/commentModel.js");

exports.getIndexPage = async (req, res) => {
  res.render("index");
};

exports.getAddProductPage = (req, res) => {
  res.render("add-product");
};

exports.getRegisterPage = (req, res) => {
  res.render("register");
};

exports.getLoginPage = (req, res) => {
  res.render("login");
};

exports.getUserProfilePage = (req, res) => {
  res.render("user-profile");
};

exports.getProductsPage = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.render("products", { products });
  } catch (error) {
    console.log(error);
  }
};

exports.getAdminPage = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.render("admin-page", { products });
  } catch (error) {
    console.log(error);
  }
};

exports.getProductDetailPage = async (req, res) => {
  try {
    const product = await Product.findById({ _id: req.params.id });
    const user = await res.locals.user;
    const inFollowers = user?.follows.items.some((item) => {
      return item.productId.equals(product._id);
    });
    const comments = await Comment.find({ productId: req.params.id }).sort({
      createdAt: -1,
    });

    const isComment = comments.some((comment) => {
      return comment.productId.equals(product._id);
    });

    // const isReply = comments.some((comment) => {
    //   return comment.replys.some((reply) => {
    //     return reply.commentId.equals(comment._id);
    //   });
    // });

    res.render("product-detail", {
      product,
      inFollowers,
      user,
      comments,
      isComment,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.getEditProductPage = async (req, res) => {
  try {
    const product = await Product.findById({ _id: req.params.id });
    res.render("edit-product", { product });
  } catch (error) {
    console.log(error);
  }
};

exports.getLogout = (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 1,
  });
  res.redirect("/");
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await res.locals.user;
    await user.populate("cart.items.productId");

    res.render("cart", {
      products: user.cart.items,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      "user.userId": res.locals.user._id,
    }).sort({
      date: -1,
    });
    res.render("orders", {
      orders: orders,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getFollows = async (req, res, next) => {
  try {
    const user = await res.locals.user;
    await user.populate("follows.items.productId");

    res.render("follows", {
      products: user.follows.items,
    });
  } catch (error) {
    console.log(error);
  }
};
