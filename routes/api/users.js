const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const auth = require("../../middleware/auth");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

const User = require("../../models/User");

// @route GET api/users
// @desc retreive userId from database using _id
// @access private
router.get("/", auth, (req, res) => {
  User.findOne({ _id: req.query.databaseId })
    .then(user => res.json(user.userId))
    .catch(err => res.json(err));
});

// @route POST api/users/register
// @desc register user
// @access public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ userId: req.body.userId }).then(userId => {
    if (userId) {
      return res.status(400).json({ userId: "userId already exists" });
    }
    const newUser = new User({
      userId: req.body.userId,
      password: req.body.password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => console.log(err));
      });
    });
  });
});

// @route POST api/users/login
// @desc login
// @access public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { userId, password } = req.body;
  User.findOne({ userId }).then(user => {
    if (!user) {
      return res.status(404).json({ userIdnotfound: "userId not found" });
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id
        };

        jwt.sign(
          payload,
          keys.secret,
          {
            expiresIn: 2592000 // 30 days
          },
          (err, token) => {
            if (err) throw err;
            res.json({
              success: true,
              token: "Bearer " + token,
              userId: payload.id
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

module.exports = router;
