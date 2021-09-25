const router = require("express").Router();
const userValidationSchema = require("../userValidation/userValidation");
const userMiddleware = require("../middleware/userMiddleware");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../userModels/user.modal");

router
  .route("/")
  .post(userMiddleware(userValidationSchema.userInfo), (req, res) => {



    
  });

module.exports = router;
