const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const authRouter = require("./routes/auth.route");
app.use("/user", authRouter);

const userRouter = require("./routes/user.route");
app.use("/userinfo", userRouter);

const userInfo = require("./userModels/user.modal");
app.get("/", async (req, res) => {
  try {
    const allUsers = await userInfo.find();
    res.send(allUsers);
  } catch (error) {
    console.log(error);
  }
});

app.use(express.static("resources"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("./client/build"));
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
