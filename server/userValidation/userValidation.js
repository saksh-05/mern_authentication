const Joi = require("joi");

const userValidationSchema = {
  userInfo: Joi.object()
    .keys({
      password: Joi.string().required(),

      access_token: [Joi.string(), Joi.number()],

      email: Joi.string().required().email(),
    })
    .with("email", "password")
    .xor("password", "access_token"),
};

module.exports = userValidationSchema;
