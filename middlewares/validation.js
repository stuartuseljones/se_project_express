const { joi, celebrate } = require("celebrate");
const validator = require("validator");
const { addItem } = require("../../se_project_react/src/utils/api");
const {
  registerUser,
  loginUser,
} = require("../../se_project_react/src/utils/auth");
const { login } = require("../controllers/users");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required().messages({
      "string.length": 'The "id" parameter must be 24 hexadecimal characters',
      "string.hex": 'The "id" parameter must be a valid hexadecimal string',
      "any.required": 'The "id" parameter is required',
    }),
  }),
});

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required().messages({
      "string.length":
        'The "userId" parameter must be 24 hexadecimal characters',
      "string.hex": 'The "userId" parameter must be a valid hexadecimal string',
      "any.required": 'The "userId" parameter is required',
    }),
  }),
});

module.exports.validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required().messages({
      "string.length":
        'The "itemId" parameter must be 24 hexadecimal characters',
      "string.hex": 'The "itemId" parameter must be a valid hexadecimal string',
      "any.required": 'The "itemId" parameter is required',
    }),
  }),
});

router.post(
  "/items",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30).messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
      }),
      imageUrl: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "imageUrl" field must be filled in',
        "string.uri": 'the "imageUrl" field must be a valid url',
      }),
      weather: Joi.string().required().valid("hot", "warm", "cold").messages({
        "string.empty": 'The "weather" field must be filled in',
        "string.valid": 'the "weather" field must be "hot", "warm", or "cold"',
      }),
    }),
  }),
  addItem
);

router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30).messages({
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
      }),
      email: Joi.string().required().email().messages({
        "string.empty": 'The "email" field must be filled in',
        "string.email": 'the "email" field must be a valid email',
      }),
      password: Joi.string().required().min(8).messages({
        "string.empty": 'The "password" field must be filled in',
        "string.min": 'The minimum length of the "password" field is 8',
      }),
      avatarUrl: Joi.string().required().custom(validateURL).messages({
        "string.empty": 'The "avatarUrl" field must be filled in',
        "string.uri": 'the "avatarUrl" field must be a valid url',
      }),
    }),
  }),
  registerUser
);

router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email().messages({
        "string.empty": 'The "email" field must be filled in',
        "string.email": 'the "email" field must be a valid email',
      }),
      password: Joi.string().required().min(8).messages({
        "string.empty": 'The "password" field must be filled in',
        "string.min": 'The minimum length of the "password" field is 8',
      }),
    }),
  }),
  loginUser
);
