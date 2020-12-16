var express = require("express");
var router = express.Router();
var userClient = require("../clients/user");

/* GET users listing. */
router.get("/:email", async (req, res, next) => {
  var data = await userClient.getUser(req.params.email);
  res.render("user", { data: data });
});

module.exports = router;
