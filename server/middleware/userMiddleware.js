const joi = require("joi");
const userMiddleware = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const details = { error };
      console.log("error:", error.details[0].message);
      res.status(422).json({ error: details.error.details.message });
    }
  };
};

module.exports= userMiddleware;
