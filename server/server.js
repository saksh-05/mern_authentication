const express = require("express");
const mongoose = require("mongoose");

const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("Image Page");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
