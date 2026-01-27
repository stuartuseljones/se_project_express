const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Import Components
const User = require("../models/user");
const ERROR_CODES = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// Get user by ID
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

// Create a new user
module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({ name, avatar, email, password: hash })
        .then((user) => {
          if (!user) {
            const err = new Error("User creation failed");
            err.statusCode = 409;
            throw err;
          }
          const userObj = user.toObject();
          delete userObj.password; // remove password from the returned user object
          return res.status(201).send({ data: userObj });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
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
      if (err.message === "Incorrect email or password") {
        err.statusCode = 401;
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};
