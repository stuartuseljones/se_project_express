const ClothingItem = require('../models/clothingitem');
const ForbiddenError = require('../errors/forbidden-err');

// Get all clothing items
module.exports.getClothingItems = (req, res, next) => ClothingItem.find({})
  .then((items) => res.status(200).send({ data: items }))
  .catch(next);

// Create a new clothing item
module.exports.createClothingItem = (req, res, next) => {
  console.log(req.user._id); // _id will become accessible
  const { name, weather, imageUrl } = req.body;

  return ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((item) => res.status(201).send({ data: item }))
    .catch(next);
};

// Delete a clothing item by ID
module.exports.deleteClothingItem = (req, res, next) => {
  ClothingItem.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() === String(req.user._id)) {
        ClothingItem.findByIdAndDelete(req.params.itemId).then(() => {
          res.status(200).send({ data: item });
        });
      } else {
        return next(
          new ForbiddenError('You do not have permission to delete this item'),
        );
      }
    })
    .catch(next);
};

// like a clothing item
module.exports.likeItem = (req, res, next) => ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  {
    $addToSet: {
      likes: req.user._id,
    },
  }, // add _id to the array if it's not there yet
  { new: true },
)
  .orFail()
  .then((item) => res.status(200).send({ data: item }))
  .catch(next);

// dislike a clothing item
module.exports.dislikeItem = (req, res, next) => ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  {
    $pull: {
      likes: req.user._id,
    },
  }, // remove _id from the array
  { new: true },
)
  .orFail()
  .then((item) => res.status(200).send({ data: item }))
  .catch(next);
