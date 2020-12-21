var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var Repository = require("./repository");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

repo = new Repository();

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

const importData = () => {
  const data = require("./data/users.json");
  data.forEach((item) => {
    repo.insert(item);
  });
};

module.exports = {
  app,
  importData,
  repo,
};
