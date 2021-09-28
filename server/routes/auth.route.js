const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const User = require("../userModels/user.modal");
const userValidationSchema = require("../userValidation/userValidation");
const userMiddleware = require("../middleware/userMiddleware");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

router
  .route("/signup")
  .post(userMiddleware(userValidationSchema.userInfo), (req, res) => {
    const { email, password } = req.body;
    User.findOne(
      {
        email,
      },
      (err, user) => {
        if (user) {
          res.send({
            status: false,
            message: "user exist",
          });
        } else if (!user) {
          const token = jwt.sign(
            {
              email,
              password,
            },
            process.env.JWT_ACCOUNT_SECRET,
            {
              expiresIn: "5m",
            }
          );
          console.log(token);
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_FROM,
              pass: process.env.EMAIL_SECRET,
            },
          });

          var mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Account activation link",
            text: "some text",
            html: `<h1>Please use the following to activate your account</h1>
                  <p>${process.env.CLIENT_URL}/activate/${token}</p>
                  <hr />
                  <p>This email may containe sensetive information</p>`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
        } else {
          res.send({
            status: false,
            message: err,
          });
        }
      }
    );

    console.log("saved");
  });

router.route("/signup/activation").post((req, res) => {
  console.log(req.body);
  const { token } = req.body;
  console.log(token);
  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        res.send({
          status: false,
          message: "link expired",
        });
      } else {
        const { email, password } = jwt.decode(token);
        console.log(email);
        const saltRounds = 10;
        const userPassword = password;

        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(userPassword, salt, (err, hash) => {
            if (err) console.log(err);
            else {
              User.findOne(
                {
                  email: email,
                },
                (err, user) => {
                  console.log(user);
                  if (!user) {
                    console.log("new user");
                    const newUserData = {
                      email: email,
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
                  } else if (err) {
                    console.log(err);
                    res.send(err);
                  } else {
                    res.send({
                      status: true,
                      message: "User Exist",
                    });
                    // bcrypt.compare(password, user.password, (err, result) => {
                    //   if (result == true) {
                    //     console.log("user exist");
                    //   } else {
                    //     console.log(err);
                    //     res.send({
                    //       status: false,
                    //       message: "Incorrect password",
                    //     });
                    //     console.log("incorrect password");
                    //   }
                    // });
                  }
                }
              );
            }
          });
        });
      }
    });
  } else {
    console.log("error");
  }
});

router
  .route("/login")
  .post(userMiddleware(userValidationSchema.userInfo), (req, res) => {
    const { email, password } = req.body;

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
          bcrypt.compare(password, user.password, (err, result) => {
            if (result == true) {
              const token = jwt.sign(
                {
                  email,
                  password,
                },
                process.env.JWT_ACCOUNT_SECRET,
                {
                  expiresIn: "7d",
                }
              );
              const { _id, useremail } = user;

              res.send({
                status: 200,
                message: "success",
                token,
                user: {
                  _id,
                  useremail,
                },
              });
              // res.send({
              //   status: 200,
              //   message: "success",
              // });
              console.log("user exist");
            } else {
              console.log(err);
              res.send({
                status: false,
                message: "error",
              });
              console.log("incorrect password");
            }
          });
        }
      }
    );
  });

const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
router.route("/googleregister").post((req, res) => {
  const { idToken } = req.body;

  client
    .verifyIdToken({ idToken: idToken, audience: process.env.GOOGLE_CLIENT })
    .then((response) => {
      console.log(response.payload);
      const { email_verified, email } = response.payload;
      if (email_verified) {
        User.findOne(
          {
            email: email,
          },
          (err, user) => {
            if (user) {
              console.log(user);
              const token = jwt.sign(
                {
                  _id: user._id,
                },
                process.env.JWT_SECRET,
                {
                  expiresIn: "1d",
                }
              );
              console.log(token);
              const { _id, email } = user;
              return res.json({
                message: "user exist",
                token,
                user: { _id, email },
              });
            } else if (err) {
              console.log(err);
            } else {
              const newUserData = {
                email: email,
                password: idToken,
              };
              const newUser = new User(newUserData);
              newUser
                .save()
                .then((user) => {
                  const token = jwt.sign(
                    {
                      email,
                    },
                    process.env.JWT_SECRET,
                    {
                      expiresIn: "7d",
                    }
                  );
                  const { _id, email } = user;
                  res.json({
                    message: "google added",
                    token,
                    user: { _id, email },
                  });
                })
                .catch((err) => res.status(400).json("Error: " + err));

              console.log(token);
            }
          }
        );
      } else {
        res.send({
          status: false,
          message: "Google login failed",
        });
      }
    })
    .catch((err) => console.log(err));
  console.log("google register");
});

router.route("/facebookregister").post((req, res) => {
  const { accessToken, userID } = req.body;
  console.log(req.body);
  console.log(accessToken);
  console.log(userID);

  console.log("facebook register");
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
