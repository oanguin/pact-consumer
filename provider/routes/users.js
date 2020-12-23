var express = require("express");
var router = express.Router();

//Get user by email
router.get("/:email", function (req, res, next) {
  var user = repo.getByEmail(req.params.email);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send("no user found");
  }
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
