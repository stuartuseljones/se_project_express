const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const ERROR_CODES = require('../utils/errors');

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(ERROR_CODES.UNAUTHORIZED)
      .send({ message: 'Unauthorized' });
  }

  try {
    const token = authorization.replace('Bearer ', '');
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // assign the payload to req.user
    return next();
  } catch (err) {
    return res
      .status(ERROR_CODES.UNAUTHORIZED)
      .send({ message: 'Invalid token' });
  }
}
module.exports = auth;
