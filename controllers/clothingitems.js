const ClothingItem = require("../models/clothingitem");
const ERROR_CODES = require("../utils/errors");

// Get all clothing items
module.exports.getClothingItems = (req, res) =>
  ClothingItem.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => {
      console.log(err);
      return res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "An error has occurred on the server",
      });
    });

// Create a new clothing item
module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id); // _id will become accessible
  const { name, weather, imageUrl } = req.body;

  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.log(err);

      if (err.name === "ValidationError") {
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: "Invalid data passed to the methods for creating an item",
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

// Delete a clothing item by ID
module.exports.deleteClothingItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.itemId)
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.log(err);

      if (err.name === "ValidationError") {
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: "Invalid data passed to the methods for creating a user",
        });
      }
      if (err.name === "DocumentNotFoundError")
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: "Clothing item not found" });
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

// like a clothing item
module.exports.likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    {
      $addToSet: {
        likes: req.user._id,
      },
    }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: "Invalid data passed to the methods for creating a user",
        });
      }
      if (err.name === "DocumentNotFoundError")
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: "Clothing item not found" });
      if (err.name === "CastError") {
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: "Invalid ID format",
        });
      }
      return res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "An error has occurred on the server",
      });
    });

// dislike a clothing item
module.exports.dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    {
      $pull: {
        likes: req.user._id,
      },
    }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: "Invalid data passed to the methods for creating a user",
        });
      }
      if (err.name === "DocumentNotFoundError")
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: "Clothing item not found" });
      if (err.name === "CastError") {
        return res.status(ERROR_CODES.BAD_REQUEST).send({
          message: "Invalid ID format",
        });
      }
      return res.status(ERROR_CODES.SERVER_ERROR).send({
        message: "An error has occurred on the server",
      });
    });
