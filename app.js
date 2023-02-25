const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const app = express();
const ShortUrl = require("./models/shortUrl");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

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

client.connect((err) => {
  if (err) {
    console.error(err);
    return false;
  }
  // connection to mongo is successful, listen for requests
  app.listen(process.env.PORT || 3000);
});
