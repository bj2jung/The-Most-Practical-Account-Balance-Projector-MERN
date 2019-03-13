const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const User = require("../../models/User");

// @route GET api/startBalance
// @desc retrieve startBalance from database
// @access private
router.get("/", auth, (req, res) => {
  const userId = JSON.parse(req.query.userId).id;
  User.find({ _id: userId }).then(startBalance => res.json(startBalance));
});

// @route POST api/startBalance
// @desc upload startBalance to database
// @access private
router.post("/", auth, (req, res) => {
  const updatedStartBalance = {
    startingDate: req.body.startBalance.startingDate,
    startingBalance: req.body.startBalance.startingBalance
  };

  User.findOneAndUpdate(
    { _id: req.body.userId },
    { startBalance: updatedStartBalance },
    user => res.send(user)
  );
});

// @route DELETE api/startBalance/userId
// @desc handle removal
// @access private
router.delete("/:userId", auth, (req, res) => {
  const updatedStartBalance = {
    startingDate: new Date(),
    startingBalance: 0
  };

  User.findOneAndUpdate(
    { _id: req.params.userId },
    { startBalance: updatedStartBalance },
    user => res.send(user)
  );
});

module.exports = router;
