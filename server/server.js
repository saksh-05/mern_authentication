const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userRouter = require("./routes/userRecord");
app.use("/loginsignup", userRouter);


const userInfo = require("./userModels/user.modal");
app.get("/", async (req, res) => {
  try {
    const allUsers = await userInfo.find();
    res.send(allUsers);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
