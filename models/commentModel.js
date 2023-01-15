const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  content: {
    type: String,
    required: [true, "enter a comment"],
    minlength: [1, "Comment must be at least 1 characters"],
    maxlength: [255, "Comment should not exceed 255 characters"],
  },
  user: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
      required: [true, "Enter a Image"],
    },
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  replys: [
    {
      content: {
        type: String,
        required: [true, "enter a comment"],
        minlength: [2, "Comment must be at least 2 characters"],
        maxlength: [255, "Comment should not exceed 255 characters"],
      },

      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: true,
      },
      
      userName: {
        type: String,
        required: true,
      },
      userImage: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
