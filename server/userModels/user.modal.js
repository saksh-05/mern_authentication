const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email:String,
  password: String,
  date:{type:Date , default:Date.now},
});

const eventData = mongoose.model("userinfo", userSchema);

module.exports = eventData;
