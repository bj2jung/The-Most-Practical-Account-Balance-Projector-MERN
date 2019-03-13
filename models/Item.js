const mongoose = require("mongoose");

// create Schema
const ItemSchema = new mongoose.Schema({
  incomeOrExpense: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  frequency: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDateExists: {
    type: Boolean,
    required: true
  },
  endDate: {
    type: String
  },
  key: {
    type: Number,
    required: true
  }
});

module.exports = Item = ItemSchema;
// module.exports = Item = mongoose.model("item", ItemSchema);
