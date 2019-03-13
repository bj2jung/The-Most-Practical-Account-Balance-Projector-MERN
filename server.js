const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");

const items = require("./routes/api/items");
const startBalance = require("./routes/api/startBalance");
const users = require("./routes/api/users");
require("dotenv").config();

const app = express();

app.use(express.json());

const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => {
    console.log("mongoDB connected");
  })
  .catch(err => console.log(err));

require("./config/passport")(passport);
app.use(passport.initialize());

app.use("/api/startBalance", startBalance);
app.use("/api/items", items);
app.use("/api/users", users);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server connected on port ${port}`));
