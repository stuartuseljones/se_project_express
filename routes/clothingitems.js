const router = require("express").Router();
const {
  getClothingItems,
  deleteClothingItem,
  createClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingitems");

router.get("/", getClothingItems);
router.post("/", createClothingItem);
router.delete("/:itemId", deleteClothingItem);

router.put("/:itemId/likes", likeItem);

router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
