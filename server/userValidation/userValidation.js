const Joi = require("joi");

const userValidationSchema = {
  userInfo: Joi.object().keys({
    password: Joi.string().required(),

    access_token: [Joi.string(), Joi.number()],

    email: Joi.string().required().email(),
  }),
  updateUserInfo: Joi.object().keys({

    access_token: [Joi.string(), Joi.number()],

    email: Joi.string().email().optional(),
  }),
};

module.exports = userValidationSchema;
