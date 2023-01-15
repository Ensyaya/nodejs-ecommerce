const Product = require("../models/productModel.js");
const Order = require("../models/orderModel.js");
const Comment = require("../models/commentModel.js");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

exports.postAddProduct = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.productImage.tempFilePath,
    {
      use_filename: true,
      folder: "node-app/products",
    }
  );
  try {
    await Product.create({
      productName: req.body.productName,
      price: req.body.price,
      description: req.body.description,
      productImage: result.secure_url,
      productImageId: result.public_id,
    });
    fs.unlinkSync(req.files.productImage.tempFilePath);
    res.status(201).redirect("/products");
  } catch (error) {
    console.log(error);
  }
};

exports.postUpdateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (req.files) {
      const imageId = product.productImageId;
      await cloudinary.uploader.destroy(imageId);

      const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
          use_filename: true,
          folder: "node-app/products",
        }
      );

      product.productImage = result.secure_url;
      product.productImageId = result.public_id;

      fs.unlinkSync(req.files.productImage.tempFilePath);
    }
    product.productName = req.body.productName;
    product.price = req.body.price;
    product.description = req.body.description;

    await product.save();
    res.status(201).redirect("/admin");
  } catch (error) {
    console.log(error);
  }
};
exports.postDeleteProduct = async (req, res) => {
  try {
    // cloudinary delete image
    const product = await Product.findById(req.params.id);
    const imageId = product.productImageId;
    await cloudinary.uploader.destroy(imageId, {
      use_filename: true,
      folder: "node-app/products",
    });

    // db delete product
    await Product.findByIdAndRemove({ _id: req.params.id });
    res.status(201).redirect("/admin");
  } catch (error) {
    console.log(error);
  }
};

exports.postCart = async (req, res, next) => {
  try {
    const productId = await req.body.productId;
    const product = await Product.findById(productId);
    await res.locals.user.addToCart(product);

    res.status(201).redirect("/cart");
  } catch (error) {
    console.log(error);
  }
};

exports.postDeleteCartItem = async (req, res, next) => {
  try {
    const productid = await req.body.productid;
    const user = await res.locals.user;
    await user.deleteCartItem(productid);
    res.redirect("/cart");
  } catch (error) {
    console.log(error);
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    const user = await res.locals.user;
    await user.populate("cart.items.productId");
    const order = await new Order({
      user: {
        userId: res.locals.user._id,
        userName: res.locals.user.userName,
        email: res.locals.user.email,
      },
      items: user.cart.items.map((p) => {
        return {
          product: {
            _id: p.productId._id,
            productName: p.productId.productName,
            price: p.productId.price,
            productImage: p.productId.productImage,
          },
          quantity: p.quantity,
        };
      }),
    });
    await order.save();

    await res.locals.user.clearCart();
    res.redirect("/orders");
  } catch (error) {
    console.log(error);
  }
};

exports.postFallowProduct = async (req, res, next) => {
  try {
    const productId = await req.body.productId;
    const product = await Product.findById(productId);
    await res.locals.user.addToFollows(product);

    res.status(201).redirect("/follows-page");
  } catch (error) {
    console.log(error);
  }
};

exports.postDeleteFallowItem = async (req, res, next) => {
  try {
    const productid = await req.body.productid;
    const user = await res.locals.user;
    await user.removeToFollows(productid);
    res.redirect("/follows-page");
  } catch (error) {
    console.log(error);
  }
};

exports.postComment = async (req, res, next) => {
  try {
    const productId = await req.body.productId;
    const product = await Product.findById(productId);
    const comment = await new Comment({
      content: req.body.comment,
      user: {
        userId: res.locals.user._id,
        userName: res.locals.user.userName,
        userImage: res.locals.user.userImage,
      },
      productId: product,
      replys: [],
    });
    await comment.save();

    res.json({ comment });
  } catch (error) {
    console.log(error);
  }
};

exports.postReply = async (req, res, next) => {
  try {
    if (req.body.reply == "") {
      return res.redirect("back");
    }
    if (req.body.reply.length > 255) {
      return res.redirect("back");
    }
    await Comment.findByIdAndUpdate(
      { _id: req.body.commentId },
      {
        $push: {
          replys: {
            content: req.body.reply,
            userId: res.locals.user._id,
            commentId: req.body.commentId,
            userName: res.locals.user.userName,
            userImage: res.locals.user.userImage,
          },
        },
      },
      { new: true }
    );

    res.status(201).redirect("back");
  } catch (error) {
    console.log(error);
  }
};
