var express = require("express");
var router = express.Router();
var userClient = require("../clients/user");

/* GET users listing. */
router.get("/", async (req, res, next) => {
  var data = await userClient.getUsers();
  res.render("users", { data: data });
});

module.exports = router;
