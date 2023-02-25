const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const app = express();
const ShortUrl = require("./models/shortUrl");
const PORT = process.env.PORT || 3000;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.post("/shortUrls", async (req, res, next) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});

app.get("/", async (req, res, next) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({
    short: req.params.shortUrl,
  });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.full);
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for requests");
  });
});
