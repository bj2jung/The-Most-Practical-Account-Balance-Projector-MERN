const express = require("express");
const router = express.Router();

const User = require("../../models/User");
const auth = require("../../middleware/auth");

// @route GET api/items
// @desc retrieve data linked to user from database
// @access private
router.get("/", auth, (req, res) => {
  User.find({ _id: req.query.userId }).then(user => res.json(user));
});

// @route POST api/items
// @desc post new item to database
// @access private
router.post("/", auth, (req, res) => {
  const newItem = {
    incomeOrExpense: req.body.item.incomeOrExpense,
    description: req.body.item.description,
    amount: req.body.item.amount,
    frequency: req.body.item.frequency,
    startDate: req.body.item.startDate,
    endDateExists: req.body.item.endDateExists,
    endDate: req.body.item.endDate,
    key: req.body.item.key
  };

  User.findOneAndUpdate(
    { _id: req.body.userId },
    { $push: { items: newItem } }
  ).then(
    User.findOneAndUpdate(
      { _id: req.body.userId },
      { currentKey: newItem.key },
      user => res.send(user)
    )
  );
});

// @route PUT api/items/userId
// @desc handle edit of item
// @access private
router.put("/:userId", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId, "items.key": req.body.key },
    { $set: { "items.$": req.body } },
    user => res.send(user)
  );
});

// @route DELETE api/items/userId
// @desc handle removal of item
// @access private
router.delete("/:userId", auth, (req, res) => {
  User.updateOne(
    { _id: req.params.userId },
    { $pull: { items: { key: req.query.itemKey } } }
  )
    .then(() => res.json({ success: true }))
    .catch(() => res.status(404).json({ success: false }));
});

// @route DELETE api/items/reset/userId
// @desc handle removal of all items
// @access private
router.delete("/reset/:userId", auth, (req, res) => {
  User.updateOne(
    { _id: req.params.userId },
    {
      $set: {
        items: [],
        currentKey: 0
      }
    }
  )
    .then(() => res.json({ success: true }))
    .catch(() => res.status(404).json({ success: false }));
});

module.exports = router;
