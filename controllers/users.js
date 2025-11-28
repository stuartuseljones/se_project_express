const User = require("../models/user");
const ERROR_CODES = require("../utils/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const validator = require("validator");

// Get all users
module.exports.getUsers = (req, res) =>
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      console.log(err);
      return res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "An error has occurred on the server",
      });
    });

// Get user by ID
module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
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
      return res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "An error has occurred on the server",
      });
    });
};

// Create a new user
module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) => {
        delete user._doc.password; // remove password from the returned user object
        if (!user) {
          return res
            .status(ERROR_CODES.CONFLICT)
            .send({ message: "User creation failed" });
        }
        res.status(201).send({ data: user });
      })

      .catch((err) => {
        console.log(err);
        if (err.code === 11000) {
          console.log("Duplicate key error:");
          return res.status(ERROR_CODES.CONFLICT).send({
            message: "User with this email already exists",
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
        return res.status(ERROR_CODES.SERVER_ERROR).send({
          message: "An error has occurred on the server",
        });
      });
  });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Email is required" });
  }

  // Check if email is correctly formatted
  if (!validator.isEmail(email)) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "You must enter a valid email address" });
  }

  // Check if password exists
  if (!password || !password.trim()) {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: "Password is required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // authentication successful! user is in the user variable
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      // authentication error
      res
        .status(ERROR_CODES.UNAUTHORIZED)
        .send({ message: "Incorrect email or password" });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_CODES.NOT_FOUND).send({
          message: "User not found",
        });
      }
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: "Invalid data passed to the methods for updating a user",
        });
      }
      return res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "An error has occurred on the server",
      });
    });
};
