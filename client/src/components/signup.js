import React, { useRef, useState } from "react";
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
  const twitterRef = useRef();
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

  const onTwitterLogin = async () => {
    console.log(twitterRef.current);
    // console.log(twitterRef.current.handleLoginClick);
    const data = await twitterRef.current.handleLoginClick();
    console.log(data);
    // const er = await twitterRef.current.handleError(
    //   twitterRef.current.handleLoginClick()
    // );
    // console.log(er);
    // console.log(twitterRef.current.initializeProcess);
    // const value = await twitterRef.current.initializeProcess();
    // console.log(value);

    // // const error = await twitterRef.current.handleError("error");
    // // console.log(error);
    // // const popup = await twitterRef.current.handleClosingPopup();
    // // console.log(popup);
    // const dt = await twitterRef.current;
    // console.log(dt);
    // const poo = await twitterRef.current.state.popup.window;
    // console.log(poo);
    // try {
    //   const response = await axios.post(
    //     `${base_url}user/twitter/oauth/request_token`
    //   );

    //   const { oauth_token } = response.data;
    //   //Oauth Step 2
    //   window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`;
    // } catch {}
  };

  const onTwitterResponse = (err, data) => {
    console.log(err, data);
  };

  const onGithubResponse = async (response) => {
    console.log(response);
    const { code } = response;
    console.log(code);
    if (code) {
      await axios
        .post(
          "https://github.com/login/oauth/access_token",
          {},
          {
            params: {
              code: code ,
              client_id: `${process.env.REACT_APP_GITHUB_CLIENT}`,
              client_secret: `${process.env.REACT_APP_GITHUB_SECRET}`,
            },
          },
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
        .then((resp) => {
          console.log(resp);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const onFailure = (response) => {
    console.error(response);
  };

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
                onFailure={onGoogleResponse}
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
              <GitHubLogin
                clientId={`${process.env.REACT_APP_GITHUB_CLIENT}`}
                redirectUri=""
                state={`${process.env.REACT_APP_GITHUB_STATE}`}
                onSuccess={onGithubResponse}
                onFailure={onFailure}
              />
              <Avatar
                // onClick={renderProps.onClick}
                src={Github}
                alt="github"
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
