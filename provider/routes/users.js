var express = require("express");
var router = express.Router();

//Get user by email
router.get("/:email", function (req, res, next) {
  res.send("respond with a resource by email");
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  var users = repo.fetchAll();
  if (users && users.length > 0) {
    res.send(users);
  } else {
    res.status(404).send("no users found");
  }
});

module.exports = router;
