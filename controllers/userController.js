const User = require("../models/userModel.js");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

exports.createUser = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.userImage.tempFilePath,
    {
      use_filename: true,
      folder: "node-app/users",
    }
  );
  try {
    const { userName, password, email } = req.body;

    if (password == "") {
      return res.redirect("/register");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        userName,
        email,
        password: hashedPassword,
        userImage: result.secure_url,
        userImageId: result.public_id,
      });
      fs.unlinkSync(req.files.userImage.tempFilePath);
      res.status(200).redirect("/login");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });

    let same = false;

    if (user) {
      same = await bcrypt.compare(password, user.password);
    } else {
      return res.status(401).json({
        succeded: false,
        error: "there is no such user",
      });
    }

    if (same) {
      const token = createToken(user._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      });
      res.redirect("/");
    } else {
      res.status(401).json({
        succeded: false,
        error: "password are not matched",
      });
    }
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
