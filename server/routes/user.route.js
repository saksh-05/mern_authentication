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
    const { id, email, password, name, bio, phone } = req.body;
    let src = "";
    if (req.file) {
      src = req.file.filename;
    }
    // const image = fs.readFileSync(
    //   path.join(__dirname + "/resources/" + req.file.filename)
    // );
    console.log(req.body.email);
    console.log(req.file);

    User.findOne(
      {
        email,
      },
      (err, user) => {
        if (err || !user) {
          res.send({
            status: 404,
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
              const updateUserData = {
                email: email == "" ? user.email : email,
                password: password == "" ? user.password : hash,
                bio: bio == "" ? user.bio : bio,
                phone: phone == "" ? user.phone : phone,
                src: src == "" ? user.src : src,
                name: name == "" ? user.name : name,
              };
              User.findOneAndUpdate(
                { id: id },
                {
                  $set: {
                    email: updateUserData.email,
                    name: updateUserData.name,
                    password: updateUserData.password,
                    src: updateUserData.src,
                    phone: updateUserData.phone,
                    bio: updateUserData.bio,

                    // src: {
                    //   data: fs.readFileSync(
                    //     path.join(__dirname + "/resources/" + req.file.filename)
                    //   ),
                    //   contentType: "image/png",
                    // },
                    // src: src,
                  },
                }
              )
                .then(() => {
                  res.send({
                    status: true,
                    message: "user updated",
                  });
                })
                .catch((err) => res.status(400).json("Error: " + err));
            });
          });
        }
      }
    );
    console.log("updated");
  })
  .get((req, res) => {
    const { id } = req.body;
    console.log(req.body);
    User.findOne(
      {
        id,
      },
      (err, user) => {
        if (user) {
          res.send({
            status: true,
            message: "user found",
            user,
          });
        }
      }
    );
  });

module.exports = router;
