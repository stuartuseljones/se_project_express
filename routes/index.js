const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const { validateLogin, validateSignup } = require('../middlewares/validation');

router.post('/signin', validateLogin, login);
router.post('/signup', validateSignup, createUser);

module.exports = router;
