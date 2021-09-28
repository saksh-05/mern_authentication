const router = require("express").Router();
const userValidationSchema = require("../userValidation/userValidation");
const userMiddleware = require("../middleware/userMiddleware");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../userModels/user.modal");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "resources");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter });

router
  .route("/")
  .put(upload.single("src"), (req, res) => {
    const { email, password, name, bio, phone } = req.body;
    let src = "";
    if (req.file) {
      src = req.file.filename;
    }
    // const image = fs.readFileSync(
    //   path.join(__dirname + "/resources/" + req.file.filename)
    // );
    console.log(req.body.email);
    console.log(req.body);
    console.log(req.file);

    User.findOne(
      {
        email,
      },
      (err, user) => {
        if (err || !user) {
          res.send({
            status: true,
            message: "not found",
          });
        } else {
          // console.log(src);
          const saltRounds = 10;
          const userPassword = password;

          bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(userPassword, salt, (err, hash) => {
              if (err) {
                res.send({
                  status: true,
                  message: "Upload error try again",
                });
              }
              console.log(user);
              console.log(user._id);
              const updateUserData = {
                email: email == "" ? user.email : email,
                password: password == "" ? user.password : hash,
                bio: bio == "" ? user.bio : bio,
                phone: phone == "" || phone.length < 10 ? user.phone : phone,
                src: src == null ? user.src : src,
                name: name == "" ? user.name : name,
              };
              User.findOneAndUpdate(
                { email: email },
                {
                  email: updateUserData.email,
                  name: updateUserData.name,
                  password: updateUserData.password,
                  src: updateUserData.src,
                  phone: updateUserData.phone,
                  bio: updateUserData.bio,
                }
              )
                .then(() => {
                  res.send({
                    status: true,
                    message: "user updated",
                  });
                })
                .catch((err) => console.log(err));
            });
          });
        }
      }
    );
    console.log("updated");
  })
  .get((req, res) => {
    console.log(req.query.id);
    const { _id } = jwt.decode(req.query.id);
    console.log(_id);
    // console.log(req);
    if (_id) {
      User.findOne(
        {
          _id,
        },
        (err, user) => {
          if (!user || err) {
            res.send({
              status: true,
              message: "Incorrect detail",
            });
          } else {
            res.send({
              status: true,
              message: "user found",
              user,
            });
          }
        }
      );
    } else {
      res.send({
        message: "error",
        status: true,
      });
    }
  });

module.exports = router;
