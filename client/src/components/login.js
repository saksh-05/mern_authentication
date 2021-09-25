import React, { useEffect, useState } from "react";
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
  Alert,
  Snackbar,
  TextField,
} from "@mui/material";
import logo from "../resources/devchallenges.svg";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Google from "../resources/Google.svg";
import Facebook from "../resources/Facebook.svg";
import Twitter from "../resources/Twitter.svg";
import Github from "../resources/Github.svg";
import { useTheme } from "@emotion/react";
import dlogo from "../resources/devchallenges-light.svg";
import axios from "axios";
import { userEmailSchema, userPasswordSchema } from "./UserValidation";
import base_url from "../devpro/baseurl";
import { useHistory } from "react-router";
import { authenticate, isAuth } from "../auth/auth";
import ReactGoogleLogin from "react-google-login";

const Login = (params) => {
  const theme = useTheme();
  const [values, setValues] = useState({
    email: "",
    password: "",
    showpassword: false,
  });
  const [snack, setSnack] = useState({
    fault: false,
    message: "",
    severity: "",
  });
  const history = useHistory();

  const handleChange = (prop) => (event) => {
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
        .post(`${base_url}user/login`, {
          email: values.email,
          password: values.password,
        })
        .then((res) => {
          // console.log(res);

          if (res.data.message === "success") {
            authenticate(res, () => {
              setValues({
                ...values,
                email: "",
                password: "",
              });
              isAuth()
                ? history.push({
                    pathname: "/userInfo",
                    params: {
                      fault: true,
                    },
                  })
                : setSnack({
                    ...snack,
                    fault: true,
                    message: "Enter correct detail",
                    severity: "error",
                  });
            });
            console.log(res.data.message);
          } else if (res.data.message === "not found") {
            setSnack({
              ...snack,
              fault: true,
              message: "User does not exist please signup",
              severity: "error",
            });
          } else {
            setSnack({
              ...snack,
              fault: true,
              message: "Incorrect password",
              severity: "error",
            });
            console.log(res.data.message);
            // history.push({
            //   pathname: "/login",
            //   message: res.data.message,
            // });
          }
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
  console.log(params.location.params);

  useEffect(() => {
    if (params.location.params !== undefined) {
      setSnack({
        ...snack,
        fault: true,
        message: params.location.params.message,
        severity: "info",
      });
    }
  }, [params.location.params]);

  const onResponse = async (resp) => {
    console.log(resp);
    await axios
      .post(`${base_url}user/googleregister`, {
        idToken: resp.tokenId,
      })
      .then((res) => {
        console.log(res);
        history.push({
          pathname: "/userInfo",
          params: {
            fault: true,
            message: "User signup success",
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
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
              sx={{ fontWeight: "600", fontFamily: "Noto Sans", mt: 5, mb: 4 }}
            >
              Login
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
              Login{" "}
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
                onSuccess={onResponse}
                onFailure={onResponse}
              />
              {/* <FacebookSignup />
              <Twitter />
              <GitHub /> */}
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
              Already a member?<a href="/">Register</a>
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Snackbar
        open={snack.fault}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert variant="filled" severity={snack.severity} onClose={handleClose}>
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
