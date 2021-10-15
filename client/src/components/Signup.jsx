import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Box,
  CardContent,
  Button,
  Typography,
  FormControl,
  InputAdornment,
  IconButton,
  Stack,
  Avatar,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import logo from "../resources/devchallenges.svg";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useTheme } from "@emotion/react";
import dlogo from "../resources/devchallenges-light.svg";
import axios from "axios";
import base_url from "../devpro/Baseurl";
import { userEmailSchema, userPasswordSchema } from "./UserValidation";
import { useHistory } from "react-router-dom";
import Facebook from "../resources/Facebook.svg";
import Twitter from "../resources/Twitter.svg";
import Github from "../resources/Github.svg";
import Google from "../resources/Google.svg";
import ReactGoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import TwitterLogin from "react-twitter-login";
import GitHubLogin from "react-github-login";

const Signup = (props) => {
  console.log(props);
  const twitterRef = useRef();
  const gitRef = useRef();
  const theme = useTheme();
  const history = useHistory();
  const [values, setValues] = useState({
    email: "",
    password: "",
    showpassword: false,
    emailHelperShow: false,
    passwordHelperShow: false,
  });
  const [snack, setSnack] = useState({
    fault: false,
    message: "",
    severity: "success",
  });

  const updateSnack = (msg, svrt) => {
    setSnack({ ...snack, fault: true, message: msg, severity: svrt });
  };

  useEffect(() => {
    if (props.location.params !== undefined) {
      if (props.location.params.message === "logout") {
        updateSnack("Logged out", "success");
      }
      console.log("snack change");
    }
    console.log(snack);
  }, [props.location.params]);

  const handleChange = (prop) => async (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleHelperShow = async (e) => {
    if (e.target.id === "outlined-email") {
      e.target.value === ""
        ? setValues({ ...values, emailHelperShow: true })
        : console.log("nothing");
      const emailValid = await userEmailSchema.isValid(values);
      emailValid
        ? setValues({ ...values, emailHelperShow: false })
        : console.log("nothing");
    }

    if (e.target.id === "outlined-password") {
      e.target.value === ""
        ? setValues({ ...values, passwordHelperShow: true })
        : console.log("nothing");
      const passwordValid = await userPasswordSchema.isValid(values);
      passwordValid
        ? setValues({ ...values, passwordHelperShow: false })
        : console.log("nothing");
    }
  };

  const handleClose = () => {
    setSnack({ ...snack, fault: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailValid = await userEmailSchema.isValid(values);
    const passwordValid = await userPasswordSchema.isValid(values);
    if (emailValid && passwordValid) {
      await axios
        .post(`${base_url}user/signup`, {
          email: values.email,
          password: values.password,
        })
        .then((res) => {
          if (res.data.message === "user exist") {
            history.push({
              pathname: "/login",
              params: {
                fault: true,
                message: "User exist please login",
              },
            });
          } else {
            updateSnack("Check your email", "success");
          }
        })
        .catch((err) => {
          updateSnack(err, "error");
        });
    } else {
      updateSnack("Enter correct detail", "error");
    }
  };

  const onGoogleResponse = async (resp) => {
    await axios
      .post(`${base_url}user/googleregister`, {
        idToken: resp.tokenId,
      })
      .then((res) => {
        if (
          res.data.message === "google added" ||
          res.data.message === "user exist"
        ) {
          updateSnack("Success login", "success");
          history.push({
            pathname: `/userInfo/${res.data.token}`,
            params: {
              fault: true,
              message: "User signup success",
            },
          });
        } else {
          updateSnack("Google signin error try again", "error");
        }
      })
      .catch((err) => {
        updateSnack("Google singin error, try again", "error");
      });
  };

  const onFacebookResponse = async (response) => {
    const { userID, accessToken, email, name, picture } = response;
    await axios
      .post(`${base_url}user/facebookregister`, {
        userID,
        accessToken,
        name,
        email,
        picture,
      })
      .then((res) => {
        if (res.data.message === "Incorrect password") {
          updateSnack("Facebook login error, try again", "error");
        } else {
          updateSnack("Success login", "success");
          history.push({
            pathname: `/userInfo/${res.data.token}`,
            params: {
              fault: true,
            },
          });
        }
      })
      .catch((err) => updateSnack("Facebook login error, try again", "error"));
  };

  const onTwitterLogin = async () => {
    await twitterRef.current.handleLoginClick();
  };

  const onTwitterResponse = async (err, data) => {
    const { user_id } = data;
    await axios
      .post(`${base_url}user/twitterregister`, {
        id: user_id,
      })
      .then((resp) => {
        if (
          resp.data.message === "user exist" ||
          resp.data.message === "twitter success"
        ) {
          updateSnack("Success login", "success");

          history.push({
            pathname: `/userInfo/${resp.data.token}`,
            params: {
              fault: true,
            },
          });
        } else {
          updateSnack("Twitter signin error, try again", "error");
        }
      })
      .catch((err) => {
        updateSnack("Twitter signin error, try again", "error");
      });
  };

  const onGithubResponse = async (response) => {
    const { code } = response;
    await axios
      .post(`${base_url}user/githubregister`, {
        code: code,
      })
      .then((resp) => {
        if (
          resp.data.message === "user exist" ||
          resp.data.message === "github success"
        ) {
          updateSnack("Success login", "success");

          history.push({
            pathname: `/userInfo/${resp.data.token}`,
            params: {
              fault: true,
            },
          });
        } else {
          updateSnack("Github signin error, try again", "error");
        }
      })
      .catch((err) => {
        updateSnack("Github signin error, try again", "error");
      });
  };
  const onFailure = (response) => {
    console.error(response);
  };
  const onGithubLogin = async () => {
    await gitRef.current.onBtnClick();
  };

  return (
    <>
      <Card
        sx={{
          mx: "auto",
          width: { lg: "40%", sm: "100%" },
          p: 4,
          textAlign: "left",
        }}
      >
        <CardContent>
          {theme.palette.mode === "light" ? (
            <img src={logo} alt="logo" />
          ) : (
            <img src={dlogo} alt="dark logo" />
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "600", fontFamily: "Noto Sans", mt: 5 }}
            >
              Join thousands of learners from around the world
            </Typography>
            <Typography
              sx={{ fontSize: "1rem", fontFamily: "Noto Sans", mt: 3, mb: 4 }}
            >
              Master web development by making real life projects. There are
              multiple paths for you to choose
            </Typography>
            <FormControl sx={{ mb: 2, width: "100%" }} variant="outlined">
              <TextField
                required
                label="email"
                id="outlined-email"
                value={values.email}
                onChange={handleChange("email")}
                onBlur={handleHelperShow}
                helperText={values["emailHelperShow"] ? "email required" : ""}
                error={values["emailHelperShow"] ? true : false}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
            <FormControl sx={{ mb: 3, width: "100%" }} variant="outlined">
              <TextField
                autoComplete="true"
                required
                id="outlined-password"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange("password")}
                onBlur={handleHelperShow}
                helperText={
                  values["passwordHelperShow"] ? "Password required" : ""
                }
                error={values["passwordHelperShow"] ? true : false}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {values.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                label="Password"
              />
            </FormControl>
            <Button
              sx={{
                width: "100%",
                fontFamily: "Noto Sans",
                textTransform: "none",
                fontSize: "1rem",
                background: "#2F80ED",
                color: "white",
              }}
              variant="contained"
              type="submit"
            >
              Start coding now{" "}
            </Button>
            <Typography
              variant="caption"
              display="block"
              color="GrayText"
              sx={{
                fontSize: "14px",
                fontFamily: "Noto Sans",
                textAlign: "center",
                mt: 5,
                mb: 4,
              }}
            >
              or continue with these social profile
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <ReactGoogleLogin
                clientId={`${process.env.REACT_APP_GOOGLE}`}
                render={(renderProps) => (
                  <Avatar
                    onClick={renderProps.onClick}
                    src={Google}
                    alt="google"
                  />
                )}
                buttonText=""
                onSuccess={onGoogleResponse}
                onFailure={onFailure}
              />
              <FacebookLogin
                appId={`${process.env.REACT_APP_FACEBOOK_CLIENT}`}
                autoLoad={false}
                fields="name,email,picture"
                callback={onFacebookResponse}
                render={(renderProps) => (
                  <Avatar
                    onClick={renderProps.onClick}
                    src={Facebook}
                    alt="facebook"
                  />
                )}
              />
              <Box sx={{ display: "none" }}>
                <TwitterLogin
                  authCallback={onTwitterResponse}
                  consumerKey={`${process.env.REACT_APP_TWITTER_KEY}`}
                  consumerSecret={`${process.env.REACT_APP_TWITTER_SECRET}`}
                  id="twitter-login"
                  ref={twitterRef}
                />
              </Box>
              <Button
                onClick={onTwitterLogin}
                sx={{ padding: "0", minWidth: "unset", borderRadius: "50%" }}
              >
                <Avatar src={Twitter} alt="twitter" />
              </Button>
              <Box sx={{ display: "none" }}>
                <GitHubLogin
                  clientId={`${process.env.REACT_APP_GITHUB_CLIENT}`}
                  redirectUri=""
                  onSuccess={onGithubResponse}
                  onFailure={onFailure}
                  ref={gitRef}
                />
              </Box>
              <Avatar onClick={onGithubLogin} src={Github} alt="github" />
            </Stack>
            <Typography
              variant="caption"
              display="block"
              color="GrayText"
              sx={{
                fontSize: "14px",
                fontFamily: "Noto Sans",
                textAlign: "center",
                mt: 5,
              }}
            >
              Already a member?
              <span
                onClick={() => {
                  history.push("/login");
                }}
                style={{
                  color: "#3f50b5",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Login
              </span>
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Snackbar
        open={snack.fault}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert variant="filled" severity={snack.severity} onClose={handleClose}>
          {snack.severity}
          {" : "}
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Signup;
