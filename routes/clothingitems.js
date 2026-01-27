const router = require('express').Router();
const {
  getClothingItems,
  deleteClothingItem,
  createClothingItem,
  likeItem,
  dislikeItem,
} = require('../controllers/clothingitems');
const auth = require('../middlewares/auth');
const {
  validateCreateItem,
  validateItemId,
} = require('../middlewares/validation');

router.get('/', getClothingItems);

router.use(auth);
router.post('/', validateCreateItem, createClothingItem);
router.delete('/:itemId', validateItemId, deleteClothingItem);
router.put('/:itemId/likes', validateItemId, likeItem);
router.delete('/:itemId/likes', validateItemId, dislikeItem);

module.exports = router;
