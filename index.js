const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const pageRoutes = require("./routes/pageRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const { checkUser } = require("./auth/auth.js");
const cloudinary = require("cloudinary").v2;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("node_modules"));
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(fileUpload({ useTempFiles: true }));

app.use("*", checkUser);
app.use(pageRoutes);
app.use(productRoutes);
app.use(userRoutes);

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.DB_URL, {
      dbName: "node_app",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log(`Listening on port ${process.env.PORT}`);
    })
    .catch((err) => {
      console.log(err);
    });
});
