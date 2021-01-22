require("dotenv").config();
const fs = require("fs");
const superagent = require("superagent");
const pactServerURL = `http://${process.env.PACT_SERVER_HOST}:${process.env.PACT_SERVER_PORT}/`;

superagent
  .get(pactServerURL)
  .then((res) => console.log(res.body))
  .catch(console.error);
