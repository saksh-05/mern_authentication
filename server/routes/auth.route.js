const router = require("express").Router();
const User = require("../userModels/user.modal");
const userValidationSchema = require("../userValidation/userValidation");
const userMiddleware = require("../middleware/userMiddleware");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");

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
          res.send({
            message: "new user",
          });
        } else {
          res.send({
            status: false,
            message: "error",
          });
        }
      }
    );
  });

router.route("/signup/activation").post((req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_SECRET, (err, decoded) => {
      if (err) {
        res.send({
          status: false,
          message: "link expired",
        });
      } else {
        const { email, password } = jwt.decode(token);
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
                  if (!user) {
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
                    res.send(err);
                  } else {
                    res.send({
                      status: true,
                      message: "User Exist",
                    });
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
            } else {
              res.send({
                status: false,
                message: "error",
              });
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
      const { email_verified, email, name, picture } = response.payload;
      if (email_verified) {
        User.findOne(
          {
            email,
          },
          async (err, user) => {
            if (user) {
              const token = jwt.sign(
                {
                  _id: user._id,
                  idToken,
                },
                process.env.JWT_SECRET,
                {
                  expiresIn: "1d",
                }
              );
              return res.json({
                message: "user exist",
                token,
              });
            } else if (err) {
              {
                res.send({
                  status: true,
                  message: "Google error",
                });
              }
            } else {
              const salt = await bcrypt.genSalt(10);
              const password = await bcrypt.hash(idToken, salt);
              const newUserData = {
                email: email,
                password: password,
                name: name,
                src: picture,
              };
              const newUser = new User(newUserData);
              newUser
                .save()
                .then((resp) => {
                  const { _id, email } = resp;

                  const token = jwt.sign(
                    {
                      _id: resp._id,
                      email,
                      name: name,
                      src: picture,
                    },
                    process.env.JWT_SECRET,
                    {
                      expiresIn: "7d",
                    }
                  );
                  res.json({
                    message: "google added",
                    token,
                  });
                })
                .catch((err) => res.status(400).json("Error: " + err));
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
});

router.route("/facebookregister").post((req, res) => {
  const { accessToken, userID, email, name, picture } = req.body;
  User.findOne(
    {
      email,
    },
    async (err, user) => {
      if (err) console.log(err);
      else if (user) {
        const token = jwt.sign(
          {
            _id: user._id,
            accessToken,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );
        res.send({
          token,
          status: true,
          message: "user exist",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(accessToken, salt);
        const newUserData = {
          email: email,
          password: password,
          src: picture.data.url,
          name: name,
        };
        const newUser = new User(newUserData);
        newUser
          .save()
          .then((resp) => {
            const token = jwt.sign(
              {
                _id: resp._id,
                email: resp.email,
                password: resp.password,
                src: resp.src,
                name: resp.name,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "7d",
              }
            );
            res.send({
              token,
              status: true,
              message: "facebook success",
            });
          })
          .catch((err) => console.log(err));
      }
    }
  );
});

router.route("/twitterregister").post(async (req, res) => {
  const { id } = req.body;
  const url = `https://api.twitter.com/2/users/${id}?user.fields=description,id,location,name,profile_image_url,username`;
  await axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    })
    .then(async (resp) => {
      const { name, id, description, profile_image_url } = resp.data.data;
      User.findOne(
        {
          twitterId: id,
        },
        async (err, user) => {
          if (user) {
            const token = jwt.sign(
              {
                _id: user._id,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "7d",
              }
            );
            res.send({
              token,
              message: "user exist",
            });
          } else if (!user) {
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(id, salt);
            const newUserData = {
              password: password,
              src: profile_image_url,
              name: name,
              bio: description,
              twitterId: id,
            };
            const newUser = new User(newUserData);
            newUser
              .save()
              .then((resp) => {
                const token = jwt.sign(
                  {
                    _id: resp._id,
                    password: resp.password,
                    src: resp.src,
                    name: resp.name,
                    bio: resp.bio,
                    twitterId: id,
                  },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: "7d",
                  }
                );
                res.send({
                  token,
                  status: true,
                  message: "twitter success",
                });
              })
              .catch((err) => {
                res.send({
                  message: "error",
                });
              });
          } else {
            res.send({
              message: "twitter error",
            });
          }
        }
      );
    })
    .catch((err) => {
      res.send({
        message: "get error",
      });
    });
});

router.route("/githubregister").post(async (req, res) => {
  const { code } = req.body;
  const url = `https://github.com/login/oauth/access_token?code=${code}&client_id=${process.env.GITHUB_CLIENT}&client_secret=${process.env.GITHUB_SECRET}`;
  await axios
    .get(url, {})
    .then(async (resp) => {
      const tokenArr = resp.data.split("&");
      const tokenVal = tokenArr[0].split("=");
      const userURL = "https://api.github.com/user";
      await axios
        .get(userURL, {
          headers: {
            Authorization: "token " + `${tokenVal[1]}`,
          },
        })
        .then((response) => {
          const { email, name, bio, avatar_url, node_id } = response.data;
          User.findOne(
            {
              email,
            },
            async (err, user) => {
              if (user) {
                const token = jwt.sign(
                  {
                    _id: user._id,
                    node_id,
                  },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: "7d",
                  }
                );
                res.send({
                  message: "user exist",
                  token,
                });
              } else if (!user) {
                const salt = await bcrypt.genSalt(10);
                const password = await bcrypt.hash(node_id, salt);
                const newUserData = {
                  email: email,
                  password: password,
                  src: avatar_url,
                  name: name,
                  bio: bio,
                };
                const newUser = new User(newUserData);
                newUser
                  .save()
                  .then((resp) => {
                    const token = jwt.sign(
                      {
                        _id: resp._id,
                        email: resp.email,
                        password: resp.password,
                        src: resp.src,
                        name: resp.name,
                        bio: resp.bio,
                      },
                      process.env.JWT_SECRET,
                      {
                        expiresIn: "7d",
                      }
                    );
                    res.send({
                      token,
                      status: true,
                      message: "github success",
                    });
                  })
                  .catch((err) => {
                    res.send({
                      message: "error",
                    });
                  });
              }
            }
          );
        })
        .catch((err) => {
          res.send({
            message: "error",
          });
        });
    })
    .catch((err) => {
      res.send({
        message: "error",
      });
    });
});

module.exports = router;
