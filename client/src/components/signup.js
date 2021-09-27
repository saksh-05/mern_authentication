import React, { useState } from "react";
import {
  Card,
  Box,
  CardContent,
  Button,
  Typography,
  FormControl,
  InputAdornment,
  IconButton,
  InputLabel,
  OutlinedInput,
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
import base_url from "../devpro/baseurl";
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

const Signup = () => {
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
    severity: "",
  });

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
    console.log(e.target.id);

    if (e.target.id === "outlined-email") {
      e.target.value === ""
        ? setValues({ ...values, emailHelperShow: true })
        : console.log("nothing");
      const emailValid = await userEmailSchema.isValid(values);
      console.log("emailValid", emailValid);
      emailValid
        ? setValues({ ...values, emailHelperShow: false })
        : console.log("nothing");
    }

    if (e.target.id === "outlined-password") {
      e.target.value === ""
        ? setValues({ ...values, passwordHelperShow: true })
        : console.log("nothing");
      const passwordValid = await userPasswordSchema.isValid(values);
      console.log("passwordValid", passwordValid);
      passwordValid
        ? setValues({ ...values, passwordHelperShow: false })
        : console.log("error gone?");
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
          console.log(res);
          if (res.data.message === "user exist") {
            history.push({
              pathname: "/login",
              params: {
                fault: true,
                message: "User exist please login",
              },
            });
          }
          // if (res.data.status === true) {
          //   if (res.data.message === "user added") {
          //     console.log(res.data.message);
          //     setSnack({
          //       ...snack,
          //       fault: true,
          //       message: res.data.message,
          //       severity: "success",
          //     });
          //     // <Alert severity="success">You are loggedin</Alert>;
          //     history.push("/userInfo");
          //   } else {
          //     console.log(res.data.message);
          //     history.push({
          //       pathname: "/login",
          //       message: res.data.message,
          //     });
          //   }
          // } else {
          //   setSnack({ ...snack, fault: true, message: res.data.message });
          //   // <Alert severity="error">Incorrect password</Alert>;
          //   console.log(res.data.message);
          // }
        })
        .catch((err) => {
          console.log("error" + err);
        });
    } else {
      setSnack({
        ...snack,
        fault: true,
        message: "Enter correct detail",
        severity: "error",
      });
    }
    console.log("submitting");
  };

  const onGoogleResponse = async (resp) => {
    console.log(resp);
    await axios
      .post(`${base_url}user/googleregister`, {
        idToken: resp.tokenId,
      })
      .then((res) => {
        console.log(res);
        if (res.data.message === "google added") {
          // history.push({
          //   pathname: "/userInfo",
          //   params: {
          //     fault: true,
          //     message: "User signup success",
          //   },
          // });
          // ${res.data.user._id}
        } else {
          history.push("/login");
          setSnack({
            ...snack,
            fault: true,
            message: "User already exist",
            severity: "error",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFacebookResponse = (response) => {
    console.log(response);
    const { userID, accessToken } = response;
    axios
      .post(`${base_url}user/facebookregister`, {
        userID,
        accessToken,
      })
      .then((res) => {
        console.log(res.data);
        // informParent(res);
      })
      .catch((error) => {
        console.log("FACEBOOK SIGNIN ERROR", error.response);
      });
  };

  const authHandler = (err, data) => {
    console.log(err, data);
  };

  const onGithubResponse = (response) => console.log(response);
  const onFailure = (response) => console.error(response);

  return (
    <>
      <Card sx={{ mx: "auto", width: "40%", p: 4, textAlign: "left" }}>
        <CardContent>
          {console.log(theme.palette.mode)}
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
                autocomplete
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
                          <VisibilityOff />
                        ) : (
                          <Visibility />
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
                clientId="147318885374-hslkg3ffdun8877mvo2u5p1dg8jgr418.apps.googleusercontent.com"
                render={(renderProps) => (
                  <Avatar
                    onClick={renderProps.onClick}
                    src={Google}
                    alt="google"
                  />
                )}
                buttonText=""
                onSuccess={onGoogleResponse}
                onFailure={onGoogleResponse}
              />
              <FacebookLogin
                appId="1034702324052153"
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
              <TwitterLogin
                authCallback={authHandler}
                consumerKey="xLYSfRJ9H8zcDcmduN6Kn11QP"
                consumerSecret="343Ocn2uhwgGYUoXKJlCzrjEHi35rlajlmJwNExMtBywJ7IXy3"
                render={(renderProps) => (
                  <Avatar
                    onClick={renderProps.onClick}
                    src={Twitter}
                    alt="twitter"
                  />
                )}
              />
              <GitHubLogin
                clientId="09a20728be4cbb8db076"
                onSuccess={onGithubResponse}
                onFailure={onFailure}
                render={(renderProps) => (
                  <Avatar
                    onClick={renderProps.onClick}
                    src={Github}
                    alt="github"
                  />
                )}
              />
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
        <Alert severity={snack.severity} onClose={handleClose}>
          {snack.severity}:{snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Signup;
