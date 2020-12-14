const express = require("express");
const request = require("superagent");
const server = express();

const userApiHost = () => process.env.API_HOST || "http://localhost:8081";

const getUsers = () => {
  return request
    .get(`${userApiHost()}/users`)
    .then((res) => res.body)
    .catch((err) => {
      return handleError(err);
    });
};

const getUser = (email) => {
  return request
    .get(`${userApiHost()}/users/${email}`)
    .then((res) => {
      return res.body;
    })
    .catch((err) => {
      console.log("error found");
      return handleError(err);
    });
};

function handleError(err) {
  if (err.status == 404) {
    const error = new Error(err.response.res.text);
    return error;
  } else {
    return err;
  }
}
module.exports = {
  getUser,
  getUsers,
};
