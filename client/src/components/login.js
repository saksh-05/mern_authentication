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

const Signup = () => {
  const theme = useTheme();
  const [values, setValues] = useState({
    password: "",
    showpassword: false,
  });

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
          <Box component="form">
            <Typography
              variant="h5"
              sx={{ fontWeight: "600", fontFamily: "Noto Sans", mt: 5,mb:4 }}
            >
              Login
            </Typography>
            <FormControl sx={{ mb: 2, width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
              <OutlinedInput
                label="email"
                id="outlined-adornment-email"
                value={values.email}
                startAdornment={
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl sx={{ mb: 3, width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange("password")}
                startAdornment={
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
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
              Already a member?<a href="/">Register</a>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default Signup;
