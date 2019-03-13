const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

function auth(req, res, next) {
  const token = req.header("Authorization")
    ? req.header("Authorization").replace("Bearer ", "")
    : undefined;

  if (!token) res.status(401).send("No access");

  try {
    const decoded = jwt.verify(token, keys.secret);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token is invalid" });
  }
}

module.exports = auth;
