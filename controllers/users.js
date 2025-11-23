const User = require("../models/user");
const ERROR_CODES = require("../utils/errors");

// Get all users
module.exports.getUsers = (req, res) => {
  return User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      console.log(err);

      if (err.name === "ValidationError") {
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: "Invalid data passed to the methods for creating a user",
        });
      }
      if (err.name === "CastError") {
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: "Invalid ID format",
        });
      }
      res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "An error has occurred on the server",
      });
    });
};

// Get user by ID
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_CODES.NOT_FOUND).send({
          message: "User not found",
        });
      }
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: "Invalid data passed to the methods for creating a user",
        });
      }
      if (err.name === "CastError") {
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: "Invalid ID format",
        });
      }
      res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "An error has occurred on the server",
      });
    });
};

// Create a new user
module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      console.log(err);

      if (err.name === "ValidationError") {
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: "Invalid data passed to the methods for creating a user",
        });
      }
      if (err.name === "CastError") {
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: "Invalid ID format",
        });
      }
      res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "An error has occurred on the server",
      });
    });
};
