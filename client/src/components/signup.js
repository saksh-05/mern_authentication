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
import base_url from "../devpro/baseurl";
import { userEmailSchema, userPasswordSchema } from "./UserValidation";
import { Redirect } from "react-router";

const Signup = () => {
  const theme = useTheme();
  const [values, setValues] = useState({
    email: "",
    password: "",
    showpassword: false,
    emailHelperShow: false,
    passwordHelperShow: false,
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
        : console.log("error gone?");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(`${base_url}loginsignup`, {
        email: values.email,
        password: values.password,
      })
      .then((res) => {
        console.log(res.status);
        res.status===200 ? (
          <Redirect to="/userInfo" />
        ) : (
          console.log(res.data.message)
        );
      })
      .catch((err) => console.log(err));
    console.log("submitting");
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
              <Avatar src={Google} alt="google" />
              <Avatar src={Facebook} alt="facebook" />
              <Avatar src={Twitter} alt="twitter" />
              <Avatar src={Github} alt="github" />
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
              Already a member?<a href="login">Login</a>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default Signup;
