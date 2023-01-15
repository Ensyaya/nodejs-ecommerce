const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  productName: {
    type: String,
    required: [true, "Enter a product name"],
    minlength: [5, "Product name must be at least 5 characters"],
    maxlength: [25, "Product name should not exceed 25 characters"],
  },
  price: {
    type: Number,
    required: [true, "Enter a product price"],
  },
  description: {
    type: String,
    required: [true, "Enter a product description"],
    minlength: [10, "Product description must be at least 5 characters"],
  },
  productImage: {
    type: String,
    required: [true, "Enter a Image"],
  },
  productImageId: { type: String },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
