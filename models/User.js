const mongoose = require("mongoose");
const Item = require("./Item");
const StartBalance = require("./StartBalance");

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  currentKey: {
    type: Number
  },
  items: [Item],
  startBalance: StartBalance
});

module.exports = User = mongoose.model("user", UserSchema);
