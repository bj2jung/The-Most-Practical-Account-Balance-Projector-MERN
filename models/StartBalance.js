const mongoose = require("mongoose");

const StartBalanceSchema = new mongoose.Schema({
  startingDate: {
    type: String,
    required: true
  },
  startingBalance: {
    type: Number,
    required: true
  }
});

module.exports = StartBalance = StartBalanceSchema;

// module.exports = StartBalance = mongoose.model(
//   "startBalance",
//   StartBalanceSchema
// );
