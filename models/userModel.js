const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Product = require("./productModel.js");

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Enter a user name"],
    minlength: [4, "User name must be at least 4 characters"],
    maxlength: [18, "User name should not exceed 18 characters"],
  },
  email: {
    type: String,
    required: [true, "Enter a email"],
  },
  password: {
    type: String,
    required: [true, "Enter a passwod"],
    minlength: [3, "Password must be at least 3 characters"],
    // maxlength: [18, "Password should not exceed 18 characters"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  userImage: {
    type: String,
    required: [true, "Enter a Image"],
  },
  userImageId: { type: String },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  follows: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.methods.addToCart = function (product) {
  const result = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  const updatedCartItems = [...this.cart.items];

  let itemQuantity = 1;
  if (result >= 0) {
    itemQuantity = this.cart.items[result].quantity + 1;
    updatedCartItems[result].quantity = itemQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: itemQuantity,
    });
  }

  this.cart = {
    items: updatedCartItems,
  };
  return this.save();
};

userSchema.methods.deleteCartItem = function (productid) {
  const cartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productid.toString();
  });

  this.cart.items = cartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

userSchema.methods.addToFollows = function (product) {
  const result = this.follows.items.findIndex((fp) => {
    return fp.productId.toString() === product._id.toString();
  });
  const updatedFollowsItems = [...this.follows.items];
  if (result <= 0) {
    updatedFollowsItems.push({
      productId: product._id,
    });
  }

  this.follows = {
    items: updatedFollowsItems,
  };
  return this.save();
};

userSchema.methods.removeToFollows = function (productid) {
  const followsItems = this.follows.items.filter((item) => {
    return item.productId.toString() !== productid.toString();
  });

  this.follows.items = followsItems;
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
