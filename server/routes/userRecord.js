const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const User = require("../userModels/user.modal");
const userValidationSchema = require("../userValidation/userValidation");
const userMiddleware = require("../middleware/userMiddleware");
const bcrypt = require("bcrypt");

router
  .route("/signup")
  .post(userMiddleware(userValidationSchema.userInfo), (req, res) => {
    const saltRounds = 10;
    const userPassword = req.body.password;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(userPassword, salt, (err, hash) => {
        User.findOne(
          {
            email: req.body.email,
          },
          (err, user) => {
            console.log(user);
            if (!user) {
              console.log("new user");
              const newUserData = {
                email: req.body.email,
                password: hash,
              };
              const newUser = new User(newUserData);
              newUser
                .save()
                .then(() =>
                  res.send({
                    status: true,
                    message: "user added",
                  })
                )
                .catch((err) => res.status(400).json("Error: " + err));
            } else if (err) console.log(err);
            else {
              bcrypt.compare(
                req.body.password,
                user.password,
                (err, result) => {
                  if (result == true) {
                    console.log("user exist");
                    res.send({
                      status: true,
                      message: "User Exist",
                    });
                  } else {
                    res.send({
                      status: false,
                      message: "Incorrect password",
                    });
                    console.log("incorrect password");
                  }
                }
              );
            }
          }
        );
        // .then((user) => {
        //   console.log(user);
        //   if (!user) {
        //     console.log("new user");
        //     const newUserData = {
        //       email: req.body.email,
        //       password: hash,
        //     };
        //     const newUser = new User(newUserData);
        //     newUser
        //       .save()
        //       .then(() =>
        //         res.send({
        //           status: true,
        //           message: "user added",
        //         })
        //       )
        //       .catch((err) => res.status(400).json("Error: " + err));
        //   } else {
        //     bcrypt.compare(
        //       req.body.password,
        //       user.password,
        //       function (err, result) {
        //         if (result == true) {
        //           console.log("user exist");
        //         } else {
        //           console.log(user.password);
        //           console.log(hash);
        //           res.send("Incorrect password");
        //         }
        //       }
        //     );
        //   }
        // });
      });
    });

    console.log("saved");
  });
// router.route("/login").post((req, res) => {
//   const validate = userMiddleware(userValidationSchema.userInfo);
//   console.log(req.body);
//   const newUserData = {
//     email: req.body.email,
//     password: uuidv4(),
//   };
//   const newUser = new User(newUserData);

//   newUser
//     .save()
//     .then(() =>
//       res.send({
//         status: true,
//         message: "user added",
//       })
//     )
//     .catch((err) => res.status(400).json("Error: " + err));

//   console.log("saved");
// });

module.exports = router;
